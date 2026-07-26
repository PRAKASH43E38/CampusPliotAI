-- ============================================================================
-- Central Database Schema for SSE FESTA (Saranathan College of Engineering)
-- Database Engine: SQLite3
-- File: sse_festa_db.sqlite
-- Standard: 3NF (Third Normal Form)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. Table: departments
-- Stores official department details, HOD, and contact information.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  dept_id INTEGER PRIMARY KEY AUTOINCREMENT,
  dept_code TEXT NOT NULL UNIQUE,
  dept_name TEXT NOT NULL,
  description TEXT,
  hod_name TEXT,
  email TEXT,
  phone TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dept_code ON departments(dept_code);
CREATE INDEX IF NOT EXISTS idx_dept_name ON departments(dept_name);

-- ----------------------------------------------------------------------------
-- 2. Table: courses
-- Stores academic degree programs offered by the institution.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  course_id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  duration TEXT DEFAULT '4 Years',
  dept_id INTEGER NOT NULL,
  intake INTEGER,
  programme_type TEXT CHECK(programme_type IN ('UG', 'PG', 'PhD')) DEFAULT 'UG',
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_degree_prog ON courses(degree, programme_type);
CREATE INDEX IF NOT EXISTS idx_course_dept ON courses(dept_id);

-- ----------------------------------------------------------------------------
-- 3. Table: faculty
-- Stores details of faculty members across departments.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_faculty_dept ON faculty(dept_id);
CREATE INDEX IF NOT EXISTS idx_designation ON faculty(designation);
CREATE INDEX IF NOT EXISTS idx_faculty_email ON faculty(email);

-- ----------------------------------------------------------------------------
-- 4. Table: academic_calendar
-- Stores key institutional calendar events, reopening dates, and IAT exams.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_calendar (
  calendar_id INTEGER PRIMARY KEY AUTOINCREMENT,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TEXT,
  description TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_acad_yr_sem ON academic_calendar(academic_year, semester);
CREATE INDEX IF NOT EXISTS idx_event_date ON academic_calendar(event_date);

-- ----------------------------------------------------------------------------
-- 5. Table: exam_notices
-- Stores examination notifications and timetable links from COE.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_notices (
  notice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  notice_title TEXT NOT NULL,
  notice_date TEXT,
  semester TEXT,
  description TEXT,
  pdf_link TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notice_date ON exam_notices(notice_date);
CREATE INDEX IF NOT EXISTS idx_exam_sem ON exam_notices(semester);

-- ----------------------------------------------------------------------------
-- 6. Table: timetables
-- Stores department-wise class timetables.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetables (
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

CREATE INDEX IF NOT EXISTS idx_timetable_dept ON timetables(dept_id);
CREATE INDEX IF NOT EXISTS idx_timetable_sem ON timetables(semester);

-- ----------------------------------------------------------------------------
-- 7. Table: announcements
-- Stores official campus announcements, circulars, and notifications.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  announcement_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  publish_date TEXT,
  description TEXT,
  attachment_url TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcement_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_publish_date ON announcements(publish_date);

-- ----------------------------------------------------------------------------
-- 8. Table: placement_drives
-- Stores placement drives, recruiting companies, packages, and drive status.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_drives (
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

CREATE INDEX IF NOT EXISTS idx_company_name ON placement_drives(company_name);
CREATE INDEX IF NOT EXISTS idx_drive_date ON placement_drives(drive_date);

-- ----------------------------------------------------------------------------
-- 9. Table: clubs
-- Stores campus clubs, societies, and institutional cells.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clubs (
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

CREATE INDEX IF NOT EXISTS idx_club_category ON clubs(category);

-- ----------------------------------------------------------------------------
-- 10. Table: research_centres
-- Stores recognized research centres and R&D facilities.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_centres (
  centre_id INTEGER PRIMARY KEY AUTOINCREMENT,
  centre_name TEXT NOT NULL UNIQUE,
  dept_id INTEGER,
  coordinator TEXT,
  description TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_rc_dept ON research_centres(dept_id);

-- ----------------------------------------------------------------------------
-- 11. Table: gallery
-- Stores media images, event photographs, and press releases.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  gallery_id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_title TEXT NOT NULL,
  event_name TEXT,
  category TEXT DEFAULT 'Event',
  image_url TEXT NOT NULL,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_category ON gallery(event_name, category);

-- ----------------------------------------------------------------------------
-- 12. Table: campus_buildings
-- Stores details about physical infrastructure and facilities.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campus_buildings (
  building_id INTEGER PRIMARY KEY AUTOINCREMENT,
  building_name TEXT NOT NULL UNIQUE,
  building_type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_building_type ON campus_buildings(building_type);

-- ----------------------------------------------------------------------------
-- 13. Table: contact_information
-- Stores official contact records for institutional offices.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_information (
  contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
  office_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT DEFAULT 'https://www.saranathan.ac.in',
  source_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_office_name ON contact_information(office_name);
