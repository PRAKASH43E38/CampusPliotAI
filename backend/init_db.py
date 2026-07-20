import os
import sys
import json
import uuid
from flask import Flask
from models import (
    db, Student, StudentProfile, Department, Semester, AdminUser, Subject, SubjectSyllabus,
    AcademicRecord, ClassSession, Faculty, Event, Club, Location, Resource, ResourceCategory,
    Announcement, Placement, Bus, BusStop, BusSchedule, HostelMenu, AIKnowledgeBase,
    SystemSetting, Skill, ResearchInterest, FacultyInterest, StudentSkill, Notification
)
from config import Config

def seed_database():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        # Clear existing tables (Clean state for MySQL)
        db.drop_all()
        db.create_all()

        print("Created all MySQL database tables successfully.")

        # 1. Seed Departments
        depts = {
            'CSE': Department(name='Computer Science & Engineering', code='CSE', head_of_dept='Dr. Ananya Sen', description='Department of CSE'),
            'IT': Department(name='Information Technology', code='IT', head_of_dept='Prof. Sridhar Murthy', description='Department of IT'),
            'ECE': Department(name='Electronics & Communication', code='ECE', head_of_dept='Dr. R. Pillai', description='Department of ECE'),
            'EEE': Department(name='Electrical & Electronics', code='EEE', head_of_dept='Dr. K. Swamy', description='Department of EEE'),
            'MECH': Department(name='Mechanical Engineering', code='MECH', head_of_dept='Dr. A. Verma', description='Department of Mechanical Engineering'),
            'CIVIL': Department(name='Civil Engineering', code='CIVIL', head_of_dept='Dr. S. Roy', description='Department of Civil Engineering'),
            'BIOTECH': Department(name='Biotechnology', code='BIOTECH', head_of_dept='Dr. M. Bose', description='Department of Biotechnology')
        }
        for d in depts.values():
            db.session.add(d)
        db.session.commit()
        print("Seeded 7 Departments.")

        # 2. Seed Semesters (Semester 1 and 2 for First Year, and 3-8 placeholder terms)
        sems = {}
        for num in range(1, 9):
            s = Semester(semester_number=num, academic_year='2025-2026')
            db.session.add(s)
            sems[num] = s
        db.session.commit()
        print("Seeded Semesters 1 to 8.")

        # 3. Seed Resource Categories
        res_categories = {
            'notes': ResourceCategory(name='Lecture Notes', code='notes'),
            'pyq': ResourceCategory(name='Previous Year Questions', code='pyq'),
            'syllabus': ResourceCategory(name='Syllabus Guides', code='syllabus'),
            'book': 'Reference Books', # wait, Category needs code and name
        }
        categories_data = [
            {'code': 'notes', 'name': 'Lecture Notes'},
            {'code': 'pyq', 'name': 'Previous Year Questions'},
            {'code': 'syllabus', 'name': 'Syllabus Guides'},
            {'code': 'book', 'name': 'Reference Books'},
            {'code': 'manual', 'name': 'Lab Manuals'}
        ]
        cats = {}
        for cat_item in categories_data:
            c = ResourceCategory(name=cat_item['name'], code=cat_item['code'])
            db.session.add(c)
            cats[cat_item['code']] = c
        db.session.commit()
        print("Seeded Resource Categories.")

        # 4. Seed Master Skills
        skills_list = ['Python', 'C', 'C++', 'Java', 'HTML', 'CSS', 'JavaScript', 'SQL', 'React', 'Flask', 'Data Structures', 'Algorithms']
        skills_map = {}
        for skill_name in skills_list:
            sk = Skill(name=skill_name)
            db.session.add(sk)
            skills_map[skill_name] = sk
        db.session.commit()
        print("Seeded Master Skills.")

        # 5. Seed default Admin (SuperAdmin)
        admin = AdminUser(
            id='ad-001',
            username='admin',
            email='admin@saranathan.ac.in',
            password_hash='admin123',
            role='SuperAdmin'
        )
        db.session.add(admin)
        db.session.commit()
        print("Seeded default Admin User.")

        # 6. Seed Faculty members
        faculty_data = [
            {'id': 'fac-01', 'name': 'Dr. Ananya Sen', 'designation': 'Professor & Head', 'dept': 'CSE', 'email': 'ananya.sen@saranathan.ac.in', 'cabin': 'Room 401, Main Block, 4th Floor', 'hours': 'Monday, Wednesday: 02:00 PM - 04:00 PM', 'avatar': 'AS'},
            {'id': 'fac-02', 'name': 'Dr. Ramesh Iyer', 'designation': 'Associate Professor', 'dept': 'CSE', 'email': 'ramesh.iyer@saranathan.ac.in', 'cabin': 'Room 412, Tech Block, 4th Floor', 'hours': 'Tuesday, Thursday: 01:00 PM - 03:00 PM', 'avatar': 'RI'},
            {'id': 'fac-03', 'name': 'Prof. Clara Mendonca', 'designation': 'Assistant Professor (Senior)', 'dept': 'CSE', 'email': 'clara.mendonca@saranathan.ac.in', 'cabin': 'Room 203, Tech Block', 'hours': 'Daily: 11:00 AM - 12:00 PM', 'avatar': 'CM'},
            {'id': 'fac-04', 'name': 'Dr. Vivek Nair', 'designation': 'Associate Professor', 'dept': 'CSE', 'email': 'vivek.nair@saranathan.ac.in', 'cabin': 'Room 415, Tech Block', 'hours': 'Friday: 09:00 AM - 12:00 PM', 'avatar': 'VN'},
            {'id': 'fac-05', 'name': 'Prof. Sridhar Murthy', 'designation': 'Assistant Professor', 'dept': 'IT', 'email': 'sridhar.murthy@saranathan.ac.in', 'cabin': 'Room 209, Main Block', 'hours': 'Monday, Friday: 03:00 PM - 05:00 PM', 'avatar': 'SM'}
        ]
        faculties = {}
        for f_item in faculty_data:
            fac = Faculty(
                id=f_item['id'],
                name=f_item['name'],
                designation=f_item['designation'],
                department_id=depts[f_item['dept']].id,
                email=f_item['email'],
                cabin=f_item['cabin'],
                office_hours=f_item['hours'],
                avatar=f_item['avatar']
            )
            db.session.add(fac)
            faculties[f_item['id']] = fac
        db.session.commit()

        # Seed Faculty Research Interests
        interests_data = ['NLP', 'Automata Theory', 'Distributed Databases', 'Big Data', 'Computer Vision', 'Deep Learning', 'Software Testing', 'Security', 'Web Performance']
        interests_map = {}
        for int_name in interests_data:
            ri = ResearchInterest(interest_name=int_name)
            db.session.add(ri)
            interests_map[int_name] = ri
        db.session.commit()

        # Link Faculty and Research Interests
        fac_interests_link = {
            'fac-01': ['NLP', 'Automata Theory'],
            'fac-02': ['Distributed Databases', 'Big Data'],
            'fac-03': ['Computer Vision', 'Deep Learning'],
            'fac-04': ['Software Testing', 'Security'],
            'fac-05': ['NLP', 'Web Performance']
        }
        for f_id, int_list in fac_interests_link.items():
            faculty_obj = faculties[f_id]
            for in_name in int_list:
                faculty_obj.interests.append(interests_map[in_name])
        db.session.commit()
        print("Seeded Faculty directories & Research interests.")

        # 7. Seed Subjects & Syllabi (For 7 Departments, Semester 1 & Semester 2)
        sem1_subject_templates = [
            {'code': 'HS101', 'name': 'Communicative English', 'credits': 3, 'type': 'Core'},
            {'code': 'MA101', 'name': 'Engineering Mathematics - I', 'credits': 4, 'type': 'Core'},
            {'code': 'PH101', 'name': 'Engineering Physics', 'credits': 3, 'type': 'Core'},
            {'code': 'CY101', 'name': 'Engineering Chemistry', 'credits': 3, 'type': 'Core'},
            {'code': 'CS101', 'name': 'Problem Solving and Python Programming', 'credits': 3, 'type': 'Core'},
            {'code': 'GE101', 'name': 'Engineering Practices Laboratory', 'credits': 2, 'type': 'Laboratory'}
        ]

        sem2_subject_templates = [
            {'code': 'HS102', 'name': 'Technical English', 'credits': 3, 'type': 'Core'},
            {'code': 'MA102', 'name': 'Engineering Mathematics - II', 'credits': 4, 'type': 'Core'},
            {'code': 'PH102', 'name': 'Materials Science', 'credits': 3, 'type': 'Core'},
            {'code': 'BE102', 'name': 'Basic Electrical, Electronics and Measurement Engineering', 'credits': 3, 'type': 'Core'},
            {'code': 'CS102', 'name': 'Programming in C', 'credits': 3, 'type': 'Core'},
            {'code': 'CS103', 'name': 'Programming and Data Structures Laboratory', 'credits': 2, 'type': 'Laboratory'}
        ]

        # Faculty coordinator allocation helpers
        fac_assignment = ['fac-01', 'fac-02', 'fac-03', 'fac-04', 'fac-05']

        subjects_seeded = {}
        sub_counter = 0

        # Loop through departments and seed subjects
        for dept_code, dept_obj in depts.items():
            # Semester 1
            for idx, templ in enumerate(sem1_subject_templates):
                sub_id = f"s-{dept_code.lower()}-s1-{idx+1}"
                sub_code = f"{templ['code']}-{dept_code}"
                coord_id = fac_assignment[idx % len(fac_assignment)]
                
                s_obj = Subject(
                    id=sub_id,
                    code=sub_code,
                    name=templ['name'],
                    credits=templ['credits'],
                    subject_type=templ['type'],
                    department_id=dept_obj.id,
                    semester_id=sems[1].id,
                    coordinator_faculty_id=faculties[coord_id].id,
                    description=f"Course covers foundational elements of {templ['name']} aligned with university syllabus.",
                    learning_outcomes=f"Students will gain proficiency in theoretical and practical topics of {templ['name']}.",
                    reference_books=f"1. Core Textbook of {templ['name']}, 2024 edition\n2. Advanced reference manual for {templ['name']}"
                )
                db.session.add(s_obj)
                subjects_seeded[f"{dept_code}-1-{templ['code']}"] = s_obj
                sub_counter += 1

                # Seed Syllabus (5 units) in 1NF
                for unit in range(1, 6):
                    syl = SubjectSyllabus(
                        subject_id=sub_id,
                        unit_number=unit,
                        unit_title=f"Unit {unit}: Fundamentals and applications of {templ['name']} part {unit}",
                        unit_content=f"Detailed study modules, lectures, problem sets, and laboratory instructions for Unit {unit}."
                    )
                    db.session.add(syl)

            # Semester 2
            for idx, templ in enumerate(sem2_subject_templates):
                sub_id = f"s-{dept_code.lower()}-s2-{idx+1}"
                sub_code = f"{templ['code']}-{dept_code}"
                coord_id = fac_assignment[(idx + 2) % len(fac_assignment)]
                
                s_obj = Subject(
                    id=sub_id,
                    code=sub_code,
                    name=templ['name'],
                    credits=templ['credits'],
                    subject_type=templ['type'],
                    department_id=dept_obj.id,
                    semester_id=sems[2].id,
                    coordinator_faculty_id=faculties[coord_id].id,
                    description=f"Course covers foundational elements of {templ['name']} aligned with university syllabus.",
                    learning_outcomes=f"Students will gain proficiency in theoretical and practical topics of {templ['name']}.",
                    reference_books=f"1. Core Textbook of {templ['name']}, 2024 edition\n2. Advanced reference manual for {templ['name']}"
                )
                db.session.add(s_obj)
                subjects_seeded[f"{dept_code}-2-{templ['code']}"] = s_obj
                sub_counter += 1

                # Seed Syllabus (5 units) in 1NF
                for unit in range(1, 6):
                    syl = SubjectSyllabus(
                        subject_id=sub_id,
                        unit_number=unit,
                        unit_title=f"Unit {unit}: Fundamentals and applications of {templ['name']} part {unit}",
                        unit_content=f"Detailed study modules, lectures, problem sets, and laboratory instructions for Unit {unit}."
                    )
                    db.session.add(syl)

        db.session.commit()
        print(f"Seeded {sub_counter} subjects and corresponding 1NF syllabus units.")

        print("Skipped student data seeding as per Phase 2 requirements.")

        # 10. Seed Class Timetable Sessions
        # Let's map Semester 1 CSE subjects to weekly classes
        classes_data = [
            {'sub': 'HS101', 'fac': 'fac-01', 'start': '09:00 AM', 'end': '09:55 AM', 'room': 'Room 101, Main Block', 'day': 'Monday'},
            {'sub': 'MA101', 'fac': 'fac-02', 'start': '10:00 AM', 'end': '10:55 AM', 'room': 'Room 101, Main Block', 'day': 'Monday'},
            {'sub': 'PH101', 'fac': 'fac-03', 'start': '11:15 AM', 'end': '12:10 PM', 'room': 'Physics Lab, Tech Block', 'day': 'Monday'},
            {'sub': 'CY101', 'fac': 'fac-04', 'start': '01:30 PM', 'end': '02:25 PM', 'room': 'Chemistry Lab, Tech Block', 'day': 'Monday'},
            
            {'sub': 'CS101', 'fac': 'fac-05', 'start': '09:00 AM', 'end': '10:55 AM', 'room': 'CSE Lab 2, Tech Block', 'day': 'Tuesday'},
            {'sub': 'GE101', 'fac': 'fac-01', 'start': '11:15 AM', 'end': '01:10 PM', 'room': 'Workshops Block A', 'day': 'Tuesday'},
            
            {'sub': 'MA101', 'fac': 'fac-02', 'start': '09:00 AM', 'end': '09:55 AM', 'room': 'Room 101, Main Block', 'day': 'Wednesday'},
            {'sub': 'PH101', 'fac': 'fac-03', 'start': '10:00 AM', 'end': '10:55 AM', 'room': 'Room 101, Main Block', 'day': 'Wednesday'},
            {'sub': 'CS101', 'fac': 'fac-05', 'start': '11:15 AM', 'end': '12:10 PM', 'room': 'Room 101, Main Block', 'day': 'Wednesday'}
        ]
        for c_data in classes_data:
            sub = subjects_seeded[f"CSE-1-{c_data['sub']}"]
            sess = ClassSession(
                subject_id=sub.id,
                faculty_id=faculties[c_data['fac']].id,
                time_start=c_data['start'],
                time_end=c_data['end'],
                room=c_data['room'],
                day=c_data['day']
            )
            db.session.add(sess)
        db.session.commit()
        print("Seeded Timetable schedules.")

        # 11. Seed Locations Navigation Metadata
        locations = [
            Location(name='Central Library', type='facility', block='Main Block', floor='Ground & 1st Floor', nearest_parking='Main Gate Parking A', description='Housing over 100,000 physical volumes, research repositories, and study zones.'),
            Location(name='CSE Lab 2', type='lab', block='Technology Block', floor='4th Floor', room_no='T-410', nearest_parking='Rear Block Parking B', description='Computer science laboratory equipped with modern programming clients and database instances.'),
            Location(name='Dean Office of Student Affairs', type='office', block='Administrative Block A', floor='1st Floor', room_no='A-102', nearest_parking='Main Gate Parking A', description='All student verification records, scholarship processes, and non-academic clearances.'),
            Location(name='University Medical Centre', type='facility', block='Emergency Wing', floor='Ground Floor', nearest_parking='Medical Ample bay', description='24/7 medical room with full-time resident physician and qualified nurse practitioners.'),
            Location(name='Aryabhata Hostels Block C', type='hostel', block='Hostel Sector B', floor='5 Storeys', nearest_parking='Hostel Compound Parking', description='Boys hostel with modern amenities, study rooms, gym facility, and attached cafeteria.')
        ]
        for loc in locations:
            db.session.add(loc)
        db.session.commit()
        print("Seeded Locations.")

        # 12. Seed Weekly Hostel Mess Menus
        menu_items = [
            HostelMenu(day='Monday', breakfast='Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch='Roti, Dal Tadka, Seasonal Veg, Rice, Curd', snack='Samosa, Mint Chutney, Tea', dinner='Roti, Paneer Butter Masala, Jeera Rice, Custard'),
            HostelMenu(day='Tuesday', breakfast='Aloo Paratha, Curd, Butter, Pickle, Milk', lunch='Roti, Rajma, Dry Aloo Jeera, Rice, Salad', snack='Veg Cutlet, Tomato Ketchup, Tea', dinner='Roti, Chicken Curry (or Kadai Mushroom), Pulao, Ice Cream'),
            HostelMenu(day='Wednesday', breakfast='Poha, Sev, Jalebi, Tea/Coffee', lunch='Roti, Chana Masala, Veg Pulao, Curd, Salad', snack='Bread Pakoda, Tea', dinner='Roti, Egg Curry (or Mixed Veg Kofta), Rice, Gulab Jamun'),
            HostelMenu(day='Thursday', breakfast='Uttapam, Sambar, Chutney, Tea/Coffee', lunch='Roti, Dal Makhani, Bhindi Masala, Rice, Curd', snack='Onion Pakoda, Tea', dinner='Roti, Kadai Paneer, Peas Pulao, Fruit Salad'),
            HostelMenu(day='Friday', breakfast='Chole Bhature, Pickle, Tea/Coffee', lunch='Roti, Kadhi Pakoda, Aloo Gobhi, Rice, Papad', snack='Dhokla, Green Chutney, Tea', dinner='Roti, Chicken Biryani (or Paneer Biryani), Raita, Kheer')
        ]
        for item in menu_items:
            db.session.add(item)
        db.session.commit()
        print("Seeded Hostel menus.")

        # 13. Seed Buses, Stops & Schedules (1NF Normalization)
        bus1 = Bus(id='bus-01', route_no='Route 14', destination='City Center / Tech Park', driver_name='Sohan Singh', driver_phone='+91 98765 43210')
        bus2 = Bus(id='bus-02', route_no='Route 22', destination='Rajouri Gardens Metro', driver_name='Manpreet Singh', driver_phone='+91 99887 76655')
        db.session.add_all([bus1, bus2])
        db.session.commit()

        stops1 = [
            ('Campus Main Gate', 1, '08:15 AM'),
            ('Vasant Kunj Crossing', 2, '08:35 AM'),
            ('Noida Sec 62 Hub', 3, '08:55 AM'),
            ('City Center Metro Station', 4, '05:40 PM'),
            ('Wave Mall Crossing', 5, '06:00 PM')
        ]
        for stop_name, order, time_str in stops1:
            stop = BusStop(bus_id=bus1.id, stop_name=stop_name, stop_order=order)
            db.session.add(stop)
            db.session.commit()
            sch = BusSchedule(stop_id=stop.id, arrival_time=time_str)
            db.session.add(sch)

        stops2 = [
            ('Campus Main Gate', 1, '08:00 AM'),
            ('Janakpuri Crossing', 2, '08:20 AM'),
            ('Hari Nagar Depot', 3, '08:40 AM'),
            ('Rajouri Gardens Complex', 4, '05:45 PM')
        ]
        for stop_name, order, time_str in stops2:
            stop = BusStop(bus_id=bus2.id, stop_name=stop_name, stop_order=order)
            db.session.add(stop)
            db.session.commit()
            sch = BusSchedule(stop_id=stop.id, arrival_time=time_str)
            db.session.add(sch)
        db.session.commit()
        print("Seeded Buses, Stops & Schedules.")

        # 14. Seed AI Knowledge Base Triggers
        kb_items = [
            AIKnowledgeBase(trigger_key='where is block a', response='### **Administrative Block A Navigation**\n\n**Block A** is located near the **Main Campus Entrance**.\n\n*   **Ground Floor**: Main Accounts Office, Fee counter, Admission Registration.\n*   **1st Floor**: Dean Office of Student Affairs (Room A-102), Dean of Academics Office.\n*   **2nd Floor**: Examination Cell, Grade Sheet Registry, and Board Room.\n\n*💡 Nearest Parking:* **Main Gate Parking Lot A**. Walk past the central fountain to enter Block A directly.', category='Navigation'),
            AIKnowledgeBase(trigger_key='hostel block c', response='### **Aryabhata Hostels Block C Navigation**\n\n**Aryabhata Block C** is situated in **Hostel Sector B** (North Wing of Campus).\n\n*   It is a 5-storey complex housing mostly Freshers and Sophomore students.\n*   **Warden Cabin**: Located at Room 101, Ground Floor.\n*   **Facilities**: In-house Gym (Ground Floor), Silent Study Lounge (3rd Floor), Cafeteria attached to back courtyard.\n\n*💡 Directions:* From the Main Canteen, take the northern walkway, pass the Football ground, and the block is directly behind Block B.', category='Navigation'),
            AIKnowledgeBase(trigger_key='timetable', response='### **Academic schedules**\n\nYou can query your dynamic class session listings under the **Academics** page. Your schedule includes lectures from 09:00 AM to 03:30 PM, Monday through Friday.', category='Academics')
        ]
        for kb in kb_items:
            db.session.add(kb)
        db.session.commit()
        print("Seeded AI Knowledge Base grounding triggers.")

        # 15. Seed System Settings
        settings = [
            SystemSetting(config_key='academic_year', config_value='2025-2026', description='Active session term year'),
            SystemSetting(config_key='maintenance_mode', config_value='false', description='Boolean status flag for site availability')
        ]
        for setting in settings:
            db.session.add(setting)
        db.session.commit()
        print("Seeded System Settings.")

        # 16. Seed Events & Clubs (With direct relationships to Admin and Faculty)
        ev1 = Event(
            id='ev-01',
            title='CodeRed National Hackathon 2026',
            category='technical',
            date='August 14-15, 2026',
            time='36 Hours continuous coding',
            venue='Convention Center, Main Block',
            organizer='University Coding Club',
            description='The premium annual national-level hackathon. Put your brainstorming hats on and build applications addressing global climate, institutional logistics, and smart healthcare.',
            image_url='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
            spots_left=42,
            created_by_admin_id=admin.id
        )
        db.session.add(ev1)
        db.session.commit()

        c1 = Club(
            id='cl-01',
            name='University Coding Club',
            category='Technical / Core Coding',
            description='The elite community for competitive programmers and open-source developers.',
            logo='💻',
            faculty_coordinator_id=faculties['fac-02'].id,
            student_coordinator='Aditya Sen (CSE, Final Year)',
            requirements='Basic understanding of one programming language (C++, Java, or Python).'
        )
        c2 = Club(
            id='cl-02',
            name='Focus Photography Club',
            category='Creative / Arts',
            description='Framing stories through lenses. Capture campus life, participate in photowalks, and master Lightroom curation.',
            logo='📷',
            faculty_coordinator_id=faculties['fac-03'].id,
            student_coordinator='Rohit Verma (IT, 3rd Year)',
            requirements='Any camera (even a basic smartphone with passion for composition).'
        )
        db.session.add_all([c1, c2])
        db.session.commit()

        # Seed placements
        pl1 = Placement(
            id='pl-01',
            company='Adobe Systems',
            role='Member of Technical Staff',
            ctc='42.5 LPA',
            eligibility='CGPA >= 8.5, CSE/IT',
            deadline='July 22, 2026',
            status='open',
            type='fulltime',
            job_description='Work on core creative cloud suite algorithms and scale services.'
        )
        db.session.add(pl1)
        db.session.commit()

        print("Database initialized & seeded with zero mock resources and empty profiles.")

if __name__ == '__main__':
    seed_database()
