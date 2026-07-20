/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentProfile,
  ClassSession,
  SubjectItem,
  FacultyItem,
  EventItem,
  ClubItem,
  CampusLocation,
  ResourceItem,
  AnnouncementItem,
  PlacementOpportunity,
  BusRoute
} from '../types';

export const mockStudent: StudentProfile = {
  id: 'st-0982',
  name: 'Devashish Sharma',
  rollNo: '2023CSE0145',
  department: 'Computer Science & Engineering',
  course: 'B.Tech in CSE (AI & ML)',
  semester: 5,
  email: '2023@saranathan.ac.in',
  avatar: '', // Fallback to initials
  attendanceOverall: 84.5,
  cgpa: 8.76,
  totalCredits: 92,
  savedResources: ['res-02', 'res-05'],
  registeredEvents: ['ev-01'],
  joinedClubs: ['cl-01', 'cl-03'],
  hostelBlock: 'Aryabhata Block C',
  hostelRoom: '304-A',
  appliedPlacements: ['pl-02']
};

export const mockClasses: ClassSession[] = [
  { id: 'c-01', subjectCode: 'CS301', subjectName: 'Database Management Systems', facultyName: 'Dr. Ramesh Iyer', timeStart: '09:00 AM', timeEnd: '09:55 AM', room: 'CSE Lab 2, Main Block', day: 'Monday' },
  { id: 'c-02', subjectCode: 'CS302', subjectName: 'Theory of Computation', facultyName: 'Dr. Ananya Sen', timeStart: '10:00 AM', timeEnd: '10:55 AM', room: 'Room 301, Block A', day: 'Monday' },
  { id: 'c-03', subjectCode: 'CS303', subjectName: 'Machine Learning', facultyName: 'Prof. Clara Mendonca', timeStart: '11:15 AM', timeEnd: '12:10 PM', room: 'Seminar Hall, Tech Block', day: 'Monday' },
  { id: 'c-04', subjectCode: 'CS304', subjectName: 'Software Engineering', facultyName: 'Dr. Vivek Nair', timeStart: '01:30 PM', timeEnd: '02:25 PM', room: 'Room 303, Block A', day: 'Monday' },
  
  { id: 'c-05', subjectCode: 'CS303', subjectName: 'Machine Learning', facultyName: 'Prof. Clara Mendonca', timeStart: '09:00 AM', timeEnd: '10:55 AM', room: 'Seminar Hall, Tech Block', day: 'Tuesday' },
  { id: 'c-06', subjectCode: 'CS305', subjectName: 'DBMS Laboratory', facultyName: 'Dr. Ramesh Iyer', timeStart: '11:15 AM', timeEnd: '01:10 PM', room: 'Database Lab, Tech Block', day: 'Tuesday' },
  { id: 'c-07', subjectCode: 'CS306', subjectName: 'Web Technologies', facultyName: 'Prof. Sridhar Murthy', timeStart: '02:30 PM', timeEnd: '03:25 PM', room: 'Room 302, Block A', day: 'Tuesday' },

  { id: 'c-08', subjectCode: 'CS302', subjectName: 'Theory of Computation', facultyName: 'Dr. Ananya Sen', timeStart: '09:00 AM', timeEnd: '09:55 AM', room: 'Room 301, Block A', day: 'Wednesday' },
  { id: 'c-09', subjectCode: 'CS301', subjectName: 'Database Management Systems', facultyName: 'Dr. Ramesh Iyer', timeStart: '10:00 AM', timeEnd: '10:55 AM', room: 'Room 301, Block A', day: 'Wednesday' },
  { id: 'c-10', subjectCode: 'CS304', subjectName: 'Software Engineering', facultyName: 'Dr. Vivek Nair', timeStart: '11:15 AM', timeEnd: '12:10 PM', room: 'Room 303, Block A', day: 'Wednesday' },
  { id: 'c-11', subjectCode: 'CS307', subjectName: 'Web Technologies Lab', facultyName: 'Prof. Sridhar Murthy', timeStart: '01:30 PM', timeEnd: '03:25 PM', room: 'Web Dev Lab, Tech Block', day: 'Wednesday' },

  { id: 'c-12', subjectCode: 'CS303', subjectName: 'Machine Learning', facultyName: 'Prof. Clara Mendonca', timeStart: '09:00 AM', timeEnd: '09:55 AM', room: 'Seminar Hall, Tech Block', day: 'Thursday' },
  { id: 'c-13', subjectCode: 'CS306', subjectName: 'Web Technologies', facultyName: 'Prof. Sridhar Murthy', timeStart: '10:00 AM', timeEnd: '10:55 AM', room: 'Room 302, Block A', day: 'Thursday' },
  { id: 'c-14', subjectCode: 'CS301', subjectName: 'Database Management Systems', facultyName: 'Dr. Ramesh Iyer', timeStart: '11:15 AM', timeEnd: '12:10 PM', room: 'Room 301, Block A', day: 'Thursday' },
  { id: 'c-15', subjectCode: 'CS304', subjectName: 'Software Engineering', facultyName: 'Dr. Vivek Nair', timeStart: '01:30 PM', timeEnd: '02:25 PM', room: 'Room 303, Block A', day: 'Thursday' },

  { id: 'c-16', subjectCode: 'CS302', subjectName: 'Theory of Computation', facultyName: 'Dr. Ananya Sen', timeStart: '09:00 AM', timeEnd: '10:55 AM', room: 'Room 301, Block A', day: 'Friday' },
  { id: 'c-17', subjectCode: 'CS306', subjectName: 'Web Technologies', facultyName: 'Prof. Sridhar Murthy', timeStart: '11:15 AM', timeEnd: '12:10 PM', room: 'Room 302, Block A', day: 'Friday' },
  { id: 'c-18', subjectCode: 'CS308', subjectName: 'Placement Aptitude Training', facultyName: 'Mr. Arvind Saxena', timeStart: '01:30 PM', timeEnd: '03:25 PM', room: 'Auditorium 1, Main Block', day: 'Friday' }
];

export const mockSubjects: SubjectItem[] = [
  {
    id: 's-01',
    code: 'CS301',
    name: 'Database Management Systems',
    credits: 4,
    attendance: 88.2,
    ciaMarks: { cia1: 18, cia2: 17, cia3: 19, max: 20 },
    facultyName: 'Dr. Ramesh Iyer',
    syllabusUnits: [
      'Unit I: Introduction to DBMS & Relational Model (ER Diagrams, Mapping)',
      'Unit II: SQL Queries, Normalization (1NF, 2NF, 3NF, BCNF)',
      'Unit III: Transaction Management and Concurrency Control (ACID properties, Locks)',
      'Unit IV: Database Storage Structures (Indexing, B-Trees, Hashing)',
      'Unit V: NoSQL & Distributed Databases (MongoDB, Cassandra, CAP Theorem)'
    ]
  },
  {
    id: 's-02',
    code: 'CS302',
    name: 'Theory of Computation',
    credits: 4,
    attendance: 76.5,
    ciaMarks: { cia1: 14, cia2: 15, cia3: 13, max: 20 },
    facultyName: 'Dr. Ananya Sen',
    syllabusUnits: [
      'Unit I: Finite Automata (DFA, NFA, Minimization, Regular Expressions)',
      'Unit II: Context-Free Grammars (Derivation Trees, Chomsky Normal Form)',
      'Unit III: Pushdown Automata (Equivalence, Deterministic PDA)',
      'Unit IV: Turing Machines (Design of TM, Halting Problem, Undecidability)',
      'Unit V: Computational Complexity (P, NP, NP-Complete, Cook-Levin Theorem)'
    ]
  },
  {
    id: 's-03',
    code: 'CS303',
    name: 'Machine Learning',
    credits: 4,
    attendance: 85.0,
    ciaMarks: { cia1: 19, cia2: 18, cia3: 20, max: 20 },
    facultyName: 'Prof. Clara Mendonca',
    syllabusUnits: [
      'Unit I: Introduction & Supervised Learning (Linear Regression, KNN, Naive Bayes)',
      'Unit II: Tree Models & Support Vector Machines (Decision Trees, SVM Kernels)',
      'Unit III: Unsupervised Learning & Clustering (K-Means, PCA, Hierarchical)',
      'Unit IV: Deep Learning Foundations (Perceptrons, Feedforward Networks, Backpropagation)',
      'Unit V: Reinforcement Learning & LLMs (Q-learning, Transformer Architectures)'
    ]
  },
  {
    id: 's-04',
    code: 'CS304',
    name: 'Software Engineering',
    credits: 3,
    attendance: 82.1,
    ciaMarks: { cia1: 17, cia2: 16, cia3: 18, max: 20 },
    facultyName: 'Dr. Vivek Nair',
    syllabusUnits: [
      'Unit I: Software Process Models (Waterfall, Agile, Scrum, Devops)',
      'Unit II: Requirements Engineering (SRS Documentation, Use Case Modeling)',
      'Unit III: Software Design Frameworks (UML Diagrams, Architectural Styles)',
      'Unit IV: Testing Methodologies (White Box, Black Box, Unit, Integration)',
      'Unit V: Software Project Management (COCOMO Model, Risk Management)'
    ]
  },
  {
    id: 's-05',
    code: 'CS306',
    name: 'Web Technologies',
    credits: 3,
    attendance: 90.4,
    ciaMarks: { cia1: 20, cia2: 19, cia3: 18, max: 20 },
    facultyName: 'Prof. Sridhar Murthy',
    syllabusUnits: [
      'Unit I: Internet Baselines & Styling (HTML5, CSS3, Tailwind CSS)',
      'Unit II: Client-Side Scripting (ES6+ Javascript, DOM Manipulation, Async/Await)',
      'Unit III: React Essentials (Hooks, Virtual DOM, Components, Props/State)',
      'Unit IV: Backend Development (Node.js, Express, Middleware, REST APIs)',
      'Unit V: Full-stack Integration & Security (JWT, CORS, Deployment on Cloud)'
    ]
  }
];

export const mockFaculty: FacultyItem[] = [
  {
    id: 'fac-01',
    name: 'Dr. Ananya Sen',
    designation: 'Professor & Head',
    department: 'Computer Science & Engineering',
    email: 'ananya.sen@university.edu',
    cabin: 'Room 401, Main Block, 4th Floor',
    officeHours: 'Monday, Wednesday: 02:00 PM - 04:00 PM',
    researchInterests: ['Automata Theory', 'Natural Language Processing', 'Compiler Design'],
    avatar: 'AS'
  },
  {
    id: 'fac-02',
    name: 'Dr. Ramesh Iyer',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'ramesh.iyer@university.edu',
    cabin: 'Room 412, Tech Block, 4th Floor',
    officeHours: 'Tuesday, Thursday: 01:00 PM - 03:00 PM',
    researchInterests: ['Distributed Databases', 'Big Data Analytics', 'Blockchain Architecture'],
    avatar: 'RI'
  },
  {
    id: 'fac-03',
    name: 'Prof. Clara Mendonca',
    designation: 'Assistant Professor (Senior)',
    department: 'Computer Science & Engineering',
    email: 'clara.mendonca@university.edu',
    cabin: 'Room 203, Seminar Hall Wing, Tech Block',
    officeHours: 'Daily: 11:00 AM - 12:00 PM',
    researchInterests: ['Computer Vision', 'Deep Learning Model Compression', 'Surgical AI'],
    avatar: 'CM'
  },
  {
    id: 'fac-04',
    name: 'Dr. Vivek Nair',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'vivek.nair@university.edu',
    cabin: 'Room 415, Tech Block, 4th Floor',
    officeHours: 'Friday: 09:00 AM - 12:00 PM',
    researchInterests: ['Agile Process Optimisation', 'Software Testing Automation', 'Microservice Security'],
    avatar: 'VN'
  },
  {
    id: 'fac-05',
    name: 'Prof. Sridhar Murthy',
    designation: 'Assistant Professor',
    department: 'Information Technology',
    email: 'sridhar.murthy@university.edu',
    cabin: 'Room 209, Main Block, 2nd Floor',
    officeHours: 'Monday, Friday: 03:00 PM - 05:00 PM',
    researchInterests: ['Web Application Frameworks', 'Realtime Systems', 'PWA Performance'],
    avatar: 'SM'
  }
];

export const mockEvents: EventItem[] = [
  {
    id: 'ev-01',
    title: 'CodeRed National Hackathon 2026',
    category: 'technical',
    date: 'August 14-15, 2026',
    time: '36 Hours continuous coding',
    venue: 'Convention Center, Main Block',
    organizer: 'University Coding Club',
    description: 'The premium annual national-level hackathon. Put your brainstorming hats on and build applications addressing global climate, institutional logistics, and smart healthcare. Grand prize pool of $5,000.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    spotsLeft: 42
  },
  {
    id: 'ev-02',
    title: 'Symposium on Modern Deep Learning',
    category: 'academic',
    date: 'July 28, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, Technology Block',
    organizer: 'CSE & AI/ML Department',
    description: 'Join industry veterans from Google Brain, DeepMind, and Meta AI discussing the next frontier in AI, Transformer alternatives (Mamba, Liquid Networks), and Edge Computing integration.',
    image: 'https://images.unsplash.com/photo-1591115765373-520976827f3b?auto=format&fit=crop&q=80&w=800',
    spotsLeft: 120
  },
  {
    id: 'ev-03',
    title: 'Starlight Cultural Gala Night',
    category: 'cultural',
    date: 'August 08, 2026',
    time: '06:00 PM onwards',
    venue: 'University Open Auditorium',
    organizer: 'Arts & Cultural Council',
    description: 'An enchanting evening showcasing spectacular classical dance, rock band competitions, vocal harmonies, and interactive theatre performances. Food stalls, campus lights, and pure celebration!',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    spotsLeft: 300
  },
  {
    id: 'ev-04',
    title: 'Mock Placement Drive & Resume Clinic',
    category: 'career',
    date: 'July 25, 2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Placement Office, Block B',
    organizer: 'Career Development Cell',
    description: 'Get your resume audited by corporate recruiters. Attend mock 1-on-1 technical and HR interviews, aptitude tests, and feedback sessions to conquer your upcoming placement season with confidence.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
    spotsLeft: 15
  }
];

export const mockClubs: ClubItem[] = [
  {
    id: 'cl-01',
    name: 'University Coding Club',
    category: 'Technical / Core Coding',
    description: 'The elite community for competitive programmers and open-source developers. Regular practice contests, technical workshops, global hackathons coaching, and contribution sessions.',
    logo: '💻',
    facultyCoordinator: 'Dr. Ramesh Iyer',
    studentCoordinator: 'Aditya Sen (CSE, Final Year)',
    membersCount: 412,
    upcomingEventsCount: 2,
    requirements: 'Basic understanding of one programming language (C++, Java, Python, or TS).'
  },
  {
    id: 'cl-02',
    name: 'Nexus Robotics Club',
    category: 'Technical / Engineering',
    description: 'Pioneering custom robotics architectures, drone designs, microcontroller automation, and Internet of Things (IoT) prototype blueprints.',
    logo: '🤖',
    facultyCoordinator: 'Dr. Vivek Nair',
    studentCoordinator: 'Nisha Pillai (ECE, 3rd Year)',
    membersCount: 245,
    upcomingEventsCount: 1,
    requirements: 'Interest in hardware-software interfaces, microcontrollers, or ROS (Robot OS).'
  },
  {
    id: 'cl-03',
    name: 'Focus Photography Club',
    category: 'Creative / Arts',
    description: 'Framing stories through lenses. Capture campus life, participate in photowalks, master DSLR controls, Adobe Lightroom curation, and secure entries to national photography awards.',
    logo: '📷',
    facultyCoordinator: 'Prof. Clara Mendonca',
    studentCoordinator: 'Rohit Verma (IT, 3rd Year)',
    membersCount: 180,
    upcomingEventsCount: 1,
    requirements: 'Any camera (even a basic smartphone with passion for composition).'
  }
];

export const mockLocations: CampusLocation[] = [
  { id: 'loc-01', name: 'Central Library', type: 'facility', block: 'Main Block', floor: 'Ground & 1st Floor', nearestParking: 'Main Gate Parking A', description: 'Housing over 100,000 physical volumes, research repositories, and interactive computer cabins. Fully air-conditioned silent study zones.' },
  { id: 'loc-02', name: 'Database Management Lab', type: 'lab', block: 'Technology Block', floor: '4th Floor', roomNo: 'T-410', nearestParking: 'Rear Block Parking B', description: 'Core computer science laboratory fully equipped with Oracle, PostgreSQL, and Mongo servers. Used for CSE core lectures and examinations.' },
  { id: 'loc-03', name: 'Dean Office of Student Affairs', type: 'office', block: 'Administrative Block A', floor: '1st Floor', roomNo: 'A-102', nearestParking: 'Main Gate Parking A', description: 'All student verification records, scholarship processes, physical certificates collection, and non-academic permissions clearances.' },
  { id: 'loc-04', name: 'University Medical Centre', type: 'facility', block: 'Emergency Wing', floor: 'Ground Floor', nearestParking: 'Medical Ample bay', description: 'Fully operational 24/7 medical room with full-time resident physician and qualified nurse practitioners. Fully stocked ambulance on standby.' },
  { id: 'loc-05', name: 'Aryabhata Hostels Block C', type: 'hostel', block: 'Hostel Sector B', floor: '5 Storeys', nearestParking: 'Hostel Compound Parking', description: 'Boys hostel with modern amenities, study rooms, gym facility, and attached cafeteria. House of freshers and 2nd years.' }
];
export const mockResources: ResourceItem[] = [];

export const mockAnnouncements: AnnouncementItem[] = [
  { id: 'ann-01', title: 'CIA-2 Internal Assessment Schedule & Syllabus Allocation', category: 'academic', date: 'July 18, 2026', content: 'The CIA-2 Assessments will commence from August 3, 2026. Hall tickets, seating arrangements, and exact timings will be published on the portal shortly. The syllabus coverage includes everything up to Unit III of respectively allocated subject models.', author: 'Prof. J. Mathew (Dean Academics)', priority: 'high' },
  { id: 'ann-02', title: 'Placement Registration Open for Adobe Systems Software Engineer Role', category: 'placement', date: 'July 16, 2026', content: 'Adobe Systems has opened registrations for the profile of Member of Technical Staff (MTS). Eligibility: B.Tech CSE/IT, CGPA >= 8.5, No active backlogs. CTC: 42.5 LPA. Register via Placement wing before July 22, 11:59 PM.', author: 'Mr. Vivek Chhabra (Placement Director)', priority: 'high' },
  { id: 'ann-03', title: 'Hostel Maintenance Shutdown & Cafeteria Timings Updated', category: 'general', date: 'July 15, 2026', content: 'Due to routine maintenance of block electrical panels, power outage is expected in Blocks C & D on Sunday, July 20 between 09:00 AM - 01:00 PM. Lunch will be hosted at the main dining hall instead.', author: 'Col. K.S. Rathore (Hostel Warden)', priority: 'normal' }
];

export const mockPlacements: PlacementOpportunity[] = [
  { id: 'pl-01', company: 'Google India', role: 'Software Engineer (L3)', ctc: '55.4 LPA', eligibility: 'CGPA >= 8.5, B.Tech CSE/IT/ECE only', deadline: 'July 28, 2026', status: 'open', type: 'fulltime' },
  { id: 'pl-02', company: 'Adobe Systems', role: 'Member of Technical Staff', ctc: '42.5 LPA', eligibility: 'CGPA >= 8.5, CSE/IT', deadline: 'July 22, 2026', status: 'open', type: 'fulltime' },
  { id: 'pl-03', company: 'Zoho Corporation', role: 'Product Developer Intern', ctc: '50,000 / month (stipend)', eligibility: 'Open to all branches, No CGPA criteria', deadline: 'August 05, 2026', status: 'open', type: 'internship' },
  { id: 'pl-04', company: 'Microsoft India', role: 'Cloud Engineer Specialist', ctc: '38.0 LPA', eligibility: 'CGPA >= 8.0, B.Tech/M.Tech', deadline: 'July 12, 2026', status: 'closed', type: 'fulltime' }
];

export const mockBuses: BusRoute[] = [
  { id: 'bus-01', routeNo: 'Route 14', destination: 'City Center / Tech Park', stops: ['Campus Main Gate', 'Vasant Kunj Crossing', 'Noida Sec 62 Hub', 'City Center Metro Station', 'Wave Mall Crossing'], timings: ['08:15 AM (Arrival)', '05:40 PM (Departure)'], driverName: 'Sohan Singh', driverPhone: '+91 98765 43210' },
  { id: 'bus-02', routeNo: 'Route 22', destination: 'Rajouri Gardens Metro', stops: ['Campus Main Gate', 'Janakpuri Crossing', 'Hari Nagar Depot', 'Rajouri Gardens Complex'], timings: ['08:00 AM (Arrival)', '05:45 PM (Departure)'], driverName: 'Manpreet Singh', driverPhone: '+91 99887 76655' }
];

export const hostelMenu = {
  Monday: { breakfast: 'Idli, Sambar, Coconut Chutney, Tea/Coffee', lunch: 'Roti, Dal Tadka, Seasonal Veg, Rice, Curd', snack: 'Samosa, Mint Chutney, Tea', dinner: 'Roti, Paneer Butter Masala, Jeera Rice, Custard' },
  Tuesday: { breakfast: 'Aloo Paratha, Curd, Butter, Pickle, Milk', lunch: 'Roti, Rajma, Dry Aloo Jeera, Rice, Salad', snack: 'Veg Cutlet, Tomato Ketchup, Tea', dinner: 'Roti, Chicken Curry (or Kadai Mushroom), Pulao, Ice Cream' },
  Wednesday: { breakfast: 'Poha, Sev, Jalebi, Tea/Coffee', lunch: 'Roti, Chana Masala, Veg Pulao, Curd, Salad', snack: 'Bread Pakoda, Tea', dinner: 'Roti, Egg Curry (or Mixed Veg Kofta), Rice, Gulab Jamun' },
  Thursday: { breakfast: 'Uttapam, Sambar, Chutney, Tea/Coffee', lunch: 'Roti, Dal Makhani, Bhindi Masala, Rice, Curd', snack: 'Onion Pakoda, Tea', dinner: 'Roti, Kadai Paneer, Peas Pulao, Fruit Salad' },
  Friday: { breakfast: 'Chole Bhature, Pickle, Tea/Coffee', lunch: 'Roti, Kadhi Pakoda, Aloo Gobhi, Rice, Papad', snack: 'Dhokla, Green Chutney, Tea', dinner: 'Roti, Chicken Biryani (or Paneer Biryani), Raita, Kheer' }
};

// Extremely smart QA mock answering triggers to simulate real Gemini models.
// If any matching substring exists in user input, return this answer.
export const getAISmartResponse = (userInput: string): string => {
  const query = userInput.toLowerCase();

  if (query.includes('block a') || query.includes('where is block a')) {
    return `### **Administrative Block A Navigation**\n\n**Block A** is located near the **Main Campus Entrance**.\n\n*   **Ground Floor**: Main Accounts Office, Fee counter, Admission Registration.\n*   **1st Floor**: Dean Office of Student Affairs (Room A-102), Dean of Academics Office.\n*   **2nd Floor**: Examination Cell, Grade Sheet Registry, and Board Room.\n\n*💡 Nearest Parking:* **Main Gate Parking Lot A**. Walk past the central fountain to enter Block A directly.`;
  }
  
  if (query.includes('block c') || query.includes('hostel block c') || query.includes('aryabhata')) {
    return `### **Aryabhata Hostels Block C Navigation**\n\n**Aryabhata Block C** is situated in **Hostel Sector B** (North Wing of Campus).\n\n*   It is a 5-storey complex housing mostly Freshers and Sophomore students.\n*   **Warden Cabin**: Located at Room 101, Ground Floor.\n*   **Facilities**: In-house Gym (Ground Floor), Silent Study Lounge (3rd Floor), Cafeteria attached to back courtyard.\n\n*💡 Directions:* From the Main Canteen, take the northern walkway, pass the Football ground, and the block is directly behind Block B.`;
  }

  if (query.includes('timetable') || query.includes('class today') || query.includes('my classes')) {
    return `### **Today's CSE (Sem 5) Academic Timetable**\n\nHere is your allocated schedule for today:\n\n1.  **09:00 AM - 09:55 AM** | Database Management Systems (*CS301*) - Dr. Ramesh Iyer (CSE Lab 2, Main Block)\n2.  **10:00 AM - 10:55 AM** | Theory of Computation (*CS302*) - Dr. Ananya Sen (Room 301, Block A)\n3.  **11:15 AM - 12:10 PM** | Machine Learning (*CS303*) - Prof. Clara Mendonca (Seminar Hall, Tech Block)\n4.  **01:30 PM - 02:25 PM** | Software Engineering (*CS304*) - Dr. Vivek Nair (Room 303, Block A)\n\n*🚀 Quick tip: You have a 20-minute tea break between Theory of Computation and Machine Learning (10:55 AM - 11:15 AM).*`;
  }

  if (query.includes('machine learning') || query.includes('clara') || query.includes('ml faculty')) {
    return `### **Machine Learning Faculty Profile**\n\n**Prof. Clara Mendonca** teaches Machine Learning (CS303) for Semester 5.\n\n*   **Designation**: Assistant Professor (Senior Grade)\n*   **Cabin Location**: Room 203, Seminar Hall Wing, Technology Block\n*   **Office Consultation Hours**: Daily 11:00 AM - 12:00 PM\n*   **Research Areas**: Computer Vision, Model Quantisation, Healthcare Diagnostics AI\n*   **Email**: \`clara.mendonca@university.edu\`\n\n*💡 Actionable Tip:* You can ask her about the upcoming CIA-2 project topics during her office consultation hour tomorrow.`;
  }

  if (query.includes('exam') || query.includes('cia-2') || query.includes('assessment')) {
    return `### **CIA-2 Internal Assessment Guidelines**\n\nAccording to the Dean of Academics circular dated **July 18, 2026**:\n\n*   **Date**: Commencing from **August 3, 2026**.\n*   **Format**: Descriptive 50-marks paper (Units I to III).\n*   **Weightage**: Holds a critical 20% weightage in your overall Internal Marks compilation.\n*   **Seating Plans**: Available outside the Exam Cell (2nd Floor, Block A) on July 30.\n\n*📚 Study materials: Notes and PYQs for Database Systems, TOC, and Machine Learning are fully uploaded in the **Resource Center**.*`;
  }

  if (query.includes('club') || query.includes('nexus') || query.includes('coding club')) {
    return `### **University Recommended Student Clubs**\n\nBased on your CSE branch, here are the elite clubs you should join:\n\n1.  **University Coding Club 💻**:\n    *   *Lead*: Aditya Sen (Final Year)\n    *   *Focus*: Competitive programming (LeetCode, Codeforces), open-source contributions, and Hackathon team building.\n    *   *Next Event*: CodeRed 36-Hr Hackathon (Aug 14).\n2.  **Nexus Robotics Club 🤖**:\n    *   *Lead*: Nisha Pillai (3rd Year)\n    *   *Focus*: Embedded IoT, UAV design, microcontrollers scripting.\n\n*💡 Joining Action:* Click the 'Clubs' sidebar option and hit the **"Join Club"** button to receive automatic calendar alerts.`;
  }

  if (query.includes('food') || query.includes('mess') || query.includes('menu') || query.includes('dinner')) {
    return `### **Today's Hostels Block Mess Menu**\n\nHere is what is cooking today at the Main Dining Hall:\n\n*   **Breakfast**: Idli, steaming hot Sambar, fresh Coconut Chutney, Tea and Coffee.\n*   **Lunch**: Butter Roti, Dal Tadka, Seasonal Mix Veg Curry, Basmati Rice, fresh thick Curd, Salad.\n*   **Evening Snack**: Crispy Potato Samosas, Mint and Tamarind Chutney, masala Tea.\n*   **Dinner**: Tandoori Roti, rich Paneer Butter Masala, aromatic Jeera Rice, and Sweet Custard.\n\n*💡 Timings:* Dinner is served between **07:30 PM - 09:30 PM**. Ensure your biometric card is kept handy.`;
  }

  if (query.includes('placement') || query.includes('adobe') || query.includes('google')) {
    return `### **Upcoming Core CSE Placement Drives**\n\nActive opportunities for 2026 graduating batch CSE/IT:\n\n1.  **Adobe Systems** (Member of Technical Staff)\n    *   *CTC Package*: **42.5 LPA**\n    *   *Registration Deadline*: **July 22, 2026 (11:59 PM)**\n    *   *Requirement*: CGPA >= 8.5, No active backlogs.\n2.  **Google India** (Software Engineer L3)\n    *   *CTC Package*: **55.4 LPA**\n    *   *Deadline*: **July 28, 2026**\n\n*🚀 Preparation Tip:* Go to the **Placement Hub** to access audited Google/Adobe resume templates and curated system design interview questions.`;
  }

  if (query.includes('notes') || query.includes('download') || query.includes('pdf')) {
    return `### **Available Study Resources - CSE Sem 5**\n\nI found high-quality curated study materials in the **Resource Center**:\n\n*   **Database Management Systems**: *Relational Algebra Master Notes* by Dr. Ramesh Iyer (4.8 MB PDF).\n*   **Theory of Computation**: *CNF & Grammar Conversion Guide* by Dr. Ananya Sen (1.2 MB PDF).\n*   **Machine Learning**: *Lab Manual - Compiled Jupyter Notebooks* (8.1 MB Zip).\n\n*📥 Action:* Go to the **Resources** panel in the sidebar, find the resource, and click the **Download** button.`;
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('who are you')) {
    return `### **Welcome to CampusPilot AI! 🏛️**\n\nHello Devashish! I am your institutional assistant. I can navigate campus, schedule study planners, query timetable sessions, recommend clubs, audit placements, and download syllabus resources.\n\n**Here are a few things you can ask me directly:**\n*   *"Where is Block A administrative wing?"*\n*   *"What is on the hostel mess menu today?"*\n*   *"Show my academic schedule for today."*\n*   *"Find placement drives ending soon."*`;
  }

  // Fallback smart response synthesis using fuzzy context
  return `### **Campus Pilot Assistant Consultation**\n\nI have cross-referenced the university knowledge vaults for your inquiry regarding: **"${userInput}"**.\n\n*   **User Identity**: Devashish Sharma, Computer Science & Engineering, Semester 5.\n*   **Campus Status**: Active session (Mon-Fri 09:00 AM - 04:30 PM).\n*   **Academic Records**: Clear status, no pending dues, 84.5% active attendance.\n\n*💡 Action recommended:* You can find full departmental and administrative details by visiting the specific modules (Academics, Faculty, Campus Map, or Resources) in the sidebar. Let me know if you would like me to retrieve specific room locations, faculty consultation timings, or exam papers!`;
};

export async function syncWithBackend(studentId: string = 'st-0982'): Promise<void> {
  try {
    const headers = studentId ? { 'X-Student-Id': studentId } : {};

    const profileRes = await fetch('/api/profile', { headers });
    if (profileRes.ok) {
      const studentData = await profileRes.json();
      Object.assign(mockStudent, studentData);
    }

    const classesRes = await fetch('/api/academics/timetable', { headers });
    if (classesRes.ok) {
      const classesData = await classesRes.json();
      mockClasses.length = 0;
      mockClasses.push(...classesData);
    }

    const subjectsRes = await fetch('/api/academics/subjects', { headers });
    if (subjectsRes.ok) {
      const subjectsData = await subjectsRes.json();
      mockSubjects.length = 0;
      mockSubjects.push(...subjectsData);
    }

    const facultyRes = await fetch('/api/faculty');
    if (facultyRes.ok) {
      const facultyData = await facultyRes.json();
      mockFaculty.length = 0;
      mockFaculty.push(...facultyData);
    }

    const eventsRes = await fetch('/api/events');
    if (eventsRes.ok) {
      const eventsData = await eventsRes.json();
      mockEvents.length = 0;
      mockEvents.push(...eventsData);
    }

    const clubsRes = await fetch('/api/clubs');
    if (clubsRes.ok) {
      const clubsData = await clubsRes.json();
      mockClubs.length = 0;
      mockClubs.push(...clubsData);
    }

    const locationsRes = await fetch('/api/locations');
    if (locationsRes.ok) {
      const locationsData = await locationsRes.json();
      mockLocations.length = 0;
      mockLocations.push(...locationsData);
    }

    const resourcesRes = await fetch('/api/resources');
    if (resourcesRes.ok) {
      const resourcesData = await resourcesRes.json();
      mockResources.length = 0;
      mockResources.push(...resourcesData);
    }

    const announcementsRes = await fetch('/api/announcements');
    if (announcementsRes.ok) {
      const announcementsData = await announcementsRes.json();
      mockAnnouncements.length = 0;
      mockAnnouncements.push(...announcementsData);
    }

    const placementsRes = await fetch('/api/placements');
    if (placementsRes.ok) {
      const placementsData = await placementsRes.json();
      mockPlacements.length = 0;
      mockPlacements.push(...placementsData);
    }

    const busesRes = await fetch('/api/transport/buses');
    if (busesRes.ok) {
      const busesData = await busesRes.json();
      mockBuses.length = 0;
      mockBuses.push(...busesData);
    }

    const menuRes = await fetch('/api/hostel/menu');
    if (menuRes.ok) {
      const menuData = await menuRes.json();
      Object.assign(hostelMenu, menuData);
    }
  } catch (error) {
    console.error("Failed to sync mockData with Flask backend:", error);
  }
}
