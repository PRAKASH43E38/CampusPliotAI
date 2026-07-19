import re
from flask import Blueprint, request, jsonify
from models import Student, Faculty, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    role = data.get('role')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    if role == 'STUDENT':
        student = Student.query.filter_by(email=email).first()
        if not student:
            # Fallback to the seeded student and update email dynamically for seamless prototyping
            student = Student.query.first()
            if student:
                student.email = email
                name = data.get('name')
                avatar = data.get('avatar')
                if name:
                    student.name = name
                if avatar:
                    student.avatar = avatar
                db.session.commit()
            else:
                return jsonify({'error': 'Student database is empty. Please run init_db.py.'}), 500

        return jsonify({
            'success': True,
            'role': 'STUDENT',
            'student': student.to_dict()
        })

    elif role == 'FACULTY':
        faculty = Faculty.query.filter_by(email=email).first()

        student = Student.query.first()
        return jsonify({
            'success': True,
            'role': 'FACULTY',
            'student': student.to_dict() if student else None
        })

    elif role == 'ADMIN':

        student = Student.query.first()
        return jsonify({
            'success': True,
            'role': 'ADMIN',
            'student': student.to_dict() if student else None
        })

    return jsonify({'error': 'Invalid role'}), 400

@auth_bp.route('/profile', methods=['GET', 'PUT'])
def profile():
    # Retrieve student id from header
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    if request.method == 'PUT':
        data = request.get_json() or {}
        if 'email' in data:
            student.email = data['email']
        # Add other editable fields if required
        db.session.commit()

    return jsonify(student.to_dict())
