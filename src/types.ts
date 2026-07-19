/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  semester: number;
  email: string;
  avatar: string;
  attendanceOverall: number;
  cgpa: number;
  totalCredits: number;
  savedResources: string[];
  registeredEvents: string[];
  joinedClubs: string[];
  hostelRoom: string;
  hostelBlock: string;
  appliedPlacements?: string[];
}

export interface ClassSession {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  timeStart: string;
  timeEnd: string;
  room: string;
  day: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  attendance: number;
  ciaMarks: {
    cia1: number;
    cia2: number;
    cia3: number;
    max: number;
  };
  facultyName: string;
  syllabusUnits: string[];
}

export interface FacultyItem {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  cabin: string;
  officeHours: string;
  researchInterests: string[];
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'career';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  image: string;
  spotsLeft: number;
}

export interface ClubItem {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  facultyCoordinator: string;
  studentCoordinator: string;
  membersCount: number;
  upcomingEventsCount: number;
  requirements: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: 'building' | 'facility' | 'office' | 'hostel' | 'lab';
  block: string;
  floor: string;
  roomNo?: string;
  nearestParking: string;
  description: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'syllabus' | 'book' | 'manual';
  subjectCode: string;
  subjectName: string;
  semester: number;
  fileSize: string;
  downloadCount: number;
  addedBy: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'academic' | 'exam' | 'placement' | 'general';
  date: string;
  content: string;
  author: string;
  priority: 'high' | 'normal';
}

export interface PlacementOpportunity {
  id: string;
  company: string;
  role: string;
  ctc: string;
  eligibility: string;
  deadline: string;
  status: 'open' | 'applied' | 'closed';
  type: 'fulltime' | 'internship';
}

export interface BusRoute {
  id: string;
  routeNo: string;
  destination: string;
  stops: string[];
  timings: string[];
  driverName: string;
  driverPhone: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
