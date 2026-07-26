import axios from 'axios';
import { FacultyMember, Building, Announcement, CampusEvent, AcademicResource, CourseSubject, StudentProfile, StudentDatabaseStats } from '../types';

const API_BASE_URL = '/api';

export interface DBDepartment {
  dept_id: number;
  dept_code: string;
  dept_name: string;
  description: string;
  hod_name: string;
  email: string;
  phone: string;
  source_url?: string;
}

export interface DBFaculty {
  faculty_id: number;
  faculty_name: string;
  designation: string;
  dept_id: number;
  qualification: string;
  research_area: string;
  email: string;
  phone: string;
  source_url?: string;
}

export interface DBCourse {
  course_id: number;
  course_name: string;
  degree: string;
  duration: string;
  dept_id: number;
  intake: number;
  programme_type: string;
}

export interface DBAnnouncement {
  announcement_id: number;
  title: string;
  category: string;
  publish_date: string;
  description: string;
  attachment_url: string;
  source_url?: string;
}

export interface DBPlacementDrive {
  drive_id: number;
  company_name: string;
  drive_date: string;
  eligibility: string;
  package_offered: string;
  registration_link: string;
  status: string;
}

export interface DBClub {
  club_id: number;
  club_name: string;
  category: string;
  faculty_coordinator: string;
  description: string;
  activities: string;
  contact_email: string;
}

export interface DBCampusBuilding {
  building_id: number;
  building_name: string;
  building_type: string;
  description: string;
  location: string;
  source_url?: string;
}

/**
 * Fetch raw table data from sse_festa_db SQLite backend server
 */
export async function fetchTableData<T>(tableName: string): Promise<T[]> {
  try {
    const response = await axios.get<T[]>(`${API_BASE_URL}/data?table=${tableName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching table ${tableName} from SQLite backend:`, error);
    return [];
  }
}

export async function fetchTablesList(): Promise<{ name: string; count: number }[]> {
  try {
    const response = await axios.get<{ name: string; count: number }[]>(`${API_BASE_URL}/tables`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tables list:", error);
    return [];
  }
}

export async function createRecord(table: string, data: Record<string, any>): Promise<{ success: boolean; id?: number }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/data`, { table, data });
    return response.data;
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error);
    throw error;
  }
}

export async function updateRecord(table: string, pk: string, id: any, data: Record<string, any>): Promise<{ success: boolean }> {
  try {
    const response = await axios.put(`${API_BASE_URL}/data`, { table, pk, id, data });
    return response.data;
  } catch (error) {
    console.error(`Error updating record ${id} in ${table}:`, error);
    throw error;
  }
}

export async function deleteRecord(table: string, pk: string, id: any): Promise<{ success: boolean }> {
  try {
    const response = await axios.delete(`${API_BASE_URL}/data`, { data: { table, pk, id } });
    return response.data;
  } catch (error) {
    console.error(`Error deleting record ${id} from ${table}:`, error);
    throw error;
  }
}

/**
 * Primary key mapping for each SQLite table
 */
export const TABLE_PRIMARY_KEYS: Record<string, string> = {
  departments: 'dept_id',
  courses: 'course_id',
  faculty: 'faculty_id',
  academic_calendar: 'calendar_id',
  exam_notices: 'notice_id',
  timetables: 'timetable_id',
  announcements: 'announcement_id',
  placement_drives: 'drive_id',
  clubs: 'club_id',
  research_centres: 'centre_id',
  gallery: 'gallery_id',
  campus_buildings: 'building_id',
  contact_information: 'contact_id'
};

/**
 * Service methods mapped to frontend structures
 */
export const apiService = {
  // Fetch Departments
  async getDepartments(): Promise<DBDepartment[]> {
    return fetchTableData<DBDepartment>('departments');
  },

  // Fetch Faculty from SQLite
  async getFaculty(): Promise<FacultyMember[]> {
    const [rawFaculty, depts] = await Promise.all([
      fetchTableData<DBFaculty>('faculty'),
      fetchTableData<DBDepartment>('departments')
    ]);

    const deptMap = new Map<number, string>();
    depts.forEach(d => deptMap.set(d.dept_id, d.dept_name));

    return rawFaculty.map(f => {
      const deptName = deptMap.get(f.dept_id) || 'General Engineering';
      return {
        id: `fac_${f.faculty_id}`,
        name: f.faculty_name,
        designation: f.designation,
        department: deptName,
        email: f.email || `${f.faculty_name.toLowerCase().replace(/[^a-z]/g, '')}@saranathan.ac.in`,
        phone: f.phone || '0431-2473684',
        cabin: `Cabin ${f.faculty_id}, ${deptName} Block`,
        officeHours: 'Mon - Fri (2:00 PM - 4:00 PM)',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
        specialization: f.research_area ? [f.research_area] : ['Engineering & Technology'],
        rating: 4.8,
        researchArea: f.research_area || 'Engineering Research',
        status: 'In Cabin' as const
      };
    });
  },

  // Fetch Announcements from SQLite
  async getAnnouncements(): Promise<Announcement[]> {
    const rawAnnouncements = await fetchTableData<DBAnnouncement>('announcements');
    return rawAnnouncements.map(a => ({
      id: `ann_${a.announcement_id}`,
      title: a.title,
      content: a.description || a.title,
      date: a.publish_date || '2026-07-26',
      category: 'General' as const,
      author: 'College Administration',
      isPinned: true,
      department: 'All Departments',
      priority: 'High' as const
    }));
  },

  // Fetch Courses from SQLite
  async getCourses(): Promise<CourseSubject[]> {
    const [rawCourses, depts] = await Promise.all([
      fetchTableData<DBCourse>('courses'),
      fetchTableData<DBDepartment>('departments')
    ]);

    const deptMap = new Map<number, string>();
    depts.forEach(d => deptMap.set(d.dept_id, d.dept_name));

    return rawCourses.map(c => ({
      id: `crs_${c.course_id}`,
      code: `${c.degree}-${c.course_id}`,
      name: c.course_name,
      credits: 4,
      department: deptMap.get(c.dept_id) || 'Engineering',
      semester: 6,
      facultyName: 'Senior Department Faculty',
      facultyCabin: 'AB1-102',
      totalClasses: 45,
      attendedClasses: 40
    }));
  },

  // Fetch Placement Drives & Events from SQLite
  async getEvents(): Promise<CampusEvent[]> {
    const rawDrives = await fetchTableData<DBPlacementDrive>('placement_drives');
    return rawDrives.map(d => ({
      id: `drive_${d.drive_id}`,
      title: `${d.company_name} - Campus Placement Drive`,
      organizer: 'Training & Placement Cell',
      category: 'Seminar' as const,
      date: d.drive_date || '2026-08-01',
      time: '09:00 AM - 05:00 PM',
      location: 'Auditorium & Placement Block',
      description: `Eligibility: ${d.eligibility}. Package: ${d.package_offered}. Status: ${d.status}`,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      tags: ['Placement', d.company_name, 'Career'],
      registeredCount: 150,
      maxCapacity: 300
    }));
  },

  // Fetch Buildings from SQLite
  async getCampusBuildings(): Promise<DBCampusBuilding[]> {
    return fetchTableData<DBCampusBuilding>('campus_buildings');
  },

  // Student Profile System REST API
  async getStudentProfiles(params?: {
    search?: string;
    department?: string;
    year?: string;
    batch?: string;
    scholarship_required?: string;
    first_graduate?: string;
  }): Promise<StudentProfile[]> {
    try {
      const response = await axios.get<StudentProfile[]>(`${API_BASE_URL}/student/profiles`, { params });
      return response.data;
    } catch (err) {
      console.error("Error fetching student profiles:", err);
      return [];
    }
  },

  async getStudentProfileById(studentId: number): Promise<StudentProfile | null> {
    try {
      const response = await axios.get<StudentProfile>(`${API_BASE_URL}/student/profile/${studentId}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching student profile #${studentId}:`, err);
      return null;
    }
  },

  async createStudentProfile(profile: Partial<StudentProfile>): Promise<{ message: string; student_id: number; profile_completion_pct: number }> {
    const response = await axios.post(`${API_BASE_URL}/student/profile`, profile);
    return response.data;
  },

  async updateStudentProfile(studentId: number, profile: Partial<StudentProfile>): Promise<{ message: string }> {
    const response = await axios.put(`${API_BASE_URL}/student/profile/${studentId}`, profile);
    return response.data;
  },

  async deleteStudentProfile(studentId: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/student/profile/${studentId}`);
    return response.data;
  },

  async getStudentStats(): Promise<StudentDatabaseStats | null> {
    try {
      const response = await axios.get<StudentDatabaseStats>(`${API_BASE_URL}/student/stats`);
      return response.data;
    } catch (err) {
      console.error("Error fetching student database stats:", err);
      return null;
    }
  }
};

export default apiService;
