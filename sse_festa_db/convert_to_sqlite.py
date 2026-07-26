import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(__file__), "sse_festa_db.sqlite")
json_path = os.path.join(os.path.dirname(__file__), "extracted_saranathan_data.json")

if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Enable Foreign Keys in SQLite
cursor.execute("PRAGMA foreign_keys = ON;")

# 1. Schema DDL for SQLite
schema_sqlite = """
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dept_code TEXT NOT NULL UNIQUE,
  dept_name TEXT NOT NULL,
  description TEXT,
  hod_name TEXT,
  email TEXT,
  phone TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  course_id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  duration TEXT DEFAULT '4 Years',
  dept_id INTEGER NOT NULL,
  intake INTEGER,
  programme_type TEXT DEFAULT 'UG',
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
);

CREATE TABLE faculty (
  faculty_id INTEGER PRIMARY KEY AUTOINCREMENT,
  faculty_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  dept_id INTEGER NOT NULL,
  qualification TEXT,
  research_area TEXT,
  email TEXT,
  phone TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
);

CREATE TABLE academic_calendar (
  calendar_id INTEGER PRIMARY KEY AUTOINCREMENT,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TEXT,
  description TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exam_notices (
  notice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_title TEXT NOT NULL,
  notice_date TEXT,
  semester TEXT,
  description TEXT,
  pdf_link TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timetables (
  timetable_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dept_id INTEGER NOT NULL,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  pdf_url TEXT,
  last_updated TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
);

CREATE TABLE announcements (
  announcement_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  publish_date TEXT,
  description TEXT,
  attachment_url TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE placement_drives (
  drive_id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  drive_date TEXT,
  eligibility TEXT,
  package_offered TEXT,
  registration_link TEXT,
  status TEXT DEFAULT 'Completed',
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clubs (
  club_id INTEGER PRIMARY KEY AUTOINCREMENT,
  club_name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Institutional Cell',
  faculty_coordinator TEXT,
  description TEXT,
  activities TEXT,
  contact_email TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE research_centres (
  centre_id INTEGER PRIMARY KEY AUTOINCREMENT,
  centre_name TEXT NOT NULL UNIQUE,
  dept_id INTEGER,
  coordinator TEXT,
  description TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE TABLE gallery (
  gallery_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_title TEXT NOT NULL,
  event_name TEXT,
  category TEXT DEFAULT 'Event',
  image_url TEXT NOT NULL,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campus_buildings (
  building_id INTEGER PRIMARY KEY AUTOINCREMENT,
  building_name TEXT NOT NULL UNIQUE,
  building_type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_information (
  contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
  office_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT DEFAULT 'https://www.saranathan.ac.in',
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

cursor.executescript(schema_sqlite)

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Insert Departments
dept_id_map = {}
for d in data["departments"]:
    cursor.execute("""
    INSERT INTO departments (dept_code, dept_name, description, hod_name, email, phone, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (d['dept_code'], d['dept_name'], d['description'], d['hod_name'], d['email'], d['phone'], d['source_url']))
    dept_id_map[d['dept_code']] = cursor.lastrowid

# Insert Courses
for c in data["courses"]:
    d_id = dept_id_map.get(c['dept_code'])
    cursor.execute("""
    INSERT INTO courses (course_name, degree, duration, dept_id, intake, programme_type, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (c['course_name'], c['degree'], c['duration'], d_id, c['intake'], c['programme_type'], c['source_url']))

# Insert Faculty
for fac in data["faculty"]:
    d_id = dept_id_map.get(fac['dept_code'])
    cursor.execute("""
    INSERT INTO faculty (faculty_name, designation, dept_id, qualification, research_area, email, phone, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (fac['fac_name'], fac['designation'], d_id, fac['qualification'], fac['research_area'], fac['email'], fac['phone'], fac['source_url']))

# Insert Academic Calendar
for cal in data["academic_calendar"]:
    cursor.execute("""
    INSERT INTO academic_calendar (academic_year, semester, event_name, event_date, description, source_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (cal['academic_year'], cal['semester'], cal['event_name'], cal['event_date'], cal['description'], cal['source_url']))

# Insert Exam Notices
for ex in data["exam_notices"]:
    cursor.execute("""
    INSERT INTO exam_notices (notice_title, notice_date, semester, description, pdf_link, source_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (ex['title'], ex['notice_date'], ex['semester'], ex['description'], ex['pdf_url'], ex['source_url']))

# Insert Timetables
for tt in data["timetables"]:
    d_id = dept_id_map.get(tt['dept_code'])
    cursor.execute("""
    INSERT INTO timetables (dept_id, semester, academic_year, pdf_url, last_updated, source_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (d_id, tt['semester'], tt['academic_year'], tt['pdf_url'], tt['last_updated'], tt['source_url']))

# Insert Announcements
for ann in data["announcements"]:
    cursor.execute("""
    INSERT INTO announcements (title, category, publish_date, description, attachment_url, source_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (ann['title'], ann['category'], ann['publish_date'], ann['description'], ann['attachment_url'], ann['source_url']))

# Insert Placement Drives
for pd in data["placement_drives"]:
    cursor.execute("""
    INSERT INTO placement_drives (company_name, drive_date, eligibility, package_offered, registration_link, status, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (pd['company_name'], pd['drive_date'], pd['eligibility'], pd['package_offered'], pd['registration_link'], pd['status'], pd['source_url']))

# Insert Clubs
for cl in data["clubs"]:
    cursor.execute("""
    INSERT INTO clubs (club_name, category, faculty_coordinator, description, activities, contact_email, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (cl['club_name'], cl['category'], cl['faculty_coordinator'], cl['description'], cl['activities'], cl['contact_email'], cl['source_url']))

# Insert Research Centres
for rc in data["research_centres"]:
    d_id = dept_id_map.get(rc['dept_code']) if rc.get('dept_code') else None
    cursor.execute("""
    INSERT INTO research_centres (centre_name, dept_id, coordinator, description, source_url)
    VALUES (?, ?, ?, ?, ?)
    """, (rc['centre_name'], d_id, rc['coordinator'], rc['description'], rc['source_url']))

# Insert Gallery
for g in data["gallery"]:
    cursor.execute("""
    INSERT INTO gallery (image_title, event_name, category, image_url, source_url)
    VALUES (?, ?, ?, ?, ?)
    """, (g['image_title'], g['event_name'], g['category'], g['image_url'], g['source_url']))

# Insert Campus Buildings
for b in data["campus_buildings"]:
    cursor.execute("""
    INSERT INTO campus_buildings (building_name, building_type, description, location, source_url)
    VALUES (?, ?, ?, ?, ?)
    """, (b['building_name'], b['building_type'], b['description'], b['location'], b['source_url']))

# Insert Contact Info
for ci in data["contact_information"]:
    cursor.execute("""
    INSERT INTO contact_information (office_name, address, phone, email, website, source_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (ci['office_name'], ci['address'], ci['phone'], ci['email'], ci['website'], ci['source_url']))

conn.commit()
conn.close()

print(f"Created SQLite database file at: {db_path}")
