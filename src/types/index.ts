export type Role = 'student' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  year?: string;
  section?: string;
  rollNumber?: string;
  cgpa?: number;
  attendancePct?: number;
  bio?: string;
  profileCompleted?: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  floor: number;
  type: 'Lecture Hall' | 'Lab' | 'Faculty Cabin' | 'Seminar Hall' | 'Facility';
  capacity: number;
  currentStatus: string; // e.g. "Ongoing: AI Lecture", "Available", "Lab Session"
  instructor?: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: 'academic' | 'lab' | 'facility' | 'hostel' | 'sports' | 'medical' | 'admin' | 'gate' | 'parking';
  description: string;
  floors: number;
  image: string;
  coordinates: { x: number; y: number }; // Percentage offset on interactive map
  departments: string[];
  facilities: string[];
  classrooms?: Classroom[];
  contactPerson?: string;
  openingHours: string;
  status: 'Open' | 'Restricted' | 'Closed';
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  cabin: string;
  officeHours: string;
  avatar: string;
  specialization: string[];
  rating: number;
  researchArea: string;
  status: 'In Cabin' | 'In Class' | 'On Leave' | 'Busy';
}

export interface CourseSubject {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  semester: number;
  facultyName: string;
  facultyCabin: string;
  totalClasses: number;
  attendedClasses: number;
  grade?: string;
  syllabusUrl?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subjectCode: string;
  subjectName: string;
  building: string;
  room: string;
  facultyName: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Hackathon' | 'Seminar';
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
  registeredCount: number;
  maxCapacity: number;
  isRegistered?: boolean;
  featured?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Exam' | 'Placement' | 'Emergency' | 'General';
  date: string;
  author: string;
  isPinned: boolean;
  department: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AcademicResource {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: number;
  type: 'Notes' | 'PYQ' | 'Lab Manual' | 'E-Book' | 'Syllabus' | 'Cheatsheet';
  author: string;
  uploadedDate: string;
  downloads: number;
  rating: number;
  fileSize: string;
  format: 'PDF' | 'DOCX' | 'ZIP';
  tags: string[];
  previewUrl?: string;
}

export interface FreshersItem {
  id: string;
  category: 'Checklist' | 'Rules' | 'Contacts' | 'Navigation' | 'FAQ';
  title: string;
  description: string;
  details?: string[];
  urgent?: boolean;
  contactNumber?: string;
  location?: string;
}

export interface AICardData {
  type: 'timetable' | 'map' | 'faculty' | 'event' | 'resource' | 'announcement' | 'first_day_plan' | 'club_recommendation';
  data: any;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cards?: AICardData[];
  suggestedActions?: string[];
}

export interface StudentProfile {
  student_id?: number;
  full_name: string;
  college_email: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  address?: string;
  
  register_number: string;
  department: string;
  batch: string;
  year: string;
  semester?: number;
  section?: string;
  
  parent_name?: string;
  parent_occupation?: string;
  family_income?: string;
  first_graduate?: boolean;
  scholarship_required?: boolean;
  
  current_skills?: string[];
  areas_of_interest?: string[];
  campus_interests?: string[];
  
  communication_skills?: boolean;
  teamwork?: boolean;
  leadership?: boolean;
  problem_solving?: boolean;
  confidence_level?: 'Low' | 'Medium' | 'High';
  
  reason_for_department?: string;
  excited_to_learn?: string;
  new_skill_first_year?: string;
  
  profile_completed?: boolean;
  profile_completion_pct?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudentDatabaseStats {
  total_students: number;
  department_wise: Record<string, number>;
  year_wise: Record<string, number>;
  scholarship_requests: number;
  first_graduates: number;
  avg_profile_completion: number;
}
