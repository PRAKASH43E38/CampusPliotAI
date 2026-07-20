from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime
import uuid
import re
from sqlalchemy.orm import validates

db = SQLAlchemy()

# ==========================================
# MANY-TO-MANY RELATIONSHIP JOIN TABLES
# ==========================================

class EventRegistration(db.Model):
    __tablename__ = 'event_registrations'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    event_id = db.Column(db.String(50), db.ForeignKey('events.id', ondelete='CASCADE'), primary_key=True)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)

class ClubMembership(db.Model):
    __tablename__ = 'club_memberships'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    club_id = db.Column(db.String(50), db.ForeignKey('clubs.id', ondelete='CASCADE'), primary_key=True)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

class SavedResource(db.Model):
    __tablename__ = 'saved_resources'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    resource_id = db.Column(db.String(50), db.ForeignKey('resources.id', ondelete='CASCADE'), primary_key=True)

class PlacementApplication(db.Model):
    __tablename__ = 'placement_applications'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    placement_id = db.Column(db.String(50), db.ForeignKey('placements.id', ondelete='CASCADE'), primary_key=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='APPLIED')

class StudentSkill(db.Model):
    __tablename__ = 'student_skills'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), primary_key=True)

class FacultyInterest(db.Model):
    __tablename__ = 'faculty_interests'
    faculty_id = db.Column(db.String(50), db.ForeignKey('faculty.id', ondelete='CASCADE'), primary_key=True)
    interest_id = db.Column(db.Integer, db.ForeignKey('research_interests.id', ondelete='CASCADE'), primary_key=True)


# ==========================================
# IDENTITY & MANAGEMENT
# ==========================================

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='AcademicAdmin')  # SuperAdmin, AcademicAdmin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    uploaded_resources = db.relationship('Resource', backref='uploader', lazy=True)
    posted_announcements = db.relationship('Announcement', backref='author_admin', lazy=True)
    created_events = db.relationship('Event', backref='creator_admin', lazy=True)
    reviewed_outpasses = db.relationship('Outpass', backref='reviewer_admin', lazy=True)

    @validates('email')
    def validate_email(self, key, value):
        if not value or not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError("Invalid admin email address")
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'createdAt': self.created_at.isoformat()
        }

class OAuthCredential(db.Model):
    __tablename__ = 'oauth_credentials'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(50), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # STUDENT, ADMIN
    provider = db.Column(db.String(50), nullable=False)  # google, github
    provider_user_id = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('provider', 'provider_user_id', name='uq_provider_user'),
    )


# ==========================================
# ACADEMIC STRUCTURE
# ==========================================

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    head_of_dept = db.Column(db.String(100))
    description = db.Column(db.Text)

    # Relationships
    students = db.relationship('Student', backref='department', lazy=True)
    faculty = db.relationship('Faculty', backref='department', lazy=True)
    subjects = db.relationship('Subject', backref='department', lazy=True)
    resources = db.relationship('Resource', backref='department', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'headOfDept': self.head_of_dept,
            'description': self.description
        }

class Semester(db.Model):
    __tablename__ = 'semesters'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    semester_number = db.Column(db.Integer, nullable=False, index=True)
    academic_year = db.Column(db.String(20), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('semester_number', 'academic_year', name='uq_semester_year'),
    )

    # Relationships
    students = db.relationship('Student', backref='semester', lazy=True)
    subjects = db.relationship('Subject', backref='semester', lazy=True)
    resources = db.relationship('Resource', backref='semester', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'number': self.semester_number,
            'year': self.academic_year
        }


# ==========================================
# USER ENTITIES & PROFILES
# ==========================================

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    roll_no = db.Column(db.String(50), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship('StudentProfile', backref='student', uselist=False, cascade="all, delete-orphan")
    academic_records = db.relationship('AcademicRecord', backref='student', lazy=True, cascade="all, delete-orphan")
    outpasses = db.relationship('Outpass', backref='student', lazy=True, cascade="all, delete-orphan")
    notifications = db.relationship('Notification', backref='student', lazy=True, cascade="all, delete-orphan")
    hostel_assignments = db.relationship('HostelDetail', backref='student', lazy=True)

    # Many-to-many links
    registered_events = db.relationship('Event', secondary='event_registrations', backref='registered_students')
    joined_clubs = db.relationship('Club', secondary='club_memberships', backref='members')
    saved_resources = db.relationship('Resource', secondary='saved_resources', backref='saved_by_students')
    applied_placements = db.relationship('Placement', secondary='placement_applications', backref='applicants')
    skills = db.relationship('Skill', secondary='student_skills', backref='students')

    @validates('email')
    def validate_email(self, key, value):
        if not value or not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise ValueError("Invalid student email address")
        return value

    def to_dict(self):
        dept = self.department.name if self.department else ''
        sem = self.semester.semester_number if self.semester else 1
        
        profile_data = {
            'name': 'New Student',
            'registerNumber': '',
            'course': '',
            'section': '',
            'age': None,
            'gender': '',
            'phoneNumber': '',
            'linkedinUrl': '',
            'githubUrl': '',
            'portfolioUrl': '',
            'shortBio': '',
            'skills': [],
            'careerObjective': '',
            'attendanceOverall': 0.0,
            'cgpa': 0.0,
            'avatar': '',
            'hostelBlock': '',
            'hostelRoom': '',
            'totalCredits': 0
        }
        
        if self.profile:
            skills_list = [s.name for s in self.skills]
            profile_data.update({
                'name': self.profile.full_name or 'New Student',
                'registerNumber': self.profile.register_number or '',
                'course': self.profile.course or '',
                'section': self.profile.section or '',
                'age': self.profile.age,
                'gender': self.profile.gender or '',
                'phoneNumber': self.profile.phone_number or '',
                'linkedinUrl': self.profile.linkedin_url or '',
                'githubUrl': self.profile.github_url or '',
                'portfolioUrl': self.profile.portfolio_url or '',
                'shortBio': self.profile.short_bio or '',
                'skills': skills_list,
                'careerObjective': self.profile.career_objective or '',
                'attendanceOverall': self.profile.attendance or 0.0,
                'cgpa': self.profile.cgpa or 0.0,
                'avatar': self.profile.avatar_url or '',
                'hostelBlock': self.profile.hostel_block or '',
                'hostelRoom': self.profile.hostel_room or '',
                'totalCredits': 92
            })
            
        res = {
            'id': self.id,
            'email': self.email,
            'rollNo': self.roll_no,
            'department': dept,
            'semester': sem,
            'createdAt': self.created_at.isoformat(),
            'savedResources': [r.id for r in self.saved_resources],
            'registeredEvents': [e.id for e in self.registered_events],
            'joinedClubs': [c.id for c in self.joined_clubs],
            'appliedPlacements': [p.id for p in self.applied_placements]
        }
        res.update(profile_data)
        return res

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    full_name = db.Column(db.String(100))
    register_number = db.Column(db.String(50), unique=True, index=True)
    course = db.Column(db.String(100))
    section = db.Column(db.String(20))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    phone_number = db.Column(db.String(20))
    linkedin_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    short_bio = db.Column(db.Text)
    career_objective = db.Column(db.Text)
    cgpa = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=0.0)
    avatar_url = db.Column(db.String(255), default='')
    hostel_block = db.Column(db.String(100))
    hostel_room = db.Column(db.String(20))

    def to_dict(self):
        return {
            'studentId': self.student_id,
            'fullName': self.full_name,
            'registerNumber': self.register_number,
            'course': self.course,
            'section': self.section,
            'age': self.age,
            'gender': self.gender,
            'phoneNumber': self.phone_number,
            'linkedinUrl': self.linkedin_url,
            'githubUrl': self.github_url,
            'portfolioUrl': self.portfolio_url,
            'shortBio': self.short_bio,
            'careerObjective': self.career_objective,
            'cgpa': self.cgpa,
            'attendance': self.attendance,
            'avatar': self.avatar_url,
            'hostelBlock': self.hostel_block,
            'hostelRoom': self.hostel_room
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)


# ==========================================
# FACULTY & TIMETABLES
# ==========================================

class Faculty(db.Model):
    __tablename__ = 'faculty'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    cabin = db.Column(db.String(150), nullable=False)
    office_hours = db.Column(db.String(150), nullable=False)
    avatar = db.Column(db.String(255), default='')

    # Relationships
    interests = db.relationship('ResearchInterest', secondary='faculty_interests', backref='faculty_members')
    allocated_subjects = db.relationship('Subject', backref='coordinator_faculty', lazy=True)
    timetable_sessions = db.relationship('ClassSession', backref='faculty', lazy=True)
    coordinated_clubs = db.relationship('Club', backref='faculty_coordinator', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'designation': self.designation,
            'departmentId': self.department_id,
            'email': self.email,
            'cabin': self.cabin,
            'officeHours': self.office_hours,
            'researchInterests': [i.interest_name for i in self.interests],
            'avatar': self.avatar
        }

class ResearchInterest(db.Model):
    __tablename__ = 'research_interests'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    interest_name = db.Column(db.String(150), unique=True, nullable=False, index=True)


# ==========================================
# SUBJECTS & SYLLABUS & EVALUATION
# ==========================================

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    credits = db.Column(db.Integer, nullable=False)
    subject_type = db.Column(db.String(50), default='Core')  # Core, Elective, Laboratory
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    coordinator_faculty_id = db.Column(db.String(50), db.ForeignKey('faculty.id'), nullable=True)
    description = db.Column(db.Text)
    learning_outcomes = db.Column(db.Text)
    reference_books = db.Column(db.Text)

    # Relationships
    syllabus_units = db.relationship('SubjectSyllabus', backref='subject', lazy=True, cascade="all, delete-orphan")
    academic_records = db.relationship('AcademicRecord', backref='subject', lazy=True, cascade="all, delete-orphan")
    timetable_sessions = db.relationship('ClassSession', backref='subject', lazy=True, cascade="all, delete-orphan")
    resources = db.relationship('Resource', backref='subject', lazy=True, cascade="all, delete-orphan")

    def to_dict(self, student_id=None):
        from flask import request
        if not student_id:
            try:
                student_id = request.headers.get('X-Student-Id', 'st-0982')
            except Exception:
                student_id = 'st-0982'
        
        # Query AcademicRecord for student-specific evaluations (2NF separation)
        rec = AcademicRecord.query.filter_by(student_id=student_id, subject_id=self.id).first()
        fac_name = self.coordinator_faculty.name if self.coordinator_faculty else 'N/A'
        syllabus_units_list = [u.unit_title for u in sorted(self.syllabus_units, key=lambda x: x.unit_number)]

        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'credits': self.credits,
            'attendance': rec.attendance_rate if rec else 0.0,
            'facultyName': fac_name,
            'ciaMarks': {
                'cia1': rec.cia1 if rec else 0,
                'cia2': rec.cia2 if rec else 0,
                'cia3': rec.cia3 if rec else 0,
                'max': rec.cia_max if rec else 20
            },
            'syllabusUnits': syllabus_units_list,
            'description': self.description or '',
            'referenceBooks': self.reference_books or '',
            'learningOutcomes': self.learning_outcomes or ''
        }

class SubjectSyllabus(db.Model):
    __tablename__ = 'subject_syllabus'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False)
    unit_number = db.Column(db.Integer, nullable=False)
    unit_title = db.Column(db.String(255), nullable=False)
    unit_content = db.Column(db.Text)

    __table_args__ = (
        db.UniqueConstraint('subject_id', 'unit_number', name='uq_subject_unit'),
    )

class AcademicRecord(db.Model):
    __tablename__ = 'academic_records'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False)
    attendance_rate = db.Column(db.Float, default=0.0)
    cia1 = db.Column(db.Integer, default=0)
    cia2 = db.Column(db.Integer, default=0)
    cia3 = db.Column(db.Integer, default=0)
    cia_max = db.Column(db.Integer, default=20)
    grade = db.Column(db.String(2), default=None)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'subject_id', name='uq_student_subject_record'),
    )

class ClassSession(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False)
    faculty_id = db.Column(db.String(50), db.ForeignKey('faculty.id'), nullable=False)
    time_start = db.Column(db.String(20), nullable=False)
    time_end = db.Column(db.String(20), nullable=False)
    room = db.Column(db.String(100), nullable=False)
    day = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'subjectCode': self.subject.code if self.subject else 'N/A',
            'subjectName': self.subject.name if self.subject else 'N/A',
            'facultyName': self.faculty.name if self.faculty else 'N/A',
            'timeStart': self.time_start,
            'timeEnd': self.time_end,
            'room': self.room,
            'day': self.day
        }


# ==========================================
# RESOURCE CENTER DOMAIN
# ==========================================

class ResourceCategory(db.Model):
    __tablename__ = 'resource_categories'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)  # notes, pyq, syllabus, book, manual

    # Relationships
    resources = db.relationship('Resource', backref='category', lazy=True)

class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('resource_categories.id'), nullable=False)
    subject_id = db.Column(db.String(50), db.ForeignKey('subjects.id', ondelete='CASCADE'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=True)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=True)
    
    # Metadata for local uploads/ serving (Phase 2 constraint)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size_bytes = db.Column(db.Integer, nullable=False)
    file_type = db.Column(db.String(100)) # PDF, DOCX, ZIP, etc.
    
    upload_date = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    uploaded_by_admin_id = db.Column(db.String(50), db.ForeignKey('admin_users.id'), nullable=False)
    download_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='APPROVED')
    tags = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        sub_code = self.subject.code if self.subject else 'N/A'
        sub_name = self.subject.name if self.subject else 'N/A'
        sem_num = self.semester.semester_number if self.semester else 'N/A'
        dept_name = self.department.name if self.department else 'N/A'
        cat_code = self.category.code if self.category else 'notes'
        
        file_size_str = "0 KB"
        if self.file_size_bytes:
            if self.file_size_bytes >= 1024 * 1024:
                file_size_str = f"{self.file_size_bytes / (1024 * 1024):.1f} MB"
            else:
                file_size_str = f"{self.file_size_bytes / 1024:.0f} KB"

        # Dedicated serving route URL pointing to backend serving controller
        file_url = f"/api/resources/download/{self.id}"

        return {
            'id': self.id,
            'title': self.title,
            'type': cat_code,
            'subjectCode': sub_code,
            'subjectName': sub_name,
            'semester': sem_num,
            'fileSize': file_size_str,
            'downloadCount': self.download_count,
            'addedBy': self.uploaded_by_admin_id,
            'department': dept_name,
            'description': self.description,
            'tags': self.tags,
            'fileUrl': file_url
        }


# ==========================================
# CAMPUS LIFE & ENGAGEMENT
# ==========================================

class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    author_admin_id = db.Column(db.String(50), db.ForeignKey('admin_users.id'), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        admin = AdminUser.query.get(self.author_admin_id)
        author_name = admin.username if admin else "Administrator"
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'date': self.date,
            'content': self.content,
            'author': author_name,
            'priority': self.priority
        }

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False, index=True)
    time = db.Column(db.String(100), nullable=False)
    venue = db.Column(db.String(150), nullable=False)
    organizer = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    spots_left = db.Column(db.Integer, default=0)
    created_by_admin_id = db.Column(db.String(50), db.ForeignKey('admin_users.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'date': self.date,
            'time': self.time,
            'venue': self.venue,
            'organizer': self.organizer,
            'description': self.description,
            'image': self.image_url,
            'spotsLeft': self.spots_left
        }

class Club(db.Model):
    __tablename__ = 'clubs'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    logo = db.Column(db.String(20), nullable=False)
    faculty_coordinator_id = db.Column(db.String(50), db.ForeignKey('faculty.id'), nullable=True)
    student_coordinator = db.Column(db.String(100))
    requirements = db.Column(db.Text)

    def to_dict(self):
        coord = self.faculty_coordinator.name if self.faculty_coordinator else 'N/A'
        members_count = len(self.members)
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'logo': self.logo,
            'facultyCoordinator': coord,
            'studentCoordinator': self.student_coordinator,
            'membersCount': members_count,
            'upcomingEventsCount': 0, # dynamic placeholder
            'requirements': self.requirements
        }

class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False, unique=True)
    type = db.Column(db.String(50), nullable=False) # building, facility, office, hostel, lab
    block = db.Column(db.String(100), nullable=False)
    floor = db.Column(db.String(100), nullable=False)
    room_no = db.Column(db.String(50), default='')
    nearest_parking = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'block': self.block,
            'floor': self.floor,
            'roomNo': self.room_no,
            'nearestParking': self.nearest_parking,
            'description': self.description
        }


# ==========================================
# LOGISTICS, TRANSPORT & HOSTELS
# ==========================================

class Bus(db.Model):
    __tablename__ = 'buses'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_no = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    driver_name = db.Column(db.String(100))
    driver_phone = db.Column(db.String(20))

    # Relationships
    stops = db.relationship('BusStop', backref='bus', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        sorted_stops = sorted(self.stops, key=lambda x: x.stop_order)
        stops_list = [s.stop_name for s in sorted_stops]
        timings_list = []
        for stop in sorted_stops:
            sch = BusSchedule.query.filter_by(stop_id=stop.id).first()
            if sch:
                timings_list.append(sch.arrival_time)

        return {
            'id': self.id,
            'routeNo': self.route_no,
            'destination': self.destination,
            'stops': stops_list,
            'timings': timings_list,
            'driverName': self.driver_name,
            'driverPhone': self.driver_phone
        }

class BusStop(db.Model):
    __tablename__ = 'bus_stops'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.String(50), db.ForeignKey('buses.id', ondelete='CASCADE'), nullable=False)
    stop_name = db.Column(db.String(150), nullable=False)
    stop_order = db.Column(db.Integer, nullable=False)

    schedules = db.relationship('BusSchedule', backref='stop', lazy=True, cascade="all, delete-orphan")

class BusSchedule(db.Model):
    __tablename__ = 'bus_schedules'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    stop_id = db.Column(db.Integer, db.ForeignKey('bus_stops.id', ondelete='CASCADE'), nullable=False)
    arrival_time = db.Column(db.String(30), nullable=False)

class HostelDetail(db.Model):
    __tablename__ = 'hostel_details'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), nullable=True)
    block_name = db.Column(db.String(100), nullable=False)
    room_no = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, default=2)
    occupants_count = db.Column(db.Integer, default=0)

class HostelMenu(db.Model):
    __tablename__ = 'hostel_menus'
    day = db.Column(db.String(20), primary_key=True)
    breakfast = db.Column(db.String(255), nullable=False)
    lunch = db.Column(db.String(255), nullable=False)
    snack = db.Column(db.String(255), nullable=False)
    dinner = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'breakfast': self.breakfast,
            'lunch': self.lunch,
            'snack': self.snack,
            'dinner': self.dinner
        }

class Outpass(db.Model):
    __tablename__ = 'outpasses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    block = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.String(50), nullable=False)
    end_date = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='PENDING')
    reviewed_by_admin_id = db.Column(db.String(50), db.ForeignKey('admin_users.id'), nullable=True)
    reviewed_at = db.Column(db.DateTime, default=None)

    def to_dict(self):
        return {
            'id': self.id,
            'studentId': self.student_id,
            'block': self.block,
            'room': self.room,
            'startDate': self.start_date,
            'endDate': self.end_date,
            'reason': self.reason,
            'status': self.status
        }


# ==========================================
# SYSTEM / OPERATIONS / LOGS
# ==========================================

class Placement(db.Model):
    __tablename__ = 'placements'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    ctc = db.Column(db.String(50), nullable=False)
    eligibility = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # fulltime, internship
    job_description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'ctc': self.ctc,
            'eligibility': self.eligibility,
            'deadline': self.deadline,
            'status': self.status,
            'type': self.type,
            'jobDescription': self.job_description
        }

class AIKnowledgeBase(db.Model):
    __tablename__ = 'ai_knowledge_base'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    trigger_key = db.Column(db.String(200), unique=True, nullable=False)
    response = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='General')
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'triggerKey': self.trigger_key,
            'response': self.response,
            'category': self.category,
            'lastUpdated': self.last_updated.isoformat()
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = db.Column(db.String(50), db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'studentId': self.student_id,
            'title': self.title,
            'message': self.message,
            'isRead': self.is_read,
            'createdAt': self.created_at.isoformat()
        }

class SystemSetting(db.Model):
    __tablename__ = 'system_settings'
    config_key = db.Column(db.String(100), primary_key=True)
    config_value = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    actor_id = db.Column(db.String(50))
    actor_role = db.Column(db.String(20))  # Admin, Student, System
    action = db.Column(db.String(50))
    target_table = db.Column(db.String(100))
    target_id = db.Column(db.String(50))
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class SystemLog(db.Model):
    __tablename__ = 'system_logs'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    log_level = db.Column(db.String(20)) # INFO, WARNING, ERROR
    message = db.Column(db.Text)
    module = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
