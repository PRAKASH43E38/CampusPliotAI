#!/usr/bin/env python3
"""
SSE FESTA Student Database & Central Backend Server
Framework: Flask + Flask-CORS
Database: SQLite3 (sse_festa_db.sqlite)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
import os

app = Flask(__name__)
CORS(app)

PORT = 8080
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, "sse_festa_db.sqlite")

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
# STUDENT PROFILE REST API ENDPOINTS
# ============================================================================

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
    """Create a new Student Profile (Onboarding Submission)"""
    data = request.json or {}
    
    # Required check
    if not data.get('college_email') or not data.get('register_number') or not data.get('full_name'):
        return jsonify({"error": "Full Name, College Email, and Register Number are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check unique constraint
    cursor.execute("SELECT student_id FROM student_profiles WHERE college_email = ? OR register_number = ?", 
                   (data.get('college_email'), data.get('register_number')))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "Student profile with this Email or Register Number already exists.", "student_id": existing['student_id']}), 409

    # Calculate profile completion percentage
    total_fields = 25
    filled_fields = sum(1 for k, v in data.items() if v not in [None, "", [], {}])
    completion_pct = min(100, int((filled_fields / total_fields) * 100))

    try:
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

@app.route('/api/data', methods=['POST'])
def create_table_row():
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
# SERVER LAUNCHER
# ============================================================================
if __name__ == '__main__':
    print(f"============================================================")
    print(f"🚀 SSE FESTA Flask Backend & Student Database Server Started!")
    print(f"🌐 Running on: http://localhost:{PORT}")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=PORT, debug=True)
