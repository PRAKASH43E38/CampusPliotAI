-- ============================================================================
-- Student Database Module: student_profiles
-- Database Engine: SQLite / MySQL Compatible
-- File: 04_student_profiles.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_profiles (
  student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Personal Information (Step 1)
  full_name VARCHAR(150) NOT NULL,
  college_email VARCHAR(150) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  gender VARCHAR(20),
  dob VARCHAR(20),
  address TEXT,
  
  -- Academic Information (Step 2 - Read Only from College DB)
  register_number VARCHAR(50) NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  batch VARCHAR(20) NOT NULL,
  year VARCHAR(20) NOT NULL,
  semester INTEGER DEFAULT 1,
  section VARCHAR(10) DEFAULT 'A',
  
  -- Economic Information (Step 3)
  parent_name VARCHAR(150),
  parent_occupation VARCHAR(100),
  family_income VARCHAR(50),
  first_graduate BOOLEAN DEFAULT 0,
  scholarship_required BOOLEAN DEFAULT 0,
  
  -- Multi-Select Fields (Steps 4, 5, 6) stored as JSON
  current_skills TEXT,
  areas_of_interest TEXT,
  campus_interests TEXT,
  
  -- Self Assessment (Step 7)
  communication_skills BOOLEAN DEFAULT 1,
  teamwork BOOLEAN DEFAULT 1,
  leadership BOOLEAN DEFAULT 0,
  problem_solving BOOLEAN DEFAULT 1,
  confidence_level VARCHAR(20) DEFAULT 'Medium',
  
  -- Short Personal Questions (Step 8)
  reason_for_department TEXT,
  excited_to_learn TEXT,
  new_skill_first_year TEXT,
  
  -- Metrics, Status & Timestamps
  profile_completed BOOLEAN DEFAULT 1,
  profile_completion_pct INTEGER DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_reg_no ON student_profiles(register_number);
CREATE INDEX IF NOT EXISTS idx_student_email ON student_profiles(college_email);
CREATE INDEX IF NOT EXISTS idx_student_dept ON student_profiles(department);
CREATE INDEX IF NOT EXISTS idx_student_year ON student_profiles(year);
CREATE INDEX IF NOT EXISTS idx_student_batch ON student_profiles(batch);
