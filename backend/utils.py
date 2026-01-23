import random
import string
from sqlalchemy.orm import Session
from models import Class


def generate_join_code(db: Session) -> str:
    """
    Generate a unique 6-character alphanumeric join code.
    Format: XX-XX-XX (e.g., A7-9B-C3)
    Case-insensitive for user entry.
    """
    def create_code():
        # Generate 6 random alphanumeric characters (uppercase)
        chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        # Format as XX-XX-XX for readability
        return f"{chars[0:2]}-{chars[2:4]}-{chars[4:6]}"
    
    # Keep generating until we find a unique code
    max_attempts = 100
    for _ in range(max_attempts):
        code = create_code()
        # Check if code already exists (case-insensitive)
        existing = db.query(Class).filter(
            Class.join_code.ilike(code)
        ).first()
        
        if not existing:
            return code
    
    # If we somehow can't generate a unique code after 100 attempts
    # (extremely unlikely with 36^6 possibilities)
    raise ValueError("Unable to generate unique join code. Please try again.")


def normalize_join_code(code: str) -> str:
    """
    Normalize join code for lookup.
    Removes dashes and converts to uppercase for consistent storage.
    """
    return code.replace("-", "").upper()


def format_join_code(code: str) -> str:
    """
    Format a 6-character code with dashes for display.
    Input: "A79BC3" -> Output: "A7-9B-C3"
    """
    clean_code = code.replace("-", "").upper()
    if len(clean_code) != 6:
        return code
    return f"{clean_code[0:2]}-{clean_code[2:4]}-{clean_code[4:6]}"
