import os
import sys
from flask import Flask
from models import (
    db, Student, Subject, ClassSession, Faculty, Event, Club, Location,
    Resource, Announcement, Placement, Bus, HostelMenu, EventRegistration, ClubMembership, SavedResource
)
from config import Config

def seed_database():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        # Drop and create tables
        db.drop_all()
        db.create_all()

        print("Created all database tables.")

        # 1. Seed Student
        devashish = Student(
            id='st-0982',
            name='Devashish Sharma',
            roll_no='2023CSE0145',
            department='Computer Science & Engineering',
            course='B.Tech in CSE (AI & ML)',
            semester=5,
            email='2023@saranathan.ac.in',
            avatar='',
            attendance_overall=84.5,
            cgpa=8.76,
            total_credits=92,
            hostel_block='Aryabhata Block C',
            hostel_room='304-A'
        )
        db.session.add(devashish)

        # 2. Seed Subjects
        subjects = [
            Subject(
                id='s-01',
                code='CS301',
                name='Database Management Systems',
                credits=4,
                attendance=88.2,
                faculty_name='Dr. Ramesh Iyer',
                cia1=18, cia2=17, cia3=19, cia_max=20,
                syllabus_units=[
                    'Unit I: Introduction to DBMS & Relational Model (ER Diagrams, Mapping)',
                    'Unit II: SQL Queries, Normalization (1NF, 2NF, 3NF, BCNF)',
                    'Unit III: Transaction Management and Concurrency Control (ACID properties, Locks)',
                    'Unit IV: Database Storage Structures (Indexing, B-Trees, Hashing)',
                    'Unit V: NoSQL & Distributed Databases (MongoDB, Cassandra, CAP Theorem)'
                ]
            ),
            Subject(
                id='s-02',
                code='CS302',
                name='Theory of Computation',
                credits=4,
                attendance=76.5,
                faculty_name='Dr. Ananya Sen',
                cia1=14, cia2=15, cia3=13, cia_max=20,
                syllabus_units=[
                    'Unit I: Finite Automata (DFA, NFA, Minimization, Regular Expressions)',
                    'Unit II: Context-Free Grammars (Derivation Trees, Chomsky Normal Form)',
                    'Unit III: Pushdown Automata (Equivalence, Deterministic PDA)',
                    'Unit IV: Turing Machines (Design of TM, Halting Problem, Undecidability)',
                    'Unit V: Computational Complexity (P, NP, NP-Complete, Cook-Levin Theorem)'
                ]
            ),
            Subject(
                id='s-03',
                code='CS303',
                name='Machine Learning',
                credits=4,
                attendance=85.0,
                faculty_name='Prof. Clara Mendonca',
                cia1=19, cia2=18, cia3=20, cia_max=20,
                syllabus_units=[
                    'Unit I: Introduction & Supervised Learning (Linear Regression, KNN, Naive Bayes)',
                    'Unit II: Tree Models & Support Vector Machines (Decision Trees, SVM Kernels)',
                    'Unit III: Unsupervised Learning & Clustering (K-Means, PCA, Hierarchical)',
                    'Unit IV: Deep Learning Foundations (Perceptrons, Feedforward Networks, Backpropagation)',
                    'Unit V: Reinforcement Learning & LLMs (Q-learning, Transformer Architectures)'
                ]
            ),
            Subject(
                id='s-04',
                code='CS304',
                name='Software Engineering',
                credits=3,
                attendance=82.1,
                faculty_name='Dr. Vivek Nair',
                cia1=17, cia2=16, cia3=18, cia_max=20,
                syllabus_units=[
                    'Unit I: Software Process Models (Waterfall, Agile, Scrum, Devops)',
                    'Unit II: Requirements Engineering (SRS Documentation, Use Case Modeling)',
                    'Unit III: Software Design Frameworks (UML Diagrams, Architectural Styles)',
                    'Unit IV: Testing Methodologies (White Box, Black Box, Unit, Integration)',
                    'Unit V: Software Project Management (COCOMO Model, Risk Management)'
                ]
            ),
            Subject(
                id='s-05',
                code='CS306',
                name='Web Technologies',
                credits=3,
                attendance=90.4,
                faculty_name='Prof. Sridhar Murthy',
                cia1=20, cia2=19, cia3=18, cia_max=20,
                syllabus_units=[
                    'Unit I: Internet Baselines & Styling (HTML5, CSS3, Tailwind CSS)',
                    'Unit II: Client-Side Scripting (ES6+ Javascript, DOM Manipulation, Async/Await)',
                    'Unit III: React Essentials (Hooks, Virtual DOM, Components, Props/State)',
                    'Unit IV: Backend Development (Node.js, Express, Middleware, REST APIs)',
                    'Unit V: Full-stack Integration & Security (JWT, CORS, Deployment on Cloud)'
                ]
            )
        ]
        for sub in subjects:
            db.session.add(sub)

        # 3. Seed Class Timetable
        classes = [
            ClassSession(id='c-01', subject_code='CS301', subject_name='Database Management Systems', faculty_name='Dr. Ramesh Iyer', time_start='09:00 AM', time_end='09:55 AM', room='CSE Lab 2, Main Block', day='Monday'),
            ClassSession(id='c-02', subject_code='CS302', subject_name='Theory of Computation', faculty_name='Dr. Ananya Sen', time_start='10:00 AM', time_end='10:55 AM', room='Room 301, Block A', day='Monday'),
            ClassSession(id='c-03', subject_code='CS303', subject_name='Machine Learning', faculty_name='Prof. Clara Mendonca', time_start='11:15 AM', time_end='12:10 PM', room='Seminar Hall, Tech Block', day='Monday'),
            ClassSession(id='c-04', subject_code='CS304', subject_name='Software Engineering', faculty_name='Dr. Vivek Nair', time_start='01:30 PM', time_end='02:25 PM', room='Room 303, Block A', day='Monday'),
            
            ClassSession(id='c-05', subject_code='CS303', subject_name='Machine Learning', faculty_name='Prof. Clara Mendonca', time_start='09:00 AM', time_end='10:55 AM', room='Seminar Hall, Tech Block', day='Tuesday'),
            ClassSession(id='c-06', subject_code='CS305', subject_name='DBMS Laboratory', faculty_name='Dr. Ramesh Iyer', time_start='11:15 AM', time_end='01:10 PM', room='Database Lab, Tech Block', day='Tuesday'),
            ClassSession(id='c-07', subject_code='CS306', subject_name='Web Technologies', faculty_name='Prof. Sridhar Murthy', time_start='02:30 PM', time_end='03:25 PM', room='Room 302, Block A', day='Tuesday'),

            ClassSession(id='c-08', subject_code='CS302', subject_name='Theory of Computation', faculty_name='Dr. Ananya Sen', time_start='09:00 AM', time_end='09:55 AM', room='Room 301, Block A', day='Wednesday'),
            ClassSession(id='c-09', subject_code='CS301', subject_name='Database Management Systems', faculty_name='Dr. Ramesh Iyer', time_start='10:00 AM', time_end='10:55 AM', room='Room 301, Block A', day='Wednesday'),
            ClassSession(id='c-10', subject_code='CS304', subject_name='Software Engineering', faculty_name='Dr. Vivek Nair', time_start='11:15 AM', time_end='12:10 PM', room='Room 303, Block A', day='Wednesday'),
            ClassSession(id='c-11', subject_code='CS307', subject_name='Web Technologies Lab', faculty_name='Prof. Sridhar Murthy', time_start='01:30 PM', time_end='03:25 PM', room='Web Dev Lab, Tech Block', day='Wednesday'),

            ClassSession(id='c-12', subject_code='CS303', subject_name='Machine Learning', faculty_name='Prof. Clara Mendonca', time_start='09:00 AM', time_end='09:55 AM', room='Seminar Hall, Tech Block', day='Thursday'),
            ClassSession(id='c-13', subject_code='CS306', subject_name='Web Technologies', faculty_name='Prof. Sridhar Murthy', time_start='10:00 AM', time_end='10:55 AM', room='Room 302, Block A', day='Thursday'),
            ClassSession(id='c-14', subject_code='CS301', subject_name='Database Management Systems', faculty_name='Dr. Ramesh Iyer', time_start='11:15 AM', time_end='12:10 PM', room='Room 301, Block A', day='Thursday'),
            ClassSession(id='c-15', subject_code='CS304', subject_name='Software Engineering', faculty_name='Dr. Vivek Nair', time_start='01:30 PM', time_end='02:25 PM', room='Room 303, Block A', day='Thursday'),

            ClassSession(id='c-16', subject_code='CS302', subject_name='Theory of Computation', faculty_name='Dr. Ananya Sen', time_start='09:00 AM', time_end='10:55 AM', room='Room 301, Block A', day='Friday'),
            ClassSession(id='c-17', subject_code='CS306', subject_name='Web Technologies', faculty_name='Prof. Sridhar Murthy', time_start='11:15 AM', time_end='12:10 PM', room='Room 302, Block A', day='Friday'),
            ClassSession(id='c-18', subject_code='CS308', subject_name='Placement Aptitude Training', faculty_name='Mr. Arvind Saxena', time_start='01:30 PM', time_end='03:25 PM', room='Auditorium 1, Main Block', day='Friday')
        ]
        for cls in classes:
            db.session.add(cls)

        # 4. Seed Faculty
        faculty_members = [
            Faculty(
                id='fac-01',
                name='Dr. Ananya Sen',
                designation='Professor & Head',
                department='Computer Science & Engineering',
                email='ananya.sen@university.edu',
                cabin='Room 401, Main Block, 4th Floor',
                office_hours='Monday, Wednesday: 02:00 PM - 04:00 PM',
                research_interests=['Automata Theory', 'Natural Language Processing', 'Compiler Design'],
                avatar='AS'
            ),
            Faculty(
                id='fac-02',
                name='Dr. Ramesh Iyer',
                designation='Associate Professor',
                department='Computer Science & Engineering',
                email='ramesh.iyer@university.edu',
                cabin='Room 412, Tech Block, 4th Floor',
                office_hours='Tuesday, Thursday: 01:00 PM - 03:00 PM',
                research_interests=['Distributed Databases', 'Big Data Analytics', 'Blockchain Architecture'],
                avatar='RI'
            ),
            Faculty(
                id='fac-03',
                name='Prof. Clara Mendonca',
                designation='Assistant Professor (Senior)',
                department='Computer Science & Engineering',
                email='clara.mendonca@university.edu',
                cabin='Room 203, Seminar Hall Wing, Tech Block',
                office_hours='Daily: 11:00 AM - 12:00 PM',
                research_interests=['Computer Vision', 'Deep Learning Model Compression', 'Surgical AI'],
                avatar='CM'
            ),
            Faculty(
                id='fac-04',
                name='Dr. Vivek Nair',
                designation='Associate Professor',
                department='Computer Science & Engineering',
                email='vivek.nair@university.edu',
                cabin='Room 415, Tech Block, 4th Floor',
                office_hours='Friday: 09:00 AM - 12:00 PM',
                research_interests=['Agile Process Optimisation', 'Software Testing Automation', 'Microservice Security'],
                avatar='VN'
            ),
            Faculty(
                id='fac-05',
                name='Prof. Sridhar Murthy',
                designation='Assistant Professor',
                department='Information Technology',
                email='sridhar.murthy@university.edu',
                cabin='Room 209, Main Block, 2nd Floor',
                office_hours='Monday, Friday: 03:00 PM - 05:00 PM',
                research_interests=['Web Application Frameworks', 'Realtime Systems', 'PWA Performance'],
                avatar='SM'
            )
        ]
        for fac in faculty_members:
            db.session.add(fac)

        # 5. Seed Events
        events = [
            Event(
                id='ev-01',
                title='CodeRed National Hackathon 2026',
                category='technical',
                date='August 14-15, 2026',
                time='36 Hours continuous coding',
                venue='Convention Center, Main Block',
                organizer='University Coding Club',
                description='The premium annual national-level hackathon. Put your brainstorming hats on and build applications addressing global climate, institutional logistics, and smart healthcare. Grand prize pool of $5,000.',
                image='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
                spots_left=42
            ),
            Event(
                id='ev-02',
                title='Symposium on Modern Deep Learning',
                category='academic',
                date='July 28, 2026',
                time='10:00 AM - 04:00 PM',
                venue='Seminar Hall, Technology Block',
                organizer='CSE & AI/ML Department',
                description='Join industry veterans from Google Brain, DeepMind, and Meta AI discussing the next frontier in AI, Transformer alternatives (Mamba, Liquid Networks), and Edge Computing integration.',
                image='https://images.unsplash.com/photo-1591115765373-520976827f3b?auto=format&fit=crop&q=80&w=800',
                spots_left=120
            ),
            Event(
                id='ev-03',
                title='Starlight Cultural Gala Night',
                category='cultural',
                date='August 08, 2026',
                time='06:00 PM onwards',
                venue='University Open Auditorium',
                organizer='Arts & Cultural Council',
                description='An enchanting evening showcasing spectacular classical dance, rock band competitions, vocal harmonies, and interactive theatre performances. Food stalls, campus lights, and pure celebration!',
                image='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
                spots_left=300
            ),
            Event(
                id='ev-04',
                title='Mock Placement Drive & Resume Clinic',
                category='career',
                date='July 25, 2026',
                time='09:00 AM - 05:00 PM',
                venue='Placement Office, Block B',
                organizer='Career Development Cell',
                description='Get your resume audited by corporate recruiters. Attend mock 1-on-1 technical and HR interviews, aptitude tests, and feedback sessions to conquer your upcoming placement season with confidence.',
                image='https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
                spots_left=15
            )
        ]
        for ev in events:
            db.session.add(ev)

        # 6. Seed Clubs
        clubs = [
            Club(
                id='cl-01',
                name='University Coding Club',
                category='Technical / Core Coding',
                description='The elite community for competitive programmers and open-source developers. Regular practice contests, technical workshops, global hackathons coaching, and contribution sessions.',
                logo='💻',
                faculty_coordinator='Dr. Ramesh Iyer',
                student_coordinator='Aditya Sen (CSE, Final Year)',
                members_count=412,
                upcoming_events_count=2,
                requirements='Basic understanding of one programming language (C++, Java, Python, or TS).'
            ),
            Club(
                id='cl-02',
                name='Nexus Robotics Club',
                category='Technical / Engineering',
                description='Pioneering custom robotics architectures, drone designs, microcontroller automation, and Internet of Things (IoT) prototype blueprints.',
                logo='🤖',
                faculty_coordinator='Dr. Vivek Nair',
                student_coordinator='Nisha Pillai (ECE, 3rd Year)',
                members_count=245,
                upcoming_events_count=1,
                requirements='Interest in hardware-software interfaces, microcontrollers, or ROS (Robot OS).'
            ),
            Club(
                id='cl-03',
                name='Focus Photography Club',
                category='Creative / Arts',
                description='Framing stories through lenses. Capture campus life, participate in photowalks, master DSLR controls, Adobe Lightroom curation, and secure entries to national photography awards.',
                logo='📷',
                faculty_coordinator='Prof. Clara Mendonca',
                student_coordinator='Rohit Verma (IT, 3rd Year)',
                members_count=180,
                upcoming_events_count=1,
                requirements='Any camera (even a basic smartphone with passion for composition).'
            )
        ]
        for cl in clubs:
            db.session.add(cl)

        # 7. Seed Locations
        locations = [
            Location(id='loc-01', name='Central Library', type='facility', block='Main Block', floor='Ground & 1st Floor', nearest_parking='Main Gate Parking A', description='Housing over 100,000 physical volumes, research repositories, and interactive computer cabins. Fully air-conditioned silent study zones.'),
            Location(id='loc-02', name='Database Management Lab', type='lab', block='Technology Block', floor='4th Floor', room_no='T-410', nearest_parking='Rear Block Parking B', description='Core computer science laboratory fully equipped with Oracle, PostgreSQL, and Mongo servers. Used for CSE core lectures and examinations.'),
            Location(id='loc-03', name='Dean Office of Student Affairs', type='office', block='Administrative Block A', floor='1st Floor', room_no='A-102', nearest_parking='Main Gate Parking A', description='All student verification records, scholarship processes, physical certificates collection, and non-academic permissions clearances.'),
            Location(id='loc-04', name='University Medical Centre', type='facility', block='Emergency Wing', floor='Ground Floor', nearest_parking='Medical Ample bay', description='Fully operational 24/7 medical room with full-time resident physician and qualified nurse practitioners. Fully stocked ambulance on standby.'),
            Location(id='loc-05', name='Aryabhata Hostels Block C', type='hostel', block='Hostel Sector B', floor='5 Storeys', nearest_parking='Hostel Compound Parking', description='Boys hostel with modern amenities, study rooms, gym facility, and attached cafeteria. House of freshers and 2nd years.')
        ]
        for loc in locations:
            db.session.add(loc)

        # 8. Seed Resources (Initially empty)
        resources = []
        for res in resources:
            db.session.add(res)

        # 9. Seed Announcements
        announcements = [
            Announcement(id='ann-01', title='CIA-2 Internal Assessment Schedule & Syllabus Allocation', category='academic', date='July 18, 2026', content='The CIA-2 Assessments will commence from August 3, 2026. Hall tickets, seating arrangements, and exact timings will be published on the portal shortly. The syllabus coverage includes everything up to Unit III of respectively allocated subject models.', author='Prof. J. Mathew (Dean Academics)', priority='high'),
            Announcement(id='ann-02', title='Placement Registration Open for Adobe Systems Software Engineer Role', category='placement', date='July 16, 2026', content='Adobe Systems has opened registrations for the profile of Member of Technical Staff (MTS). Eligibility: B.Tech CSE/IT, CGPA >= 8.5, No active backlogs. CTC: 42.5 LPA. Register via Placement wing before July 22, 11:59 PM.', author='Mr. Vivek Chhabra (Placement Director)', priority='high'),
            Announcement(id='ann-03', title='Hostel Maintenance Shutdown & Cafeteria Timings Updated', category='general', date='July 15, 2026', content='Due to routine maintenance of block electrical panels, power outage is expected in Blocks C & D on Sunday, July 20 between 09:00 AM - 01:00 PM. Lunch will be hosted at the main dining hall instead.', author='Col. K.S. Rathore (Hostel Warden)', priority='normal')
        ]
        for ann in announcements:
            db.session.add(ann)

        # 10. Seed Placements
        placements = [
            Placement(id='pl-01', company='Google India', role='Software Engineer (L3)', ctc='55.4 LPA', eligibility='CGPA >= 8.5, B.Tech CSE/IT/ECE only', deadline='July 28, 2026', status='open', type='fulltime'),
            Placement(id='pl-02', company='Adobe Systems', role='Member of Technical Staff', ctc='42.5 LPA', eligibility='CGPA >= 8.5, CSE/IT', deadline='July 22, 2026', status='open', type='fulltime'),
            Placement(id='pl-03', company='Zoho Corporation', role='Product Developer Intern', ctc='50,000 / month (stipend)', eligibility='Open to all branches, No CGPA criteria', deadline='August 05, 2026', status='open', type='internship'),
            Placement(id='pl-04', company='Microsoft India', role='Cloud Engineer Specialist', ctc='38.0 LPA', eligibility='CGPA >= 8.0, B.Tech/M.Tech', deadline='July 12, 2026', status='closed', type='fulltime')
        ]
        for pl in placements:
            db.session.add(pl)

        # 11. Seed Buses
        buses = [
            Bus(id='bus-01', route_no='Route 14', destination='City Center / Tech Park', stops=['Campus Main Gate', 'Vasant Kunj Crossing', 'Noida Sec 62 Hub', 'City Center Metro Station', 'Wave Mall Crossing'], timings=['08:15 AM (Arrival)', '05:40 PM (Departure)'], driver_name='Sohan Singh', driver_phone='+91 98765 43210'),
            Bus(id='bus-02', route_no='Route 22', destination='Rajouri Gardens Metro', stops=['Campus Main Gate', 'Janakpuri Crossing', 'Hari Nagar Depot', 'Rajouri Gardens Complex'], timings=['08:00 AM (Arrival)', '05:45 PM (Departure)'], driver_name='Manpreet Singh', driver_phone='+91 99887 76655')
        ]
        for b in buses:
            db.session.add(b)

        # 12. Seed HostelMenu
        menu_items = {
            'Monday': HostelMenu(day='Monday', breakfast='Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch='Roti, Dal Tadka, Seasonal Veg, Rice, Curd', snack='Samosa, Mint Chutney, Tea', dinner='Roti, Paneer Butter Masala, Jeera Rice, Custard'),
            'Tuesday': HostelMenu(day='Tuesday', breakfast='Aloo Paratha, Curd, Butter, Pickle, Milk', lunch='Roti, Rajma, Dry Aloo Jeera, Rice, Salad', snack='Veg Cutlet, Tomato Ketchup, Tea', dinner='Roti, Chicken Curry (or Kadai Mushroom), Pulao, Ice Cream'),
            'Wednesday': HostelMenu(day='Wednesday', breakfast='Poha, Sev, Jalebi, Tea/Coffee', lunch='Roti, Chana Masala, Veg Pulao, Curd, Salad', snack='Bread Pakoda, Tea', dinner='Roti, Egg Curry (or Mixed Veg Kofta), Rice, Gulab Jamun'),
            'Thursday': HostelMenu(day='Thursday', breakfast='Uttapam, Sambar, Chutney, Tea/Coffee', lunch='Roti, Dal Makhani, Bhindi Masala, Rice, Curd', snack='Onion Pakoda, Tea', dinner='Roti, Kadai Paneer, Peas Pulao, Fruit Salad'),
            'Friday': HostelMenu(day='Friday', breakfast='Chole Bhature, Pickle, Tea/Coffee', lunch='Roti, Kadhi Pakoda, Aloo Gobhi, Rice, Papad', snack='Dhokla, Green Chutney, Tea', dinner='Roti, Chicken Biryani (or Paneer Biryani), Raita, Kheer')
        }
        for item in menu_items.values():
            db.session.add(item)

        # Save base changes
        db.session.commit()

        # 13. Seed many-to-many associations for Devashish
        devashish.registered_events.append(Event.query.get('ev-01'))
        devashish.joined_clubs.extend([Club.query.get('cl-01'), Club.query.get('cl-03')])
        devashish.applied_placements.append(Placement.query.get('pl-02'))
        
        db.session.commit()
        print("Database seeded successfully with all mock data!")

if __name__ == '__main__':
    seed_database()
