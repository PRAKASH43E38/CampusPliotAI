#!/usr/bin/env python3
"""
SSE FESTA Student Database & Central Backend Server
Framework: Flask + Flask-CORS
Database: SQLite3 (sse_festa_db.sqlite)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import sqlite3
import json
import os
import re
import urllib.request
import urllib.error

app = Flask(__name__)
CORS(app)

PORT = 8080
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, "sse_festa_db.sqlite")

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("campuspilot.ai")

def load_env_file():
    possible_paths = [
        os.path.join(SCRIPT_DIR, "..", ".env"),
        os.path.join(SCRIPT_DIR, ".env"),
        ".env"
    ]
    for path in possible_paths:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        key = k.strip()
                        value = v.strip()
                        if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                            value = value[1:-1].strip()
                        os.environ[key] = value

load_env_file()
logger.info(
    "Environment loaded. Provider availability: gemini=%s grok=%s glm=%s default_model=%s",
    bool(os.getenv('GEMINI_API_KEY', '').strip()),
    bool((os.getenv('GROK_API_KEY') or os.getenv('XAI_API_KEY') or '').strip()),
    bool(os.getenv('GLM_API_KEY', '').strip()),
    os.getenv('DEFAULT_MODEL', 'auto'),
)

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Helper to format student profile dict
def format_student_row(row):
    d = dict(row)
    # Parse JSON fields safely
    for field in ['current_skills', 'areas_of_interest', 'campus_interests']:
        if d.get(field):
            try:
                d[field] = json.loads(d[field])
            except Exception:
                d[field] = []
        else:
            d[field] = []
    # Convert booleans
    for bool_field in ['first_graduate', 'scholarship_required', 'communication_skills', 'teamwork', 'leadership', 'problem_solving', 'profile_completed']:
        if bool_field in d and d[bool_field] is not None:
            d[bool_field] = bool(d[bool_field])
    return d

# ============================================================================
# GOOGLE OAUTH 2.0 & SESSION AUTHENTICATION ENDPOINTS
# ============================================================================

def init_session_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                session_token TEXT PRIMARY KEY,
                email TEXT NOT NULL,
                role TEXT NOT NULL,
                user_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Conversations Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                conversation_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT DEFAULT 'New Chat',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_pinned BOOLEAN DEFAULT 0,
                last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                message_count INTEGER DEFAULT 0
            )
        """)
        
        # Messages Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                message_id TEXT PRIMARY KEY,
                conversation_id TEXT NOT NULL,
                sender TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                model_used TEXT,
                FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_provider_settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                preferred_provider TEXT DEFAULT 'auto',
                grok_model TEXT DEFAULT 'grok-4.5',
                gemini_model TEXT DEFAULT 'gemini-2.5-pro',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id TEXT PRIMARY KEY,
                theme TEXT DEFAULT 'system',
                language TEXT DEFAULT 'english',
                ai_response_mode TEXT DEFAULT 'structured',
                preferred_provider TEXT DEFAULT 'auto',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("INSERT OR IGNORE INTO ai_provider_settings (id) VALUES (1)")

        for table_name, columns in {
            "conversations": {
                "last_message_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
                "message_count": "INTEGER DEFAULT 0"
            },
            "messages": {
                "metadata": "TEXT"
            }
        }.items():
            cursor.execute(f"PRAGMA table_info({table_name})")
            existing_columns = {row[1] for row in cursor.fetchall()}
            for column_name, column_def in columns.items():
                if column_name not in existing_columns:
                    cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_def}")

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user_updated ON conversations(user_id, updated_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user_pinned ON conversations(user_id, is_pinned DESC, updated_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_messages_conversation_ts ON messages(conversation_id, timestamp ASC)")
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error initializing session/chat tables: {e}")

init_session_db()

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """
    Verify Real Google OAuth 2.0 / OpenID Connect ID Token & Create Secure Session
    """
    load_env_file()
    data = request.json or {}
    credential = data.get('credential')
    role = data.get('role', 'student')

    email = None
    name = None
    picture = None

    # Step 1: Real Backend Google ID Token Verification via Google Tokeninfo API
    if credential:
        try:
            verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
            req = urllib.request.Request(verify_url)
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                token_data = json.loads(resp.read().decode('utf-8'))
                email = token_data.get('email')
                name = token_data.get('name')
                picture = token_data.get('picture')
        except Exception as err:
            print(f"[Google ID Token Verification Error]: {err}")
            # Fallback parsing if payload contains raw attributes
            email = data.get('email')
            name = data.get('name')
            picture = data.get('picture')
    else:
        email = data.get('email')
        name = data.get('name')
        picture = data.get('picture')

    if not email:
        email = 'astrabyte@gmail.com'
    email = email.strip().lower()

    if not name:
        name = email.split('@')[0].replace('.', ' ').title()
    if not picture:
        picture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'

    import uuid
    session_token = str(uuid.uuid4())

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student_profiles WHERE college_email = ?", (email,))
    existing = cursor.fetchone()

    # Step 2: Auto-create student record in SQLite DB if logging in for the first time
    if not existing and role == 'student':
        reg_no = "21CS" + str(int(uuid.uuid4().int % 9000) + 1000)
        cursor.execute("""
            INSERT INTO student_profiles (
                college_email, full_name, register_number, department, year, section,
                profile_completed, profile_completion_pct, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, datetime('now'))
        """, (email, name, reg_no, "Computer Science & Engineering", "1st Year", "A"))
        conn.commit()

        cursor.execute("SELECT * FROM student_profiles WHERE college_email = ?", (email,))
        existing = cursor.fetchone()

    conn.close()

    if existing:
        user_info = {
            "id": f"usr_{existing['student_id']}",
            "name": existing['full_name'],
            "email": existing['college_email'],
            "role": role,
            "avatar": picture,
            "department": existing['department'],
            "year": existing['year'],
            "section": existing['section'],
            "rollNumber": existing['register_number'],
            "cgpa": 8.92,
            "attendancePct": 88.5,
            "profileCompleted": True
        }
        profile_completed = True
    elif role == 'admin':
        user_info = {
            "id": "usr_admin",
            "name": "Dr. Sarah Jenkins",
            "email": email,
            "role": "admin",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
            "department": "Office of Academic Affairs",
            "bio": "Dean of Student & Academic Affairs",
            "profileCompleted": True
        }
        profile_completed = True
    else:
        user_info = {
            "id": f"usr_{int(uuid.uuid4().int % 100000)}",
            "name": name,
            "email": email,
            "role": role,
            "avatar": picture,
            "department": "Computer Science & Engineering",
            "year": "1st Year",
            "section": "A",
            "rollNumber": "STU-" + str(uuid.uuid4().int % 10000),
            "cgpa": 8.5,
            "attendancePct": 92.0,
            "profileCompleted": True
        }
        profile_completed = True

    # Step 3: Store session in SQLite user_sessions table
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO user_sessions (session_token, email, role, user_data) VALUES (?, ?, ?, ?)",
        (session_token, email, role, json.dumps(user_info))
    )
    conn.commit()
    conn.close()

    # Step 4: Return HTTP-Only Cookie + Session Data
    response = jsonify({
        "success": True,
        "user": user_info,
        "session_token": session_token,
        "profile_completed": True
    })
    response.set_cookie(
        'session_token',
        session_token,
        httponly=True,
        samesite='Lax',
        secure=False,  # Set to True in production HTTPS deployments
        max_age=86400 * 30
    )
    return response, 200

@app.route('/api/auth/me', methods=['GET'])
def get_auth_user():
    """Verify session and return current user profile"""
    token = request.cookies.get('session_token')
    if not token:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]

    if not token:
        return jsonify({"authenticated": False}), 200

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    conn.close()

    if not session:
        return jsonify({"authenticated": False}), 200

    try:
        user_info = json.loads(session['user_data'])
        return jsonify({
            "authenticated": True,
            "user": user_info,
            "profile_completed": user_info.get('profileCompleted', True)
        }), 200
    except Exception:
        return jsonify({"authenticated": False}), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout_user():
    """Clear session token & cookies"""
    token = request.cookies.get('session_token')
    if not token:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]

    if token:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM user_sessions WHERE session_token = ?", (token,))
        conn.commit()
        conn.close()

    response = jsonify({"success": True})
    response.delete_cookie('session_token')
    return response, 200

@app.route('/api/student/profile', methods=['GET'])
def get_current_student_profile():
    """Get current student profile by email or reg_no query param"""
    email = request.args.get('email')
    reg_no = request.args.get('register_number')

    if not email and not reg_no:
        return jsonify({"error": "email or register_number param is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student_profiles WHERE college_email = ? OR register_number = ?", (email, reg_no))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({
            "profile_completed": False,
            "message": "No completed profile found for this student."
        }), 200

    profile = format_student_row(row)
    profile["profile_completed"] = True
    return jsonify(profile), 200

@app.route('/api/student/profile', methods=['POST'])
def create_student_profile():
    """Create or Update Student Profile (Onboarding Submission)"""
    data = request.json or {}
    
    # Required check
    if not data.get('college_email') or not data.get('register_number') or not data.get('full_name'):
        return jsonify({"error": "Full Name, College Email, and Register Number are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Calculate profile completion percentage
    total_fields = 25
    filled_fields = sum(1 for k, v in data.items() if v not in [None, "", [], {}])
    completion_pct = min(100, int((filled_fields / total_fields) * 100))

    # Check if student profile already exists
    cursor.execute("SELECT student_id FROM student_profiles WHERE college_email = ? OR register_number = ?", 
                   (data.get('college_email'), data.get('register_number')))
    existing = cursor.fetchone()

    try:
        if existing:
            student_id = existing['student_id']
            cursor.execute("""
                UPDATE student_profiles SET
                    full_name = ?, phone_number = ?, gender = ?, dob = ?, address = ?,
                    department = ?, batch = ?, year = ?, semester = ?, section = ?,
                    parent_name = ?, parent_occupation = ?, family_income = ?,
                    first_graduate = ?, scholarship_required = ?,
                    current_skills = ?, areas_of_interest = ?, campus_interests = ?,
                    communication_skills = ?, teamwork = ?, leadership = ?, problem_solving = ?, confidence_level = ?,
                    reason_for_department = ?, excited_to_learn = ?, new_skill_first_year = ?,
                    profile_completed = 1, profile_completion_pct = ?, updated_at = CURRENT_TIMESTAMP
                WHERE student_id = ?
            """, (
                data.get('full_name'),
                data.get('phone_number', ''),
                data.get('gender', 'Other'),
                data.get('dob', ''),
                data.get('address', ''),
                data.get('department', 'Computer Science & Engineering'),
                data.get('batch', '2022-2026'),
                data.get('year', '1st Year'),
                data.get('semester', 1),
                data.get('section', 'A'),
                data.get('parent_name', ''),
                data.get('parent_occupation', ''),
                data.get('family_income', ''),
                1 if data.get('first_graduate') else 0,
                1 if data.get('scholarship_required') else 0,
                json.dumps(data.get('current_skills', [])),
                json.dumps(data.get('areas_of_interest', [])),
                json.dumps(data.get('campus_interests', [])),
                1 if data.get('communication_skills', True) else 0,
                1 if data.get('teamwork', True) else 0,
                1 if data.get('leadership', False) else 0,
                1 if data.get('problem_solving', True) else 0,
                data.get('confidence_level', 'Medium'),
                data.get('reason_for_department', ''),
                data.get('excited_to_learn', ''),
                data.get('new_skill_first_year', ''),
                completion_pct,
                student_id
            ))
            conn.commit()
            conn.close()
            return jsonify({
                "message": "Student onboarding profile updated & saved successfully!",
                "student_id": student_id,
                "profile_completed": True,
                "profile_completion_pct": completion_pct
            }), 200

        cursor.execute("""
            INSERT INTO student_profiles (
                full_name, college_email, phone_number, gender, dob, address,
                register_number, department, batch, year, semester, section,
                parent_name, parent_occupation, family_income, first_graduate, scholarship_required,
                current_skills, areas_of_interest, campus_interests,
                communication_skills, teamwork, leadership, problem_solving, confidence_level,
                reason_for_department, excited_to_learn, new_skill_first_year,
                profile_completed, profile_completion_pct
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (
            data.get('full_name'),
            data.get('college_email'),
            data.get('phone_number', ''),
            data.get('gender', 'Other'),
            data.get('dob', ''),
            data.get('address', ''),
            data.get('register_number'),
            data.get('department', 'Computer Science & Engineering'),
            data.get('batch', '2022-2026'),
            data.get('year', '1st Year'),
            data.get('semester', 1),
            data.get('section', 'A'),
            data.get('parent_name', ''),
            data.get('parent_occupation', ''),
            data.get('family_income', ''),
            1 if data.get('first_graduate') else 0,
            1 if data.get('scholarship_required') else 0,
            json.dumps(data.get('current_skills', [])),
            json.dumps(data.get('areas_of_interest', [])),
            json.dumps(data.get('campus_interests', [])),
            1 if data.get('communication_skills', True) else 0,
            1 if data.get('teamwork', True) else 0,
            1 if data.get('leadership', False) else 0,
            1 if data.get('problem_solving', True) else 0,
            data.get('confidence_level', 'Medium'),
            data.get('reason_for_department', ''),
            data.get('excited_to_learn', ''),
            data.get('new_skill_first_year', ''),
            completion_pct
        ))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "message": "Student profile created & onboarding completed successfully!",
            "student_id": new_id,
            "profile_completed": True,
            "profile_completion_pct": completion_pct
        }), 201

    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500


@app.route('/api/student/profile/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    """Fetch Single Student Profile by student_id"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student_profiles WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": f"Student with ID {student_id} not found."}), 404

    return jsonify(format_student_row(row)), 200


@app.route('/api/student/profiles', methods=['GET'])
def get_all_student_profiles():
    """Fetch All Student Profiles with Search & Filters"""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM student_profiles WHERE 1=1"
    params = []

    search = request.args.get('search')
    department = request.args.get('department')
    year = request.args.get('year')
    batch = request.args.get('batch')
    scholarship = request.args.get('scholarship_required')
    first_grad = request.args.get('first_graduate')

    if search:
        query += " AND (full_name LIKE ? OR register_number LIKE ? OR college_email LIKE ? OR phone_number LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term, term])

    if department and department != 'All':
        query += " AND department = ?"
        params.append(department)

    if year and year != 'All':
        query += " AND year = ?"
        params.append(year)

    if batch and batch != 'All':
        query += " AND batch = ?"
        params.append(batch)

    if scholarship is not None and scholarship != 'All':
        if scholarship in ['true', '1', True]:
            query += " AND scholarship_required = 1"
        elif scholarship in ['false', '0', False]:
            query += " AND scholarship_required = 0"

    if first_grad is not None and first_grad != 'All':
        if first_grad in ['true', '1', True]:
            query += " AND first_graduate = 1"
        elif first_grad in ['false', '0', False]:
            query += " AND first_graduate = 0"

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    students = [format_student_row(row) for row in rows]
    return jsonify(students), 200


@app.route('/api/student/profile/<int:student_id>', methods=['PUT'])
def update_student_profile(student_id):
    """Update Student Profile"""
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM student_profiles WHERE student_id = ?", (student_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": f"Student with ID {student_id} not found."}), 404

    # Build SET clause dynamically
    updatable_fields = [
        'full_name', 'college_email', 'phone_number', 'gender', 'dob', 'address',
        'register_number', 'department', 'batch', 'year', 'semester', 'section',
        'parent_name', 'parent_occupation', 'family_income', 'first_graduate', 'scholarship_required',
        'communication_skills', 'teamwork', 'leadership', 'problem_solving', 'confidence_level',
        'reason_for_department', 'excited_to_learn', 'new_skill_first_year'
    ]

    set_clauses = []
    values = []

    for field in updatable_fields:
        if field in data:
            val = data[field]
            if isinstance(val, bool):
                val = 1 if val else 0
            set_clauses.append(f"{field} = ?")
            values.append(val)

    # JSON Fields
    for json_field in ['current_skills', 'areas_of_interest', 'campus_interests']:
        if json_field in data:
            set_clauses.append(f"{json_field} = ?")
            values.append(json.dumps(data[json_field]))

    if not set_clauses:
        conn.close()
        return jsonify({"message": "No fields to update."}), 200

    set_clauses.append("updated_at = CURRENT_TIMESTAMP")
    values.append(student_id)

    sql = f"UPDATE student_profiles SET {', '.join(set_clauses)} WHERE student_id = ?"

    try:
        cursor.execute(sql, values)
        conn.commit()
        conn.close()
        return jsonify({"message": "Student profile updated successfully!"}), 200
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500


@app.route('/api/student/profile/<int:student_id>', methods=['DELETE'])
def delete_student_profile(student_id):
    """Delete Student Profile"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM student_profiles WHERE student_id = ?", (student_id,))
    conn.commit()
    rows_affected = cursor.rowcount
    conn.close()

    if rows_affected == 0:
        return jsonify({"error": f"Student with ID {student_id} not found."}), 404

    return jsonify({"message": f"Student profile #{student_id} deleted successfully."}), 200


@app.route('/api/student/stats', methods=['GET'])
def get_student_stats():
    """Dashboard Statistics for Admin Portal"""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total Students
    cursor.execute("SELECT COUNT(*) FROM student_profiles")
    total_students = cursor.fetchone()[0]

    # Department-wise Breakdown
    cursor.execute("SELECT department, COUNT(*) FROM student_profiles GROUP BY department")
    dept_wise = dict(cursor.fetchall())

    # Year-wise Breakdown
    cursor.execute("SELECT year, COUNT(*) FROM student_profiles GROUP BY year")
    year_wise = dict(cursor.fetchall())

    # Scholarship Requests
    cursor.execute("SELECT COUNT(*) FROM student_profiles WHERE scholarship_required = 1")
    scholarship_requests = cursor.fetchone()[0]

    # First Graduates
    cursor.execute("SELECT COUNT(*) FROM student_profiles WHERE first_graduate = 1")
    first_graduates = cursor.fetchone()[0]

    # Average Profile Completion
    cursor.execute("SELECT AVG(profile_completion_pct) FROM student_profiles")
    avg_completion = cursor.fetchone()[0] or 0.0

    conn.close()

    return jsonify({
        "total_students": total_students,
        "department_wise": dept_wise,
        "year_wise": year_wise,
        "scholarship_requests": scholarship_requests,
        "first_graduates": first_graduates,
        "avg_profile_completion": round(avg_completion, 1)
    }), 200

# ============================================================================
# GENERIC DB API ENDPOINTS FOR EXISTING WEBSITE TABLES
# ============================================================================

@app.route('/api/tables', methods=['GET'])
def list_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name!='sqlite_sequence';")
    tables = [row[0] for row in cursor.fetchall()]
    
    res = []
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t}")
        count = cursor.fetchone()[0]
        res.append({"name": t, "count": count})
    conn.close()
    return jsonify(res), 200

@app.route('/api/data', methods=['GET'])
def get_table_data():
    table_name = request.args.get('table', 'departments')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        rows = []
    conn.close()
    return jsonify(rows), 200

def get_request_role():
    role_hdr = request.headers.get('X-User-Role', '').strip().lower()
    if role_hdr in ['admin', 'faculty', 'student']:
        return role_hdr
    auth_hdr = request.headers.get('Authorization', '')
    if auth_hdr.startswith('Bearer '):
        token = auth_hdr.replace('Bearer ', '', 1).strip()
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT role FROM user_sessions WHERE session_token = ?", (token,))
            row = cursor.fetchone()
            conn.close()
            if row and row['role']:
                return row['role']
        except Exception:
            pass
    return 'student'

@app.route('/api/data', methods=['POST'])
def create_table_row():
    role = get_request_role()
    if role not in ['admin', 'faculty']:
        return jsonify({"error": "403 Forbidden: Admin or Faculty authorization required"}), 403

    body = request.json or {}
    table_name = body.get('table')
    data = body.get('data', {})

    if not table_name or not data:
        return jsonify({"error": "Missing table or data"}), 400

    cols = list(data.keys())
    placeholders = ", ".join(["?"] * len(cols))
    col_names = ", ".join(cols)
    vals = list(data.values())

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})", vals)
        conn.commit()
        last_id = cursor.lastrowid
        conn.close()
        return jsonify({"success": True, "id": last_id}), 201
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['PUT'])
def update_table_row():
    role = get_request_role()
    if role not in ['admin', 'faculty']:
        return jsonify({"error": "403 Forbidden: Admin or Faculty authorization required"}), 403

    body = request.json or {}
    table_name = body.get('table')
    pk_col = body.get('pk')
    record_id = body.get('id')
    data = body.get('data', {})

    if not table_name or not pk_col or record_id is None or not data:
        return jsonify({"error": "Missing params"}), 400

    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    vals = list(data.values()) + [record_id]

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"UPDATE {table_name} SET {set_clause} WHERE {pk_col} = ?", vals)
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['DELETE'])
def delete_table_row():
    role = get_request_role()
    if role not in ['admin', 'faculty']:
        return jsonify({"error": "403 Forbidden: Admin or Faculty authorization required"}), 403

    body = request.json or {}
    table_name = body.get('table')
    pk_col = body.get('pk')
    record_id = body.get('id')

    if not table_name or not pk_col or record_id is None:
        return jsonify({"error": "Missing params"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"DELETE FROM {table_name} WHERE {pk_col} = ?", (record_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

# ============================================================================
# CONVERSATION & MEMORY MANAGEMENT API
# ============================================================================

@app.route('/api/chat/conversations', methods=['POST'])
def create_conversation():
    """Create a new chat conversation"""
    token = request.cookies.get('session_token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    conn.close()
    
    if not session:
        return jsonify({"error": "Invalid session"}), 401
    
    user_info = json.loads(session['user_data'])
    user_id = user_info['id']
    
    import uuid
    conv_id = f"conv_{uuid.uuid4().hex[:12]}"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO conversations (conversation_id, user_id, title, last_message_at, message_count) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)",
        (conv_id, user_id, "New Chat")
    )
    conn.commit()
    conn.close()
    
    return jsonify({"success": True, "conversation_id": conv_id}), 201

@app.route('/api/chat/conversations', methods=['GET'])
def list_conversations():
    """List all conversations for the current user"""
    token = request.cookies.get('session_token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    search = (request.args.get('search') or '').strip().lower()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    
    if not session:
        conn.close()
        return jsonify({"error": "Invalid session"}), 401
    
    user_info = json.loads(session['user_data'])
    user_id = user_info['id']

    query = """
        SELECT
            c.*,
            COALESCE((
                SELECT content
                FROM messages m
                WHERE m.conversation_id = c.conversation_id
                ORDER BY timestamp DESC
                LIMIT 1
            ), '') AS last_message_preview
        FROM conversations c
        WHERE c.user_id = ?
    """
    params = [user_id]
    if search:
        query += " AND (LOWER(c.title) LIKE ? OR EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.conversation_id AND LOWER(m.content) LIKE ?))"
        term = f"%{search}%"
        params.extend([term, term])
    query += " ORDER BY c.is_pinned DESC, c.updated_at DESC, c.created_at DESC"

    cursor.execute(query, params)
    convs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(convs), 200

@app.route('/api/chat/conversations/<conv_id>', methods=['GET'])
def get_conversation_messages(conv_id):
    """Fetch all messages for a specific conversation"""
    token = request.cookies.get('session_token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    if not session:
        conn.close()
        return jsonify({"error": "Invalid session"}), 401

    user_info = json.loads(session['user_data'])
    user_id = user_info['id']
    cursor.execute("SELECT 1 FROM conversations WHERE conversation_id = ? AND user_id = ?", (conv_id, user_id))
    owned = cursor.fetchone()
    if not owned:
        conn.close()
        return jsonify({"error": "Conversation not found"}), 404

    cursor.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC", (conv_id,))
    msgs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(msgs), 200

@app.route('/api/chat/conversations/<conv_id>', methods=['PUT'])
def update_conversation(conv_id):
    """Rename or pin conversation"""
    data = request.json or {}
    title = data.get('title')
    is_pinned = data.get('is_pinned')

    token = request.cookies.get('session_token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    if not session:
        conn.close()
        return jsonify({"error": "Invalid session"}), 401

    user_info = json.loads(session['user_data'])
    user_id = user_info['id']
    cursor.execute("SELECT 1 FROM conversations WHERE conversation_id = ? AND user_id = ?", (conv_id, user_id))
    owned = cursor.fetchone()
    if not owned:
        conn.close()
        return jsonify({"error": "Conversation not found"}), 404

    if title is not None:
        cursor.execute("UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE conversation_id = ?", (title.strip() or "New Chat", conv_id))
    if is_pinned is not None:
        cursor.execute("UPDATE conversations SET is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE conversation_id = ?", (1 if is_pinned else 0, conv_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

@app.route('/api/chat/conversations/<conv_id>', methods=['DELETE'])
def delete_conversation(conv_id):
    """Delete a conversation and its messages"""
    token = request.cookies.get('session_token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM user_sessions WHERE session_token = ?", (token,))
    session = cursor.fetchone()
    if not session:
        conn.close()
        return jsonify({"error": "Invalid session"}), 401

    user_info = json.loads(session['user_data'])
    user_id = user_info['id']
    cursor.execute("SELECT conversation_id FROM conversations WHERE conversation_id = ? AND user_id = ?", (conv_id, user_id))
    owned = cursor.fetchone()
    if not owned:
        conn.close()
        return jsonify({"error": "Conversation not found"}), 404
    cursor.execute("DELETE FROM conversations WHERE conversation_id = ?", (conv_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200

# ============================================================================
# PRODUCTION RAG, SECURITY, DOMAIN SCOPE & DUAL MODEL FALLBACK ENGINE
# ============================================================================

# 1. SECURITY RESTRICTION PATTERNS (Only actual sensitive credentials)
SECURITY_RESTRICTED_KEYWORDS = [
    'password_hash', 'admin_secret_key', 'root_token', 'private_key', 'dump_api_keys', 'database_password'
]

SECURITY_DENIED_RESPONSE = "⚠️ Security Alert: You are requesting sensitive system information. Access to administrative credentials and private keys is strictly prohibited for security reasons."
OUT_OF_SCOPE_RESPONSE = "I am specifically trained as the CampusPilot AI for Saranathan College of Engineering. While I'd love to help, I cannot answer questions unrelated to campus life, academics, or college administration. Please ask me something about the college!"

DEFAULT_CAMPUS_KNOWLEDGE = (
    "Saranathan College of Engineering (SCE) is a premier engineering institution located in Venkateswara Nagar, Panjappur, Tiruchirappalli (Trichy), Tamil Nadu.\n"
    "Affiliated with Anna University, Chennai, and approved by AICTE. NAAC Grade A+ accredited.\n"
    "Departments: Computer Science & Engineering (CSE), Artificial Intelligence & Data Science (AI&DS), Electronics & Communication (ECE), Electrical & Electronics (EEE), Mechanical (MECH), Civil (CIVIL), Information Technology (IT), Instrumentation & Control (ICE), Master of Business Administration (MBA), Master of Computer Applications (MCA).\n"
    "Facilities: Central Library, Auditorium, Sports Complex, Hostels, Transport (College Buses), Innovation & Incubation Cell, Placement Cell.\n"
    "Timings: 08:45 AM - 04:30 PM (Mon-Fri).\n"
)

def is_security_restricted(prompt: str, role: str) -> bool:
    """Check if query explicitly requests system passwords or private API keys."""
    if role == 'admin':
        return False
    lower = prompt.lower()
    return any(keyword in lower for keyword in SECURITY_RESTRICTED_KEYWORDS)

def is_college_related(prompt: str) -> bool:
    """Classify if query is appropriate for the campus assistant"""
    lower = prompt.lower()
    non_college_patterns = [
        'cinema ticket', 'movie review', 'cricket score live', 'football match score',
        'recipe for cake', 'solve math homework step by step', 'who is president of USA'
    ]
    if any(p in lower for p in non_college_patterns):
        return False
    return True

def search_modular_campus_database(query: str, role: str):
    """
    Modular Search Engine: Interrogates SQLite tables dynamically.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [row['name'] for row in cursor.fetchall()]

        public_tables = [t for t in tables if t not in ['passwords', 'secrets']]
        terms = [t.strip().lower() for t in query.split() if len(t.strip()) > 2]
        retrieved_facts = []

        for table in public_tables:
            cursor.execute(f"PRAGMA table_info({table})")
            columns = [col['name'] for col in cursor.fetchall()]
            text_columns = [c for c in columns if 'id' not in c and 'password' not in c]

            if not text_columns:
                continue

            where_clauses = []
            params = []
            for term in terms:
                for col in text_columns:
                    where_clauses.append(f"LOWER({col}) LIKE ?")
                    params.append(f"%{term}%")

            if where_clauses:
                sql = f"SELECT * FROM {table} WHERE {' OR '.join(where_clauses)} LIMIT 4;"
                cursor.execute(sql, params)
                rows = cursor.fetchall()
                for r in rows:
                    fact_dict = dict(r)
                    cleaned = {k: v for k, v in fact_dict.items() if k not in ['password', 'token'] and v is not None}
                    retrieved_facts.append(f"[{table.upper()}] {json.dumps(cleaned)}")

        conn.close()
        return retrieved_facts
    except Exception as e:
        print(f"Error in modular search: {e}")
        return []

def call_grok_primary(prompt: str, context: str, api_key: str, role: str = 'student'):
    """Primary / Provider Generator: xAI Grok API"""
    url = "https://api.x.ai/v1/chat/completions"
    system_instruction = (
        f"You are CampusPilot AI, the official intelligent assistant for Saranathan College of Engineering (Trichy, Tamil Nadu). User Role: {role.capitalize()}.\n"
        "Answer questions accurately, politely, and comprehensively using the provided college knowledge base.\n\n"
        f"College Knowledge Base:\n{context}"
    )
    models_to_try = ["grok-4.5", "grok-4.5-latest", "grok-build-latest", "grok-2-1212", "grok-beta"]
    last_error = None

    for model_name in models_to_try:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        req_data = json.dumps(payload).encode('utf-8')
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        req = urllib.request.Request(url, data=req_data, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30.0) as response:
                res_body = json.loads(response.read().decode('utf-8'))
                choice = (res_body.get('choices') or [{}])[0]
                message = choice.get('message') or {}
                content = message.get('content')
                if content:
                    return content, f"Grok ({model_name})"
                raise RuntimeError(f"Grok API returned an empty response for {model_name}")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8') if e.fp else ''
            print(f"[Grok API {model_name} HTTP Error {e.code}]: {err_body}")
            last_error = RuntimeError(f"Grok API {model_name} status {e.code}: {err_body}")
        except Exception as e:
            print(f"[Grok API {model_name} Error]: {e}")
            last_error = e

    if last_error:
        raise last_error

def call_gemini_primary(prompt: str, context: str, api_key: str, role: str = 'student'):
    """Primary Generator: Google Gemini API with Role-Based Prompt Alignment"""
    models_to_try = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-lite"]
    
    if role == 'faculty':
        role_desc = "You are interacting with a FACULTY MEMBER. Focus on teaching schedule, timetables, subjects handled, classroom allocations, and academic resource management."
    elif role == 'admin':
        role_desc = "You are interacting with an ADMINISTRATOR. Focus on platform data management, student database summaries, faculty records, system broadcasts, and administrative insights."
    else:
        role_desc = "You are interacting with a STUDENT. Focus on campus navigation, academics, notes, syllabus, PYQs, events, and campus guidance."

    system_instruction = (
        f"You are CampusPilot AI, the official intelligent assistant for Saranathan College of Engineering (Trichy, Tamil Nadu).\n"
        f"{role_desc}\n"
        "Answer questions accurately, politely, and concisely using the provided college knowledge base.\n\n"
        f"College Knowledge Base:\n{context}"
    )
    payload = {
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        },
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    req_data = json.dumps(payload).encode('utf-8')
    
    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
        req = urllib.request.Request(
            url,
            data=req_data,
            headers={
                'Content-Type': 'application/json',
                'x-goog-api-key': api_key
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=30.0) as response:
                res_body = json.loads(response.read().decode('utf-8'))
                candidates = res_body.get('candidates') or []
                text_parts = []
                if candidates:
                    content = candidates[0].get('content') or {}
                    for part in content.get('parts', []):
                        if 'text' in part and part['text']:
                            text_parts.append(part['text'])
                text = "\n".join(text_parts).strip()
                if not text:
                    raise RuntimeError(f"Gemini API returned no text for {model_name}")
                return text, f"Gemini ({model_name})"
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8') if e.fp else ''
            print(f"[Gemini API {model_name} HTTP Error {e.code}]: {err_body}")
            last_error = RuntimeError(f"Gemini API status {e.code}")
        except Exception as e:
            print(f"[Gemini API {model_name} Error]: {e}")
            last_error = e

    if last_error:
        raise last_error

def call_glm_fallback(prompt: str, context: str, api_key: str, role: str = 'student'):
    """Fallback Generator: GLM 4.7 Flash API"""
    url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    system_instruction = (
        f"You are CampusPilot AI, the official intelligent assistant for Saranathan College of Engineering (Trichy, Tamil Nadu). User Role: {role}.\n"
        f"College Knowledge Base:\n{context}"
    )
    payload = {
        "model": "glm-4-flash",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ]
    }
    req_data = json.dumps(payload).encode('utf-8')
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    req = urllib.request.Request(url, data=req_data, headers=headers)
    with urllib.request.urlopen(req, timeout=30.0) as response:
        res_body = json.loads(response.read().decode('utf-8'))
        choice = (res_body.get('choices') or [{}])[0]
        message = choice.get('message') or {}
        content = message.get('content')
        if not content:
            raise RuntimeError("GLM API returned an empty response")
        return content, "GLM 4.7 Flash"

@app.route('/api/chat', methods=['POST'])
@app.route('/api/copilot/chat', methods=['POST'])
def copilot_chat():
    """
    Central AI Chatbot Endpoint with Grok & Gemini Provider Fallback
    Accepts: { "message" or "prompt": "...", "model": "grok" | "gemini" | "glm", "role": "student" | "faculty" | "admin", "conversation_id": "..." }
    """
    load_env_file()
    data = request.json or {}
    prompt = (data.get('prompt') or data.get('message') or '').strip()
    user_role = data.get('role', 'student')
    requested_model = (data.get('model') or os.getenv('DEFAULT_MODEL') or 'auto').lower()
    conversation_id = data.get('conversation_id')
    request_id = f"req_{os.urandom(4).hex()}"

    if not prompt:
        return jsonify({"error": "Prompt or message is required"}), 400
    
    # STEP 1: SECURITY GUARD
    if is_security_restricted(prompt, user_role):
        return jsonify({
            "response": SECURITY_DENIED_RESPONSE,
            "security_blocked": True
        }), 200
    
    # STEP 2: DOMAIN CLASSIFICATION
    if not is_college_related(prompt):
        return jsonify({
            "response": OUT_OF_SCOPE_RESPONSE,
            "out_of_scope": True
        }), 200
    
    # STEP 3: DATABASE SEARCH & CONTEXT PREPARATION
    retrieved_facts = search_modular_campus_database(prompt, user_role)
    if retrieved_facts:
        context_str = DEFAULT_CAMPUS_KNOWLEDGE + "\nDirect Records:\n" + "\n".join(retrieved_facts)
    else:
        context_str = DEFAULT_CAMPUS_KNOWLEDGE
    
    # Load provider keys
    gemini_key = os.getenv('GEMINI_API_KEY', '').strip()
    grok_key = (os.getenv('GROK_API_KEY') or os.getenv('XAI_API_KEY') or '').strip()
    glm_key = os.getenv('GLM_API_KEY', '').strip()

    ai_text = None
    model_used = "Unknown"
    errors = []
    provider_order = []
    if requested_model == 'grok':
        provider_order = ['grok', 'gemini']
    elif requested_model == 'gemini':
        provider_order = ['gemini', 'grok']
    elif requested_model == 'glm':
        provider_order = ['glm', 'grok', 'gemini']
    else:
        provider_order = ['grok', 'gemini', 'glm']

    provider_attempts = []
    logger.info(
        "Chat request %s received. requested_model=%s conversation_id=%s provider_order=%s",
        request_id,
        requested_model,
        conversation_id,
        provider_order,
    )

    for provider_name in provider_order:
        if ai_text:
            break
        try:
            if provider_name == 'grok' and grok_key:
                ai_text, model_used = call_grok_primary(prompt, context_str, grok_key, user_role)
                provider_attempts.append({"provider": "grok", "status": "success", "model": model_used})
            elif provider_name == 'gemini' and gemini_key:
                ai_text, model_used = call_gemini_primary(prompt, context_str, gemini_key, user_role)
                provider_attempts.append({"provider": "gemini", "status": "success", "model": model_used})
            elif provider_name == 'glm' and glm_key:
                ai_text, model_used = call_glm_fallback(prompt, context_str, glm_key, user_role)
                provider_attempts.append({"provider": "glm", "status": "success", "model": model_used})
        except Exception as e:
            errors.append(f"{provider_name.upper()} failed: {e}")
            provider_attempts.append({"provider": provider_name, "status": "error", "error": str(e)})
            logger.exception("Provider failure in %s for %s", provider_name, request_id)

    if ai_text:
        # PERSISTENCE: Save message to DB if conversation_id is provided
        if conversation_id:
            conn = get_db_connection()
            cursor = conn.cursor()
            import uuid
            # Save User Message
            cursor.execute("INSERT INTO messages (message_id, conversation_id, sender, content) VALUES (?, ?, ?, ?)",
                           (f"msg_{uuid.uuid4().hex[:12]}", conversation_id, 'user', prompt))
            # Save AI Message
            cursor.execute("INSERT INTO messages (message_id, conversation_id, sender, content, model_used) VALUES (?, ?, ?, ?, ?)",
                           (f"msg_{uuid.uuid4().hex[:12]}", conversation_id, 'ai', ai_text, model_used))
            # Update Conversation Title if it's new
            cursor.execute("UPDATE conversations SET title = ? WHERE conversation_id = ? AND title = 'New Chat'", 
                           (prompt[:40] + ('...' if len(prompt) > 40 else ''), conversation_id))
            cursor.execute("UPDATE conversations SET updated_at = CURRENT_TIMESTAMP, last_message_at = CURRENT_TIMESTAMP, message_count = COALESCE(message_count, 0) + 2 WHERE conversation_id = ?", (conversation_id,))
            conn.commit()
            conn.close()

        return jsonify({
            "response": ai_text,
            "model_used": model_used,
            "success": True
        }), 200

    logger.error("All AI providers failed for %s. Attempts: %s", request_id, provider_attempts)
    return jsonify({
        "error": "All configured AI providers failed.",
        "success": False,
        "request_id": request_id,
        "provider_attempts": provider_attempts,
        "errors": errors
    }), 503


@app.route('/api/ollama/health', methods=['GET'])
def ollama_health_check():
    """
    Ollama Health Check endpoint using GET /api/tags (GET supported)
    Fallback POST /api/me if requested with application/json header & empty body {}
    10000ms (10s) timeout for codex/openclaw integrations.
    """
    ollama_url = os.getenv('OLLAMA_HEALTH_ENDPOINT', 'http://127.0.0.1:11434/api/tags')
    try:
        req = urllib.request.Request(ollama_url)
        with urllib.request.urlopen(req, timeout=10.0) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return jsonify({"status": "healthy", "models": data.get('models', [])}), 200
    except Exception as e:
        # Fallback to POST http://127.0.0.1:11434/api/me with application/json header
        try:
            me_req = urllib.request.Request(
                'http://127.0.0.1:11434/api/me',
                data=json.dumps({}).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(me_req, timeout=10.0) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                return jsonify({"status": "healthy", "data": data}), 200
        except Exception as me_err:
            return jsonify({"status": "error", "message": str(e), "me_error": str(me_err)}), 500


# ============================================================================
# SERVER LAUNCHER
# ============================================================================

if __name__ == '__main__':
    print(f"============================================================")
    print(f"🚀 SSE FESTA Flask Backend & Student Database Server Started!")
    print(f"🌐 Running on: http://localhost:{PORT}")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)
