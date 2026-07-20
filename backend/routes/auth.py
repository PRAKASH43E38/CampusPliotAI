import re
import json
import os
import time
from functools import wraps
from flask import Blueprint, request, jsonify, send_from_directory
from models import Student, StudentProfile, AdminUser, Skill, db

auth_bp = Blueprint('auth', __name__)

# Allowed photo extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Role Protection Decorator
def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            student_id = request.headers.get('X-Student-Id')
            
            if role == 'STUDENT':
                if not student_id:
                    return jsonify({'success': False, 'message': 'Unauthorized student access.'}), 401
                student = Student.query.get(student_id)
                if not student:
                    return jsonify({'success': False, 'message': 'Student record not found.'}), 401
            elif role == 'ADMIN':
                if student_id:
                    return jsonify({'success': False, 'message': 'Forbidden. Students cannot access administrative actions.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

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
            return jsonify({'error': 'Invalid credentials. Student email not registered in system.'}), 401

        return jsonify({
            'success': True,
            'role': 'STUDENT',
            'student': student.to_dict()
        })

    elif role == 'ADMIN':
        admin = AdminUser.query.filter_by(email=email).first()
        if not admin:
            return jsonify({'error': 'Invalid credentials. Admin email not registered in system.'}), 401
        
        student = Student.query.first()
        return jsonify({
            'success': True,
            'role': 'ADMIN',
            'admin': admin.to_dict(),
            'student': student.to_dict() if student else None
        })

    return jsonify({'error': 'Invalid role'}), 400

@auth_bp.route('/profile', methods=['GET', 'PUT'])
@require_role('STUDENT')
def profile():
    student_id = request.headers.get('X-Student-Id')
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    if request.method == 'PUT':
        data = request.get_json() or {}
        
        if not student.profile:
            student.profile = StudentProfile(student_id=student.id)
            db.session.add(student.profile)

        # Update base student fields
        if 'email' in data:
            student.email = data['email']
        if 'rollNo' in data:
            student.roll_no = data['rollNo']

        # Update profile fields
        if 'name' in data:
            student.profile.full_name = data['name']
        if 'course' in data:
            student.profile.course = data['course']
        if 'section' in data:
            student.profile.section = data['section']
        if 'age' in data:
            student.profile.age = int(data['age']) if data['age'] is not None else None
        if 'gender' in data:
            student.profile.gender = data['gender']
        if 'phoneNumber' in data:
            student.profile.phone_number = data['phoneNumber']
        if 'linkedinUrl' in data:
            student.profile.linkedin_url = data['linkedinUrl']
        if 'githubUrl' in data:
            student.profile.github_url = data['githubUrl']
        if 'portfolioUrl' in data:
            student.profile.portfolio_url = data['portfolioUrl']
        if 'shortBio' in data or 'bio' in data:
            student.profile.short_bio = data.get('shortBio') or data.get('bio')
        if 'careerObjective' in data:
            student.profile.career_objective = data['careerObjective']
        if 'avatar' in data:
            student.profile.avatar_url = data['avatar']
            
        # Skill relations mapping
        if 'skills' in data:
            skills_val = data['skills']
            if isinstance(skills_val, str):
                try:
                    skills_val = json.loads(skills_val)
                except Exception:
                    skills_val = [s.strip() for s in skills_val.split(',')]
            if isinstance(skills_val, list):
                student.skills = []
                for sk_name in skills_val:
                    if not sk_name.strip():
                        continue
                    sk = Skill.query.filter_by(name=sk_name).first()
                    if not sk:
                        sk = Skill(name=sk_name)
                        db.session.add(sk)
                        db.session.commit()
                    student.skills.append(sk)

        db.session.commit()

    return jsonify(student.to_dict())

@auth_bp.route('/profile/photo', methods=['POST'])
@require_role('STUDENT')
def upload_profile_photo():
    student_id = request.headers.get('X-Student-Id')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'success': False, 'message': 'Student record not found.'}), 404
        
    if 'photo' not in request.files:
        return jsonify({'success': False, 'message': 'No file part in request.'}), 400
        
    file = request.files['photo']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file.'}), 400
        
    if file and allowed_file(file.filename):
        from werkzeug.utils import secure_filename
        filename = secure_filename(file.filename)
        unique_filename = f"avatar_{student_id}_{int(time.time())}_{filename}"
        
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
            
        file_path = os.path.join(uploads_dir, unique_filename)
        file.save(file_path)
        
        if not student.profile:
            student.profile = StudentProfile(student_id=student.id)
            db.session.add(student.profile)
            
        student.profile.avatar_url = f"/api/uploads/{unique_filename}"
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile photo uploaded successfully.',
            'avatarUrl': student.profile.avatar_url
        })
        
    return jsonify({'success': False, 'message': 'Invalid file type.'}), 400

@auth_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_uploaded_file(filename):
    if '..' in filename or filename.startswith('/') or filename.startswith('\\'):
        return jsonify({'success': False, 'message': 'Forbidden path traversal.'}), 403
        
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    file_path = os.path.join(uploads_dir, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'success': False, 'message': 'File not found.'}), 404
        
    return send_from_directory(uploads_dir, filename)
