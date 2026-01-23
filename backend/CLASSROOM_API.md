# Classroom Management API Documentation

Complete implementation of **REQ-4.2: Classroom Management** feature.

## ✅ Implemented Requirements

### REQ-4.2.1: Class Creation & Configuration

- ✅ **REQ-4.2.1.1**: Teachers can create unlimited classes
- ✅ **REQ-4.2.1.2**: Unique class names per teacher (database constraint)
- ✅ **REQ-4.2.1.3**: Auto-generated unique 6-character join codes (XX-XX-XX format)
- ✅ **REQ-4.2.1.4**: Archive classes (read-only, data preserved)

### REQ-4.2.2: Student Enrollment

- ✅ **REQ-4.2.2.1**: Students join classes via join code
- ✅ **REQ-4.2.2.2**: Prevents duplicate enrollments (database constraint)
- ✅ **REQ-4.2.2.3**: Teachers can remove students (revokes access)
- ✅ **REQ-4.2.2.4**: Enrollment timestamp for auditing

## 📊 Database Schema

### Classes Table
```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    join_code VARCHAR(6) UNIQUE NOT NULL,
    teacher_id INTEGER REFERENCES users(id) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(teacher_id, name)  -- REQ-4.2.1.2
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) NOT NULL,
    class_id INTEGER REFERENCES classes(id) NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- REQ-4.2.2.4
    UNIQUE(student_id, class_id)  -- REQ-4.2.2.2
);
```

## 🔌 API Endpoints

### 1. Create Class (Teacher Only)

**POST** `/api/classes/`

Creates a new class with auto-generated join code.

**Request Body:**
```json
{
  "name": "CS101 - Intro to AI",
  "description": "Introduction to Artificial Intelligence"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "CS101 - Intro to AI",
  "description": "Introduction to Artificial Intelligence",
  "join_code": "A7-9B-C3",
  "teacher_id": 1,
  "is_archived": false,
  "created_at": "2026-01-23T10:30:00Z",
  "student_count": 0
}
```

**Requirements Satisfied:** REQ-4.2.1.1, REQ-4.2.1.2, REQ-4.2.1.3

---

### 2. Get My Classes

**GET** `/api/classes/my-classes?include_archived=false`

Returns classes based on user role:
- **Teachers**: Classes they own
- **Students**: Classes they're enrolled in

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "CS101 - Intro to AI",
    "description": "Introduction to Artificial Intelligence",
    "join_code": "A7-9B-C3",
    "teacher_id": 1,
    "is_archived": false,
    "created_at": "2026-01-23T10:30:00Z",
    "student_count": 5
  }
]
```

---

### 3. Get Class Details

**GET** `/api/classes/{class_id}`

Returns detailed class information with enrolled students list.

**Response (200):**
```json
{
  "id": 1,
  "name": "CS101 - Intro to AI",
  "description": "Introduction to Artificial Intelligence",
  "join_code": "A7-9B-C3",
  "teacher_id": 1,
  "is_archived": false,
  "created_at": "2026-01-23T10:30:00Z",
  "student_count": 2,
  "students": [
    {
      "id": 3,
      "username": "student1",
      "full_name": "John Student",
      "email": "student@example.com",
      "enrolled_at": "2026-01-23T11:00:00Z"
    }
  ]
}
```

**Access Control:**
- Teachers: Can only view their own classes
- Students: Can only view classes they're enrolled in

---

### 4. Join Class (Students Only)

**POST** `/api/classes/join`

Students join a class using a join code.

**Request Body:**
```json
{
  "join_code": "A7-9B-C3"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "CS101 - Intro to AI",
  "description": "Introduction to Artificial Intelligence",
  "join_code": "A79BC3",
  "teacher_id": 1,
  "is_archived": false,
  "created_at": "2026-01-23T10:30:00Z",
  "student_count": 6
}
```

**Error Cases:**
- 404: Invalid join code
- 400: Already enrolled
- 400: Class is archived
- 400: Teachers cannot join as students

**Requirements Satisfied:** REQ-4.2.2.1, REQ-4.2.2.2, REQ-4.2.2.4

---

### 5. Remove Student from Class (Teacher Only)

**DELETE** `/api/classes/{class_id}/students/{student_id}`

Removes a student from a class, revoking all access.

**Response (204):** No content

**Requirements Satisfied:** REQ-4.2.2.3

---

### 6. Update/Archive Class (Teacher Only)

**PATCH** `/api/classes/{class_id}`

Update class details or archive it.

**Request Body:**
```json
{
  "name": "CS101 - AI (Spring 2026)",
  "description": "Updated description",
  "is_archived": true
}
```

**Response (200):** Updated class object

**Requirements Satisfied:** REQ-4.2.1.4

---

### 7. Delete Class (Teacher Only)

**DELETE** `/api/classes/{class_id}`

Permanently deletes a class and all enrollments.

**Response (204):** No content

**Note:** Consider archiving instead for data preservation.

---

## 🔒 Security & Access Control

### Data Isolation
- Students in "Class A" cannot access "Class B" materials unless enrolled
- Enforced at database level (enrollment table) and API level (access checks)

### Role-Based Access

| Endpoint | Teacher | Student |
|----------|---------|---------|
| Create Class | ✅ | ❌ |
| View Own Classes | ✅ (owned) | ✅ (enrolled) |
| View Class Details | ✅ (own only) | ✅ (enrolled only) |
| Join Class | ❌ | ✅ |
| Remove Student | ✅ (own class) | ❌ |
| Archive Class | ✅ (own class) | ❌ |
| Delete Class | ✅ (own class) | ❌ |

---

## 🔑 Join Code System

### Format
- **Display Format**: `XX-XX-XX` (e.g., `A7-9B-C3`)
- **Storage Format**: `XXXXXX` (6 uppercase alphanumeric)
- **Case-Insensitive**: Users can enter `a7-9b-c3` or `A79BC3`

### Generation Algorithm
- Uses uppercase letters (A-Z) and digits (0-9)
- Total combinations: 36^6 = 2,176,782,336 possible codes
- Uniqueness checked against database
- Maximum 100 generation attempts (extremely unlikely to fail)

### Code Normalization
```python
# User input variations (all valid):
"A7-9B-C3"  →  "A79BC3"
"a79bc3"    →  "A79BC3"
"A7 9B C3"  →  "A79BC3"
```

---

## 📝 Usage Examples

### Teacher Workflow

```bash
# 1. Teacher creates a class
curl -X POST "http://localhost:8000/api/classes/" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CS101 - Intro to AI",
    "description": "Spring 2026"
  }'

# Response: { "join_code": "A7-9B-C3", ... }

# 2. Teacher views their classes
curl -X GET "http://localhost:8000/api/classes/my-classes" \
  -H "Authorization: Bearer $TEACHER_TOKEN"

# 3. Teacher checks who joined
curl -X GET "http://localhost:8000/api/classes/1" \
  -H "Authorization: Bearer $TEACHER_TOKEN"

# 4. Teacher removes unauthorized student
curl -X DELETE "http://localhost:8000/api/classes/1/students/5" \
  -H "Authorization: Bearer $TEACHER_TOKEN"

# 5. Teacher archives class at semester end
curl -X PATCH "http://localhost:8000/api/classes/1" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_archived": true}'
```

### Student Workflow

```bash
# 1. Student joins class with code
curl -X POST "http://localhost:8000/api/classes/join" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"join_code": "A7-9B-C3"}'

# 2. Student views enrolled classes
curl -X GET "http://localhost:8000/api/classes/my-classes" \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# 3. Student accesses class dashboard
curl -X GET "http://localhost:8000/api/classes/1" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## ✅ Testing the Implementation

### 1. Start the Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### 2. Access API Documentation

Visit: http://localhost:8000/docs

### 3. Test Scenarios

#### Scenario 1: Teacher Creates Class
1. Login as teacher
2. Go to POST `/api/classes/`
3. Enter class details
4. Verify unique join code is generated
5. Check `student_count` is 0

#### Scenario 2: Student Joins Class
1. Login as student
2. Go to POST `/api/classes/join`
3. Enter the join code from teacher
4. Verify successful enrollment
5. Check class appears in GET `/api/classes/my-classes`

#### Scenario 3: Duplicate Prevention
1. Student tries to join same class again
2. Verify error: "Already enrolled in this class"

#### Scenario 4: Teacher Removes Student
1. Login as teacher
2. Go to DELETE `/api/classes/{id}/students/{student_id}`
3. Verify student removed
4. Student should no longer see class in their list

#### Scenario 5: Archive Class
1. Login as teacher
2. Go to PATCH `/api/classes/{id}`
3. Set `is_archived: true`
4. Verify students can't join archived class
5. Verify data is preserved (read-only)

---

## 🗃️ Database Constraints

### Automatic Enforcement

1. **Unique Class Name per Teacher**
   ```sql
   UNIQUE(teacher_id, name)
   ```
   Prevents: Teacher from creating duplicate class names

2. **Unique Join Code**
   ```sql
   UNIQUE(join_code)
   ```
   Ensures: Every class has a globally unique code

3. **No Duplicate Enrollments**
   ```sql
   UNIQUE(student_id, class_id)
   ```
   Prevents: Student from joining same class twice

4. **Cascade Deletions**
   - Deleting a class → Deletes all enrollments
   - Deleting a user → Deletes their classes/enrollments

---

## 🎯 Feature Completeness

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| REQ-4.2.1.1 | ✅ | Unlimited class creation |
| REQ-4.2.1.2 | ✅ | Unique name constraint per teacher |
| REQ-4.2.1.3 | ✅ | Auto-generated 6-char join codes |
| REQ-4.2.1.4 | ✅ | Archive functionality (is_archived flag) |
| REQ-4.2.2.1 | ✅ | Join via code endpoint |
| REQ-4.2.2.2 | ✅ | Duplicate enrollment prevention |
| REQ-4.2.2.3 | ✅ | Remove student endpoint |
| REQ-4.2.2.4 | ✅ | Enrollment timestamp (enrolled_at) |

---

## 🚀 Next Steps

### Integration with Frontend
- Create class management UI
- Add "Join Class" modal for students
- Display class dashboard with enrolled students
- Show join code to teachers

### Additional Features (Future)
- Bulk student import (CSV)
- Class analytics (engagement metrics)
- Co-teacher support
- Student transfer between classes
- Class templates

### Performance Optimization
- Add database indexes on frequently queried fields
- Implement pagination for large class lists
- Cache student counts

---

## 📞 Support

For issues or questions about the Classroom Management API:
- Check the interactive docs: http://localhost:8000/docs
- Review error messages (detailed and specific)
- Check database constraints for integrity errors

---

**Implementation Complete! ✅**

All classroom management requirements have been implemented with proper security, validation, and error handling.
