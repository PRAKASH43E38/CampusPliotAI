from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

# Association tables for many-to-many relationships
class EventRegistration(db.Model):
    __tablename__ = 'event_registrations'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), primary_key=True)
    event_id = db.Column(db.String(50), db.ForeignKey('events.id'), primary_key=True)

class ClubMembership(db.Model):
    __tablename__ = 'club_memberships'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), primary_key=True)
    club_id = db.Column(db.String(50), db.ForeignKey('clubs.id'), primary_key=True)

class SavedResource(db.Model):
    __tablename__ = 'saved_resources'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), primary_key=True)
    resource_id = db.Column(db.String(50), db.ForeignKey('resources.id'), primary_key=True)

class PlacementApplication(db.Model):
    __tablename__ = 'placement_applications'
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), primary_key=True)
    placement_id = db.Column(db.String(50), db.ForeignKey('placements.id'), primary_key=True)


class Student(db.Model):
    __tablename__ = 'students'
    __tablename__ = 'students'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    roll_no = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    avatar = db.Column(db.String(255), default='')
    attendance_overall = db.Column(db.Float, default=0.0)
    cgpa = db.Column(db.Float, default=0.0)
    total_credits = db.Column(db.Integer, default=0)
    hostel_block = db.Column(db.String(100))
    hostel_room = db.Column(db.String(20))
    
    # Relationships
    registered_events = db.relationship('Event', secondary='event_registrations', backref='registered_students')
    joined_clubs = db.relationship('Club', secondary='club_memberships', backref='members')
    saved_resources = db.relationship('Resource', secondary='saved_resources', backref='saved_by_students')
    applied_placements = db.relationship('Placement', secondary='placement_applications', backref='applicants')
    outpasses = db.relationship('Outpass', backref='student', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'rollNo': self.roll_no,
            'department': self.department,
            'course': self.course,
            'semester': self.semester,
            'email': self.email,
            'avatar': self.avatar,
            'attendanceOverall': self.attendance_overall,
            'cgpa': self.cgpa,
            'totalCredits': self.total_credits,
            'hostelBlock': self.hostel_block,
            'hostelRoom': self.hostel_room,
            'savedResources': [r.id for r in self.saved_resources],
            'registeredEvents': [e.id for e in self.registered_events],
            'joinedClubs': [c.id for c in self.joined_clubs],
            'appliedPlacements': [p.id for p in self.applied_placements]
        }


class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.String(50), primary_key=True)
    code = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    attendance = db.Column(db.Float, default=0.0)
    faculty_name = db.Column(db.String(100))
    cia1 = db.Column(db.Integer, default=0)
    cia2 = db.Column(db.Integer, default=0)
    cia3 = db.Column(db.Integer, default=0)
    cia_max = db.Column(db.Integer, default=20)
    _syllabus_units = db.Column('syllabus_units', db.Text, nullable=False)  # JSON list string

    @property
    def syllabus_units(self):
        return json.loads(self._syllabus_units) if self._syllabus_units else []

    @syllabus_units.setter
    def syllabus_units(self, val):
        self._syllabus_units = json.dumps(val)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'credits': self.credits,
            'attendance': self.attendance,
            'facultyName': self.faculty_name,
            'ciaMarks': {
                'cia1': self.cia1,
                'cia2': self.cia2,
                'cia3': self.cia3,
                'max': self.cia_max
            },
            'syllabusUnits': self.syllabus_units
        }


class ClassSession(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.String(50), primary_key=True)
    subject_code = db.Column(db.String(20), nullable=False)
    subject_name = db.Column(db.String(150), nullable=False)
    faculty_name = db.Column(db.String(100))
    time_start = db.Column(db.String(20), nullable=False)
    time_end = db.Column(db.String(20), nullable=False)
    room = db.Column(db.String(100), nullable=False)
    day = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'subjectCode': self.subject_code,
            'subjectName': self.subject_name,
            'facultyName': self.faculty_name,
            'timeStart': self.time_start,
            'timeEnd': self.time_end,
            'room': self.room,
            'day': self.day
        }


class Faculty(db.Model):
    __tablename__ = 'faculty'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    cabin = db.Column(db.String(150), nullable=False)
    office_hours = db.Column(db.String(150), nullable=False)
    _research_interests = db.Column('research_interests', db.Text, nullable=False)  # JSON list string
    avatar = db.Column(db.String(10), default='')

    @property
    def research_interests(self):
        return json.loads(self._research_interests) if self._research_interests else []

    @research_interests.setter
    def research_interests(self, val):
        self._research_interests = json.dumps(val)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'designation': self.designation,
            'department': self.department,
            'email': self.email,
            'cabin': self.cabin,
            'officeHours': self.office_hours,
            'researchInterests': self.research_interests,
            'avatar': self.avatar
        }


class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # technical, cultural, etc.
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(100), nullable=False)
    venue = db.Column(db.String(150), nullable=False)
    organizer = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=False)
    spots_left = db.Column(db.Integer, default=0)

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
            'image': self.image,
            'spotsLeft': self.spots_left
        }


class Club(db.Model):
    __tablename__ = 'clubs'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    logo = db.Column(db.String(20), nullable=False)
    faculty_coordinator = db.Column(db.String(100))
    student_coordinator = db.Column(db.String(100))
    members_count = db.Column(db.Integer, default=0)
    upcoming_events_count = db.Column(db.Integer, default=0)
    requirements = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'logo': self.logo,
            'facultyCoordinator': self.faculty_coordinator,
            'studentCoordinator': self.student_coordinator,
            'membersCount': self.members_count,
            'upcomingEventsCount': self.upcoming_events_count,
            'requirements': self.requirements
        }


class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # facility, lab, etc.
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


class Resource(db.Model):
    __tablename__ = 'resources'
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # notes, pyq, etc.
    subject_code = db.Column(db.String(20), nullable=False)
    subject_name = db.Column(db.String(150), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    file_size = db.Column(db.String(20), nullable=False)
    download_count = db.Column(db.Integer, default=0)
    added_by = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(200), nullable=True)
    file_url = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'subjectCode': self.subject_code,
            'subjectName': self.subject_name,
            'semester': self.semester,
            'fileSize': self.file_size,
            'downloadCount': self.download_count,
            'addedBy': self.added_by,
            'department': self.department,
            'description': self.description,
            'tags': self.tags,
            'fileUrl': self.file_url
        }


class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(20), nullable=False)  # high, normal

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'date': self.date,
            'content': self.content,
            'author': self.author,
            'priority': self.priority
        }


class Placement(db.Model):
    __tablename__ = 'placements'
    id = db.Column(db.String(50), primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    ctc = db.Column(db.String(50), nullable=False)
    eligibility = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # open, closed
    type = db.Column(db.String(20), nullable=False)  # fulltime, internship

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'ctc': self.ctc,
            'eligibility': self.eligibility,
            'deadline': self.deadline,
            'status': self.status,
            'type': self.type
        }


class Bus(db.Model):
    __tablename__ = 'buses'
    id = db.Column(db.String(50), primary_key=True)
    route_no = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    _stops = db.Column('stops', db.Text, nullable=False)  # JSON list string
    _timings = db.Column('timings', db.Text, nullable=False)  # JSON list string
    driver_name = db.Column(db.String(100))
    driver_phone = db.Column(db.String(20))

    @property
    def stops(self):
        return json.loads(self._stops) if self._stops else []

    @stops.setter
    def stops(self, val):
        self._stops = json.dumps(val)

    @property
    def timings(self):
        return json.loads(self._timings) if self._timings else []

    @timings.setter
    def timings(self, val):
        self._timings = json.dumps(val)

    def to_dict(self):
        return {
            'id': self.id,
            'routeNo': self.route_no,
            'destination': self.destination,
            'stops': self.stops,
            'timings': self.timings,
            'driverName': self.driver_name,
            'driverPhone': self.driver_phone
        }


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
    student_id = db.Column(db.String(50), db.ForeignKey('students.id'), nullable=False)
    block = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.String(50), nullable=False)
    end_date = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='PENDING')  # PENDING, APPROVED, REJECTED

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
