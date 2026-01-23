# Testing Guide - Study Materials Feature

## Prerequisites

1. **Backend Running:** Port 8000
2. **Frontend Running:** Port 3000
3. **Two User Accounts:**
   - Teacher account
   - Student account

## Test Scenarios

### Test 1: Student Joins a Class

1. **Login as Student**
   - Go to http://localhost:3000/login
   - Login with student credentials

2. **Navigate to Join Class Page**
   - Click "Join a Class" button on student dashboard
   - OR go directly to http://localhost:3000/join-class

3. **Enter Join Code**
   - Get a join code from a teacher's class (format: XX-XX-XX)
   - Enter the code in the input field
   - It should auto-format as you type
   - Click "Join Class"

4. **Verify Success**
   - Should redirect to student dashboard
   - Class should appear in "My Classes" section

### Test 2: Teacher Uploads Study Material

1. **Login as Teacher**
   - Go to http://localhost:3000/login
   - Login with teacher credentials

2. **Navigate to Class Details**
   - Go to "My Classes" in sidebar
   - Click on a class card to view details
   - OR click "View Class" button

3. **Upload Material**
   - Click "Upload Material" button
   - Select a file (any type: PDF, DOC, PPT, etc.)
   - Enter a title (e.g., "Lecture Notes - Week 1")
   - Optionally add a description
   - Click "Upload"

4. **Verify Upload**
   - Material should appear in the materials list
   - Should show: title, description, uploader, date, file size, file type
   - Download button should be visible

### Test 3: Student Views Study Materials

1. **Login as Student** (who joined the class)

2. **Navigate to Class**
   - Go to "My Classes" in sidebar
   - Click on the class you joined

3. **View Materials**
   - All uploaded materials should be visible
   - Each material shows: title, description, uploader name, date, file size
   - Download button should work

4. **Download Material**
   - Click "Download" button on any material
   - File should open in new tab or download

### Test 4: Teacher Manages Students

1. **Login as Teacher**

2. **Go to Class Details**
   - Navigate to class details page

3. **View Enrolled Students**
   - Scroll down to "Enrolled Students" section
   - Should see list of all enrolled students
   - Each shows: username, email, enrollment date

4. **Remove Student**
   - Click "Remove" button next to a student
   - Confirm the action
   - Student should be removed from list
   - Student should no longer see class materials

### Test 5: Material Management

1. **Login as Teacher**

2. **Go to Class with Materials**
   - Navigate to class details

3. **Delete Material**
   - Click trash icon on a material
   - Confirm deletion
   - Material should disappear from list
   - File should be deleted from server

4. **Verify Students Can't Delete**
   - Login as student
   - Go to class materials
   - Should NOT see delete/trash icons

## Expected Behaviors

### Security

✅ Only teachers can upload materials  
✅ Only teachers can delete materials  
✅ Only enrolled students + teacher can view materials  
✅ Students cannot remove other students  
✅ Unenrolled users cannot access class materials

### UI/UX

✅ Join code auto-formats as XX-XX-XX  
✅ File upload shows progress/loading state  
✅ Materials sorted by upload date (newest first)  
✅ File sizes displayed in KB or MB  
✅ Download opens in new tab  
✅ Confirmation dialogs for destructive actions

### Error Handling

✅ Invalid join code shows error message  
✅ Duplicate join attempt shows error  
✅ Upload without file shows validation error  
✅ Large files show appropriate error  
✅ Network errors show user-friendly messages

## API Endpoints to Test

### Materials Endpoints

1. **Upload Material**
   ```
   POST /api/materials/upload/{class_id}
   Headers: Authorization: Bearer <token>
   Body: FormData with file, title, description
   ```

2. **Get Class Materials**
   ```
   GET /api/materials/class/{class_id}
   Headers: Authorization: Bearer <token>
   ```

3. **Delete Material**
   ```
   DELETE /api/materials/{material_id}
   Headers: Authorization: Bearer <token>
   ```

### Testing with cURL

```bash
# Get materials for class ID 1
curl -X GET http://localhost:8000/api/materials/class/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upload material
curl -X POST http://localhost:8000/api/materials/upload/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "description=Test upload"
```

## Database Verification

Check if study_materials table was created:

1. Connect to your Neon DB
2. Run:
   ```sql
   SELECT * FROM study_materials;
   SELECT * FROM enrollments;
   ```

## Common Issues

### Issue: "Material not found" when downloading
**Solution:** Check that static files are mounted correctly in main.py

### Issue: Upload fails with 413 error
**Solution:** File too large - implement file size limit

### Issue: Student can't see materials after joining
**Solution:** Verify enrollment was successful in database

### Issue: Download opens corrupted file
**Solution:** Check file was saved correctly in uploads/materials/

## Success Criteria

✅ Students can join classes using join codes  
✅ Teachers can upload study materials  
✅ Students can view and download materials  
✅ Teachers can manage students (remove)  
✅ Teachers can delete materials  
✅ Files are stored securely  
✅ Access control works correctly  
✅ UI is responsive and user-friendly  

## Next Steps After Testing

If all tests pass:
1. Consider adding file type restrictions
2. Implement file size limits
3. Add pagination for large material lists
4. Consider cloud storage integration
5. Add material categories/folders
6. Implement download tracking/analytics
