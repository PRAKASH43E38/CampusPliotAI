/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Compass, 
  Navigation, 
  CheckCircle2, 
  Search, 
  Plus, 
  Minus, 
  Maximize, 
  Minimize, 
  RefreshCw, 
  X, 
  MapPin
} from 'lucide-react';

interface CampusLocation {
  id: string;
  name: string;
  category: 'academic' | 'department' | 'facility' | 'sports';
  block: string;
  floor: string;
  roomNo: string;
  description: string;
  photoUrl: string;
  nearbyIds: string[];
  latOffset: number;
  lngOffset: number;
  lat?: number;
  lng?: number;
  parentBlockId?: string;
  isKmlSource?: boolean;
}

interface CampusMapViewProps {
  isDark?: boolean;
}

// ----------------------------------------------------
// DEFAULT GEOGRAPHIC ANCHOR (Saranathan College Library)
// ----------------------------------------------------
const DEFAULT_CENTER: [number, number] = [10.7572792, 78.65132299999999];

// Bounding box of the campus screenshot image, calibrated to match the portrait 516 x 726 aspect ratio.
// This prevents squashing distortion and displays the map in its exact native flat 2D top view.
const OVERLAY_BOUNDS: L.LatLngBoundsExpression = [
  [10.753415, 78.647544], // Southwest corner
  [10.760327, 78.652544]  // Northeast corner
];

// ----------------------------------------------------
// PREDEFINED LOCATIONS WITH OFFSETS CALIBRATED TO THE SCREENSHOT
// ----------------------------------------------------
const BASE_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-library',
    name: 'Saranathan College Library',
    category: 'facility',
    block: 'Library Block',
    floor: 'Ground & 1st Floor',
    roomNo: 'L-100',
    description: 'Central library housing over 100,000 physical volumes, digital resource terminals, research archives, and quiet reading zones.',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block', 'loc-js-block'],
    latOffset: 0.0,
    lngOffset: 0.0,
  },
  {
    id: 'loc-main-gate',
    name: 'Saranathan College Main Gate',
    category: 'facility',
    block: 'Security Wing',
    floor: 'Ground Floor',
    roomNo: 'Gate 1',
    description: 'Primary entry point to Saranathan College of Engineering from the Trichy-Madurai NH 45B Main Road. Fully monitored by 24/7 security services.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-parking', 'loc-bus-stop'],
    latOffset: -0.00148,
    lngOffset: -0.0023,
  },
  {
    id: 'loc-ks-block',
    name: 'Secretary K. Santhanam Block (KS Block)',
    category: 'academic',
    block: 'KS Block',
    floor: '3 Floors (G, 1, 2)',
    roomNo: 'KS-100',
    description: 'The main academic building on campus. Spans over 77,000 sq ft and houses Computer Science (CSE), Electronics (ECE), and Electrical (EEE) departments.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-library', 'loc-mba-block', 'loc-auditorium'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
  },
  {
    id: 'loc-js-block',
    name: 'JS Block (Civil Engineering)',
    category: 'academic',
    block: 'JS Block',
    floor: '2 Floors',
    roomNo: 'JS-100',
    description: 'Houses the Civil Engineering lecture wings, laboratories, HOD chambers, and the Civil Seminar Hall.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-library', 'loc-canteen'],
    latOffset: -0.00048,
    lngOffset: 0.00048,
  },
  {
    id: 'loc-bd-block',
    name: 'BD Block (IT & ICE)',
    category: 'academic',
    block: 'BD Block',
    floor: '2 Floors',
    roomNo: 'BD-100',
    description: 'Academic block dedicated to Information Technology and Instrumentation & Control Engineering. Houses high-speed computer networks and control loops labs.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-library', 'loc-admin', 'loc-medical'],
    latOffset: -0.00008,
    lngOffset: -0.0008,
  },
  {
    id: 'loc-me-block',
    name: 'Mechanical Block (ME Block)',
    category: 'academic',
    block: 'ME Block',
    floor: 'Ground & 1st Floor',
    roomNo: 'ME-100',
    description: 'Mechanical engineering wing. Connects to the massive 21,600 sq ft mechanical workshops, carpentry bay, smithy, and thermal engineering laboratories.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-rv-block', 'loc-sports-ground'],
    latOffset: 0.00042,
    lngOffset: -0.0011,
  },
  {
    id: 'loc-rv-block',
    name: 'RV Block (First Year Block)',
    category: 'academic',
    block: 'RV Block',
    floor: '2 Floors',
    roomNo: 'RV-100',
    description: 'Houses Basic Science and Humanities classrooms, English language laboratories, and physics/chemistry workspace for first-year students.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-me-block', 'loc-admin'],
    latOffset: -0.00068,
    lngOffset: -0.0008,
  },
  {
    id: 'loc-mba-block',
    name: 'Management Studies Block (MBA)',
    category: 'academic',
    block: 'MBA Block',
    floor: '2 Floors',
    roomNo: 'MBA-100',
    description: 'Dedicated building for the PG Management Studies (MBA) department. Equipped with modern presentation rooms and corporate business seminar chambers.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block'],
    latOffset: 0.00002,
    lngOffset: 0.00068,
  },
  {
    id: 'loc-admin',
    name: 'Administrative Block (Principal Office)',
    category: 'facility',
    block: 'Administrative Block',
    floor: 'Ground & 1st Floor',
    roomNo: 'ADM-100',
    description: 'Main Administrative headquarters. Houses the Principal Consulting Office, Registrar desks, accounts office, placement wing, and examination cell.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-parking', 'loc-bd-block', 'loc-medical'],
    latOffset: -0.00078,
    lngOffset: -0.0015,
  },
  {
    id: 'loc-boys-hostel',
    name: 'Saranathan Boys Hostel',
    category: 'facility',
    block: 'Hostel Compound',
    floor: '3 Floors',
    roomNo: 'Hostel Office',
    description: 'A 3-storied Boys Hostel housing spacious residential units, mineral water RO facility, study halls, and associated recreation lounge.',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-canteen', 'loc-indoor-stadium'],
    latOffset: -0.00128,
    lngOffset: -0.0003,
  },
  {
    id: 'loc-canteen',
    name: 'Main Campus Canteen',
    category: 'facility',
    block: 'Canteen Pavilion',
    floor: 'Ground Floor',
    roomNo: 'Canteen',
    description: 'Campus cafeteria offering hot South Indian meals, snacks, fresh juices, and dynamic food counters in a large, hygienic seating space.',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-js-block', 'loc-boys-hostel', 'loc-sports-ground'],
    latOffset: -0.00078,
    lngOffset: -0.0005,
  },
  {
    id: 'loc-sports-ground',
    name: 'E - B Cricket ground',
    category: 'sports',
    block: 'Sports Complex',
    floor: 'Ground Level',
    roomNo: 'Ground',
    description: 'The primary outdoor athletic arena featuring a cricket pitch, football turf, and surrounding running track layout.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-me-block', 'loc-indoor-stadium', 'loc-canteen'],
    latOffset: -0.00018,
    lngOffset: -0.0020,
  },
  {
    id: 'loc-indoor-stadium',
    name: 'Saranathan Indoor Sports Stadium',
    category: 'sports',
    block: 'Sports Complex',
    floor: 'Ground Floor',
    roomNo: 'Indoor Stadium',
    description: 'Polished wooden basketball court, standard badminton arena, table tennis setups, and board game training cabinets.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-sports-ground', 'loc-boys-hostel'],
    latOffset: -0.00088,
    lngOffset: -0.0018,
  },
  {
    id: 'loc-parking',
    name: 'Main Campus Vehicle Parking',
    category: 'facility',
    block: 'Parking Area',
    floor: 'Ground Level',
    roomNo: 'Parking',
    description: 'Secured concrete parking spaces dedicated for faculty vehicles, student two-wheelers, and visitor vans, situated next to the main gateway.',
    photoUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-main-gate', 'loc-admin'],
    latOffset: -0.00128,
    lngOffset: -0.0020,
  },
  {
    id: 'loc-bus-stop',
    name: 'Highway College Bus Stop',
    category: 'facility',
    block: 'Security Zone',
    floor: 'Ground Level',
    roomNo: 'Bus Bay',
    description: 'NH-45B highway pick-up point situated directly in front of the main entry gateway. Serves local Trichy city buses.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-main-gate'],
    latOffset: -0.00168,
    lngOffset: -0.0026,
  },
  {
    id: 'loc-medical',
    name: 'Campus Medical and First-Aid Room',
    category: 'facility',
    block: 'BD Block Wing',
    floor: 'Ground Floor',
    roomNo: 'MED-101',
    description: 'Well-stocked medical center with a full-time resident nurse practitioner, emergency response beds, medical cabinets, and standby vehicle.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-admin', 'loc-bd-block'],
    latOffset: -0.00048,
    lngOffset: -0.0011,
  },

  // SUB LOCATIONS (Rooms & Offices mapped to building blocks)
  {
    id: 'loc-principal-office',
    name: 'Principal Consulting Office',
    category: 'facility',
    block: 'Administrative Block',
    floor: '1st Floor',
    roomNo: 'ADM-201',
    description: 'Official office of the Principal of Saranathan College of Engineering. Located in Admin Block on the first floor.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-placement-cell', 'loc-exam-cell'],
    latOffset: -0.00078,
    lngOffset: -0.0015,
    parentBlockId: 'loc-admin',
  },
  {
    id: 'loc-placement-cell',
    name: 'Training & Placement Cell',
    category: 'facility',
    block: 'Administrative Block',
    floor: 'Ground Floor',
    roomNo: 'ADM-105',
    description: 'Coordinates corporate drives, recruiters visits, soft-skills training seminars, and mock interview setups.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-principal-office', 'loc-exam-cell'],
    latOffset: -0.00078,
    lngOffset: -0.0015,
    parentBlockId: 'loc-admin',
  },
  {
    id: 'loc-exam-cell',
    name: 'Controller of Examinations Cell',
    category: 'facility',
    block: 'Administrative Block',
    floor: 'Ground Floor',
    roomNo: 'ADM-102',
    description: 'Secured office managing semester evaluation programs, degree dispatch, student hall tickets, and Anna University registration logs.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-principal-office', 'loc-placement-cell'],
    latOffset: -0.00078,
    lngOffset: -0.0015,
    parentBlockId: 'loc-admin',
  },
  {
    id: 'loc-cse-hod',
    name: 'CSE Department HOD Office',
    category: 'department',
    block: 'KS Block',
    floor: '1st Floor',
    roomNo: 'KS-202',
    description: 'Office cabin of the Head of the Computer Science and Engineering Department.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-cse-labs', 'loc-ece-hod'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-ece-hod',
    name: 'ECE Department HOD Office',
    category: 'department',
    block: 'KS Block',
    floor: '2nd Floor',
    roomNo: 'KS-302',
    description: 'Office cabin of the Head of the Electronics and Communication Engineering Department.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-cse-hod', 'loc-eee-hod'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-eee-hod',
    name: 'EEE Department HOD Office',
    category: 'department',
    block: 'KS Block',
    floor: '1st Floor',
    roomNo: 'KS-205',
    description: 'Office cabin of the Head of the Electrical and Electronics Engineering Department.',
    photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-cse-hod', 'loc-ece-hod'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-cse-labs',
    name: 'Computer Laboratories (CSE Core)',
    category: 'department',
    block: 'KS Block',
    floor: '1st Floor',
    roomNo: 'KS-210',
    description: 'Equipped with over 120 programming terminals and high-speed network routes. Hosts data structures and compiler design laboratories.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-cse-hod', 'loc-library'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-auditorium',
    name: 'Main Academic Auditorium',
    category: 'facility',
    block: 'KS Block',
    floor: 'Ground Floor',
    roomNo: 'Auditorium',
    description: 'A 500-seat academic hall used for general student orientation, technical symposiums, and cultural events.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block', 'loc-library'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-civil-seminar',
    name: 'Civil Seminar Hall',
    category: 'facility',
    block: 'JS Block',
    floor: '1st Floor',
    roomNo: 'JS-205',
    description: 'Civil Engineering conference venue featuring digital AV tools, model charts, and seating for 150 candidates.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-js-block'],
    latOffset: -0.00048,
    lngOffset: 0.00048,
    parentBlockId: 'loc-js-block',
  },
  {
    id: 'loc-boys-restroom-ks',
    name: 'Boys Restroom (KS Block)',
    category: 'facility',
    block: 'KS Block',
    floor: 'Ground Floor',
    roomNo: 'Restroom G-01',
    description: 'Clean public male washroom located next to the main lobby elevator in KS Block.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-girls-restroom-ks',
    name: 'Girls Restroom (KS Block)',
    category: 'facility',
    block: 'KS Block',
    floor: 'Ground Floor',
    roomNo: 'Restroom G-02',
    description: 'Clean public female washroom located in the east lobby corridor of KS Block.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  },
  {
    id: 'loc-drinking-water-ks',
    name: 'Drinking Water Cooler (RO Station)',
    category: 'facility',
    block: 'KS Block',
    floor: 'Ground Floor',
    roomNo: 'RO Water Station',
    description: 'Equipped with heavy-duty commercial reverse osmosis (RO) filtration and chilled water dispense nozzles.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    nearbyIds: ['loc-ks-block'],
    latOffset: -0.00028,
    lngOffset: 0.00028,
    parentBlockId: 'loc-ks-block',
  }
];

// ----------------------------------------------------
// GRAPH WAYPOINTS RELATIVE OFFSETS (for routing)
// ----------------------------------------------------
interface WaypointOffset {
  id: string;
  latOffset: number;
  lngOffset: number;
  label: string;
}

const WAYPOINT_OFFSETS: WaypointOffset[] = [
  { id: 'wp-bus-stop', latOffset: -0.00168, lngOffset: -0.0026, label: 'Bus Bay outside' },
  { id: 'wp-main-gate', latOffset: -0.00148, lngOffset: -0.0023, label: 'Main Entrance Gate' },
  { id: 'wp-parking', latOffset: -0.00128, lngOffset: -0.0020, label: 'Main Parking Area' },
  { id: 'wp-admin-front', latOffset: -0.00078, lngOffset: -0.0015, label: 'Admin Block path' },
  { id: 'wp-junction-north', latOffset: -0.0003, lngOffset: -0.0013, label: 'North Junction near Admin' },
  { id: 'wp-medical-front', latOffset: -0.00048, lngOffset: -0.0011, label: 'Medical Wing lobby' },
  { id: 'wp-bd-front', latOffset: -0.00008, lngOffset: -0.0008, label: 'BD Block lobby' },
  { id: 'wp-junction-central', latOffset: 0.0001, lngOffset: -0.0006, label: 'Central Roundabout' },
  { id: 'wp-rv-front', latOffset: -0.00068, lngOffset: -0.0008, label: 'RV Block entrance' },
  { id: 'wp-me-front', latOffset: 0.00042, lngOffset: -0.0011, label: 'Mechanical Block lobby' },
  { id: 'wp-sports-front', latOffset: -0.00018, lngOffset: -0.0020, label: 'Sports Arena entrance' },
  { id: 'wp-stadium-front', latOffset: -0.00088, lngOffset: -0.0018, label: 'Indoor Stadium gate' },
  { id: 'wp-hostel-front', latOffset: -0.00128, lngOffset: -0.0003, label: 'Boys Hostel gate' },
  { id: 'wp-canteen-front', latOffset: -0.00078, lngOffset: -0.0005, label: 'Canteen front' },
  { id: 'wp-js-front', latOffset: -0.00048, lngOffset: 0.00048, label: 'JS Block entrance' },
  { id: 'wp-junction-east', latOffset: -0.0001, lngOffset: 0.0002, label: 'East Junction' },
  { id: 'wp-library-front', latOffset: 0.0, lngOffset: 0.0, label: 'Central Library lobby' },
  { id: 'wp-ks-front', latOffset: -0.00028, lngOffset: 0.00028, label: 'KS Block entrance' },
  { id: 'wp-mba-front', latOffset: 0.00002, lngOffset: 0.00068, label: 'MBA Block entrance' }
];

// Graph Adjacency representation
const ROUTE_EDGES_MAP: { [from: string]: string[] } = {
  'wp-bus-stop': ['wp-main-gate'],
  'wp-main-gate': ['wp-bus-stop', 'wp-parking'],
  'wp-parking': ['wp-main-gate', 'wp-admin-front'],
  'wp-admin-front': ['wp-parking', 'wp-junction-north', 'wp-medical-front'],
  'wp-junction-north': ['wp-admin-front', 'wp-bd-front', 'wp-medical-front'],
  'wp-medical-front': ['wp-admin-front', 'wp-junction-north'],
  'wp-bd-front': ['wp-junction-north', 'wp-junction-central'],
  'wp-junction-central': ['wp-bd-front', 'wp-library-front', 'wp-me-front', 'wp-rv-front'],
  'wp-rv-front': ['wp-junction-central', 'wp-me-front'],
  'wp-me-front': ['wp-junction-central', 'wp-rv-front', 'wp-sports-front'],
  'wp-sports-front': ['wp-me-front', 'wp-stadium-front', 'wp-canteen-front'],
  'wp-stadium-front': ['wp-sports-front', 'wp-hostel-front'],
  'wp-hostel-front': ['wp-stadium-front', 'wp-canteen-front'],
  'wp-canteen-front': ['wp-hostel-front', 'wp-sports-front', 'wp-js-front'],
  'wp-js-front': ['wp-canteen-front', 'wp-junction-east'],
  'wp-junction-east': ['wp-js-front', 'wp-library-front', 'wp-ks-front'],
  'wp-library-front': ['wp-junction-central', 'wp-junction-east', 'wp-ks-front'],
  'wp-ks-front': ['wp-library-front', 'wp-junction-east', 'wp-mba-front'],
  'wp-mba-front': ['wp-ks-front']
};

// Map each location ID to the nearest routing waypoint ID
const LOCATION_TO_WAYPOINT: { [locId: string]: string } = {
  'loc-library': 'wp-library-front',
  'loc-main-gate': 'wp-main-gate',
  'loc-ks-block': 'wp-ks-front',
  'loc-js-block': 'wp-js-front',
  'loc-bd-block': 'wp-bd-front',
  'loc-me-block': 'wp-me-front',
  'loc-rv-block': 'wp-rv-front',
  'loc-mba-block': 'wp-mba-front',
  'loc-admin': 'wp-admin-front',
  'loc-boys-hostel': 'wp-hostel-front',
  'loc-canteen': 'wp-canteen-front',
  'loc-sports-ground': 'wp-sports-front',
  'loc-indoor-stadium': 'wp-stadium-front',
  'loc-parking': 'wp-parking',
  'loc-bus-stop': 'wp-bus-stop',
  'loc-medical': 'wp-medical-front',
  
  // sub locations map to their parent block's waypoint
  'loc-principal-office': 'wp-admin-front',
  'loc-placement-cell': 'wp-admin-front',
  'loc-exam-cell': 'wp-admin-front',
  'loc-cse-hod': 'wp-ks-front',
  'loc-ece-hod': 'wp-ks-front',
  'loc-eee-hod': 'wp-ks-front',
  'loc-cse-labs': 'wp-ks-front',
  'loc-auditorium': 'wp-ks-front',
  'loc-civil-seminar': 'wp-js-front',
  'loc-boys-restroom-ks': 'wp-ks-front',
  'loc-girls-restroom-ks': 'wp-ks-front',
  'loc-drinking-water-ks': 'wp-ks-front'
};

// ----------------------------------------------------
// HELPER GEOMETRIC MATH
// ----------------------------------------------------
function getDistanceLatLng(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (((θ * 180) / Math.PI + 360) % 360); // in degrees
}

// ----------------------------------------------------
// DIJKSTRA'S SHORTEST PATH ROUTER
// ----------------------------------------------------
interface GraphStructure {
  [key: string]: { [neighbor: string]: number };
}

function solveDijkstra(graph: GraphStructure, start: string, end: string): string[] | null {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const queue: string[] = [];

  for (const vertex in graph) {
    if (vertex === start) {
      distances[vertex] = 0;
    } else {
      distances[vertex] = Infinity;
    }
    previous[vertex] = null;
    queue.push(vertex);
  }

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const smallest = queue.shift()!;

    if (smallest === end) {
      const path: string[] = [];
      let curr: string | null = end;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
      return path;
    }

    if (distances[smallest] === Infinity) {
      break;
    }

    for (const neighbor in graph[smallest]) {
      const alt = distances[smallest] + graph[smallest][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = smallest;
      }
    }
  }

  return null;
}

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
export default function CampusMapView({ isDark = false }: CampusMapViewProps) {
  // DOM and Instance references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeCasingRef = useRef<L.Polyline | null>(null); // For path outline border
  const locationMarkersRef = useRef<{ [id: string]: L.Marker }>({});
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  
  // Geolocation reference anchors
  const [centerCoords, setCenterCoords] = useState<[number, number]>(DEFAULT_CENTER);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [waypoints, setWaypoints] = useState<{ [id: string]: [number, number] }>({});
  const [routingGraph, setRoutingGraph] = useState<GraphStructure>({});

  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CampusLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  
  const [startPointId, setStartPointId] = useState<string>('loc-main-gate');
  const [destPointId, setDestPointId] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeSteps, setRouteSteps] = useState<{ instruction: string; distText: string; direction: 'straight' | 'left' | 'right' | 'arrive' }[]>([]);
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number } | null>(null);
  
  // UI states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [kmlStatus, setKmlStatus] = useState<'loading' | 'success' | 'partial' | 'error'>('loading');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mapRotation, setMapRotation] = useState(0);

  // Load KML & Calibrate coordinates
  useEffect(() => {
    async function loadAndCalibrate() {
      setKmlStatus('loading');
      try {
        const res = await fetch('/api/kml');
        if (!res.ok) throw new Error('KML fetch response not OK');
        const kmlText = await res.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
        const placemarks = xmlDoc.getElementsByTagName('Placemark');
        
        let kmlLibraryCoords: [number, number] | null = null;
        const kmlFoundMarkers: { name: string; lat: number; lng: number }[] = [];
        
        for (let i = 0; i < placemarks.length; i++) {
          const p = placemarks[i];
          const nameNode = p.getElementsByTagName('name')[0];
          const coordsNode = p.getElementsByTagName('coordinates')[0];
          
          if (nameNode && coordsNode && coordsNode.textContent) {
            const name = nameNode.textContent.trim();
            const coordsParts = coordsNode.textContent.trim().split(',');
            if (coordsParts.length >= 2) {
              const lng = parseFloat(coordsParts[0]);
              const lat = parseFloat(coordsParts[1]);
              if (!isNaN(lat) && !isNaN(lng)) {
                kmlFoundMarkers.push({ name, lat, lng });
                if (name.toLowerCase().includes('library') || name.toLowerCase().includes('saranathan')) {
                  kmlLibraryCoords = [lat, lng];
                }
              }
            }
          }
        }
        
        // Calibrate with KML anchor
        const finalCenter = kmlLibraryCoords || DEFAULT_CENTER;
        setCenterCoords(finalCenter);
        
        // Calibrate Locations coordinates
        const calibratedLocations = BASE_LOCATIONS.map(loc => {
          const kmlMatch = kmlFoundMarkers.find(k => k.name.toLowerCase() === loc.name.toLowerCase());
          if (kmlMatch) {
            return {
              ...loc,
              lat: kmlMatch.lat,
              lng: kmlMatch.lng,
              isKmlSource: true
            };
          }
          return {
            ...loc,
            lat: finalCenter[0] + loc.latOffset,
            lng: finalCenter[1] + loc.lngOffset,
            isKmlSource: false
          };
        });
        
        // Add extra KML placemarks not matched as custom markers
        kmlFoundMarkers.forEach(kmlItem => {
          const alreadyMatched = calibratedLocations.some(l => l.name.toLowerCase() === kmlItem.name.toLowerCase());
          if (!alreadyMatched) {
            calibratedLocations.push({
              id: `kml-custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: kmlItem.name,
              category: 'facility',
              block: 'KML Ground Node',
              floor: 'Ground Level',
              roomNo: 'N/A',
              description: 'Placemark loaded dynamically from campus KML source file.',
              photoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
              nearbyIds: [],
              latOffset: 0,
              lngOffset: 0,
              lat: kmlItem.lat,
              lng: kmlItem.lng,
              isKmlSource: true
            });
          }
        });
        
        setLocations(calibratedLocations);
        
        // Calibrate Waypoints coordinates
        const calibratedWaypoints: { [id: string]: [number, number] } = {};
        WAYPOINT_OFFSETS.forEach(wp => {
          calibratedWaypoints[wp.id] = [
            finalCenter[0] + wp.latOffset,
            finalCenter[1] + wp.lngOffset
          ];
        });
        setWaypoints(calibratedWaypoints);
        
        // Compute bidirectional routing graph
        const computedGraph: GraphStructure = {};
        for (const fromNode in ROUTE_EDGES_MAP) {
          computedGraph[fromNode] = {};
          const connections = ROUTE_EDGES_MAP[fromNode];
          connections.forEach(toNode => {
            const p1 = calibratedWaypoints[fromNode];
            const p2 = calibratedWaypoints[toNode];
            if (p1 && p2) {
              const meters = getDistanceLatLng(p1[0], p1[1], p2[0], p2[1]);
              computedGraph[fromNode][toNode] = meters;
            }
          });
        }
        setRoutingGraph(computedGraph);
        
        setKmlStatus(kmlLibraryCoords ? 'success' : 'partial');
      } catch (err) {
        console.error('Failed to load KML, initializing standard base map calibration:', err);
        setKmlStatus('error');
        
        const finalCenter = DEFAULT_CENTER;
        setCenterCoords(finalCenter);
        
        const fallbackLocations = BASE_LOCATIONS.map(loc => ({
          ...loc,
          lat: finalCenter[0] + loc.latOffset,
          lng: finalCenter[1] + loc.lngOffset,
          isKmlSource: false
        }));
        setLocations(fallbackLocations);
        
        const fallbackWaypoints: { [id: string]: [number, number] } = {};
        WAYPOINT_OFFSETS.forEach(wp => {
          fallbackWaypoints[wp.id] = [
            finalCenter[0] + wp.latOffset,
            finalCenter[1] + wp.lngOffset
          ];
        });
        setWaypoints(fallbackWaypoints);
        
        const computedGraph: GraphStructure = {};
        for (const fromNode in ROUTE_EDGES_MAP) {
          computedGraph[fromNode] = {};
          const connections = ROUTE_EDGES_MAP[fromNode];
          connections.forEach(toNode => {
            const p1 = fallbackWaypoints[fromNode];
            const p2 = fallbackWaypoints[toNode];
            if (p1 && p2) {
              const meters = getDistanceLatLng(p1[0], p1[1], p2[0], p2[1]);
              computedGraph[fromNode][toNode] = meters;
            }
          });
        }
        setRoutingGraph(computedGraph);
      }
    }
    loadAndCalibrate();
  }, []);

  // Initialize Map canvas (ONLY SHOW THE SCREENSHOT OVERLAY, LOCK VISIBILITY AND ZOOM STRICTLY TO IT)
  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;
    if (mapInstanceRef.current) return;
    
    // Create Leaflet map container with strict bounds lock. NO global tile layers are loaded.
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false, // Custom local map overlay, no OSM attribution needed
      maxBounds: OVERLAY_BOUNDS,
      maxBoundsViscosity: 1.0,
      maxZoom: 21
    });
    
    mapInstanceRef.current = map;
    
    // CRITICAL FIX: Frame the map to the screenshot bounds FIRST to initialize Leaflet's projection system.
    // If layers are added before a view is set, Leaflet will crash with a runtime TypeError.
    map.fitBounds(OVERLAY_BOUNDS, { animate: false });
    
    // Dynamically calculate the minimum zoom level where the image fills the viewport, and lock it
    const boundsZoom = map.getBoundsZoom(OVERLAY_BOUNDS, true);
    if (boundsZoom && isFinite(boundsZoom)) {
      map.setMinZoom(boundsZoom);
      map.setZoom(boundsZoom);
    } else {
      map.setMinZoom(17);
      map.setZoom(17);
    }
    
    // Render the screenshot image as the map canvas overlay
    imageOverlayRef.current = L.imageOverlay('/api/map-image', OVERLAY_BOUNDS, {
      interactive: false,
      zIndex: 10
    }).addTo(map);
    
    // Route casing outline for high contrast
    routeCasingRef.current = L.polyline([], {
      color: '#ffffff',
      weight: 10,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Main Route path
    routePolylineRef.current = L.polyline([], {
      color: '#0066ff',
      weight: 6,
      opacity: 1.0,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '3, 10',
      className: 'route-polyline-animate'
    }).addTo(map);
    
    // Place location markers
    const markers: { [id: string]: L.Marker } = {};
    
    locations.forEach(loc => {
      if (loc.lat && loc.lng) {
        const markerIcon = createCustomMarker(loc.category, isDark, false);
        const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon })
          .addTo(map)
          .on('click', () => {
            setSelectedLocation(loc);
            map.setView([loc.lat!, loc.lng!], 19, { animate: true });
          });
          
        markers[loc.id] = marker;
      }
    });
    
    locationMarkersRef.current = markers;
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      locationMarkersRef.current = {};
      imageOverlayRef.current = null;
      routeCasingRef.current = null;
      routePolylineRef.current = null;
    };
  }, [locations]);

  // Handle marker updates on dark mode toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    locations.forEach(loc => {
      const marker = locationMarkersRef.current[loc.id];
      if (marker) {
        marker.setIcon(createCustomMarker(loc.category, isDark, false));
      }
    });
  }, [isDark, locations]);

  // Handle search typing
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matches = locations.filter(loc => 
      loc.name.toLowerCase().includes(query) || 
      loc.block.toLowerCase().includes(query) || 
      loc.roomNo.toLowerCase().includes(query) || 
      loc.category.toLowerCase().includes(query) ||
      loc.description.toLowerCase().includes(query)
    );
    setSearchResults(matches);
  }, [searchQuery, locations]);

  // Handle category filtering
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    locations.forEach(loc => {
      const marker = locationMarkersRef.current[loc.id];
      if (!marker) return;
      
      const categoryMatch = activeCategory === 'all' || loc.category === activeCategory;
      if (categoryMatch) {
        marker.addTo(mapInstanceRef.current);
      } else {
        marker.remove();
      }
    });
  }, [activeCategory, locations]);

  const createCustomMarker = (category: string, darkTheme: boolean, isActive = false) => {
    let pinColor = '#3b82f6';
    let emoji = '📍';
    
    switch(category) {
      case 'academic':
        pinColor = '#a855f7';
        emoji = '🎓';
        break;
      case 'department':
        pinColor = '#0ea5e9';
        emoji = '🏛️';
        break;
      case 'facility':
        pinColor = '#f43f5e';
        emoji = '🏢';
        break;
      case 'sports':
        pinColor = '#10b981';
        emoji = '⚽';
        break;
    }
    
    if (isActive) {
      pinColor = '#ef4444';
    }
    
    const borderColor = darkTheme ? '#1e293b' : '#ffffff';
    
    return L.divIcon({
      className: 'custom-m3-pin',
      html: `
        <div class="flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-120 select-none animate-fade-in">
          <div class="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xl border-2 text-base font-bold text-white transition-all transform duration-300" style="background-color: ${pinColor}; border-color: ${borderColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.5)">
            <span>${emoji}</span>
          </div>
          <div class="-mt-1 w-2 h-2 rotate-45 border-r border-b" style="background-color: ${pinColor}; border-color: ${borderColor}"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
  };

  const handleGenerateRoute = () => {
    if (!startPointId || !destPointId) return;
    
    const startWp = LOCATION_TO_WAYPOINT[startPointId];
    const destWp = LOCATION_TO_WAYPOINT[destPointId];
    
    if (!startWp || !destWp) {
      alert('Routing waypoints not calibrated for selection.');
      return;
    }
    
    const path = solveDijkstra(routingGraph, startWp, destWp);
    
    if (!path || path.length === 0) {
      alert('Unable to generate an inside-campus routing link.');
      return;
    }
    
    const pathCoords: [number, number][] = path.map(nodeId => waypoints[nodeId]);
    
    if (routeCasingRef.current) {
      routeCasingRef.current.setLatLngs(pathCoords);
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(pathCoords);
    }
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(pathCoords, { padding: [80, 80], maxZoom: 19 });
    }
    
    let meters = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = waypoints[path[i]];
      const p2 = waypoints[path[i+1]];
      meters += getDistanceLatLng(p1[0], p1[1], p2[0], p2[1]);
    }
    
    const seconds = meters / 1.35;
    setRouteMetrics({
      distance: Math.round(meters),
      duration: Math.round(seconds / 60) || 1
    });
    
    const steps: any[] = [];
    const startLocName = locations.find(l => l.id === startPointId)?.name || 'Starting Point';
    const destLocName = locations.find(l => l.id === destPointId)?.name || 'Destination Point';
    
    steps.push({
      instruction: `Depart from ${startLocName} and proceed towards main walkway path.`,
      distText: '20 m',
      direction: 'straight'
    });
    
    for (let i = 0; i < path.length - 1; i++) {
      const currentWpId = path[i];
      const nextWpId = path[i+1];
      const p1 = waypoints[currentWpId];
      const p2 = waypoints[nextWpId];
      
      const legDist = getDistanceLatLng(p1[0], p1[1], p2[0], p2[1]);
      const currentWpLabel = WAYPOINT_OFFSETS.find(w => w.id === currentWpId)?.label || 'corridor junction';
      const nextWpLabel = WAYPOINT_OFFSETS.find(w => w.id === nextWpId)?.label || 'adjoining block';
      
      if (i > 0) {
        const prevWpId = path[i-1];
        const p0 = waypoints[prevWpId];
        
        const b1 = getBearing(p0[0], p0[1], p1[0], p1[1]);
        const b2 = getBearing(p1[0], p1[1], p2[0], p2[1]);
        const angleDiff = ((b2 - b1 + 180 + 360) % 360) - 180;
        
        let directionLabel: 'straight' | 'left' | 'right' = 'straight';
        let turnStr = 'Go straight';
        
        if (angleDiff > 35) {
          directionLabel = 'right';
          turnStr = 'Turn right';
        } else if (angleDiff < -35) {
          directionLabel = 'left';
          turnStr = 'Turn left';
        }
        
        steps.push({
          instruction: `${turnStr} at ${currentWpLabel} toward ${nextWpLabel}.`,
          distText: `${Math.round(legDist)} m`,
          direction: directionLabel
        });
      } else {
        steps.push({
          instruction: `Walk along the direct avenue path towards ${nextWpLabel}.`,
          distText: `${Math.round(legDist)} m`,
          direction: 'straight'
        });
      }
    }
    
    steps.push({
      instruction: `Arrive at ${destLocName}. Your destination is straight ahead.`,
      distText: '0 m',
      direction: 'arrive'
    });
    
    setRouteSteps(steps);
    setIsNavigating(true);
  };

  const handleClearRoute = () => {
    if (routeCasingRef.current) {
      routeCasingRef.current.setLatLngs([]);
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs([]);
    }
    setIsNavigating(false);
    setRouteMetrics(null);
    setRouteSteps([]);
    setDestPointId('');
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(OVERLAY_BOUNDS, { animate: true });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(OVERLAY_BOUNDS, { animate: true });
    }
    setMapRotation(0);
  };

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleSelectSearchResult = (loc: CampusLocation) => {
    setSelectedLocation(loc);
    setSearchQuery('');
    setSearchResults([]);
    
    if (loc.lat && loc.lng && mapInstanceRef.current) {
      mapInstanceRef.current.setView([loc.lat, loc.lng], 19, { animate: true });
      
      const marker = locationMarkersRef.current[loc.id];
      if (marker) {
        marker.setIcon(createCustomMarker(loc.category, isDark, true));
        setTimeout(() => {
          marker.setIcon(createCustomMarker(loc.category, isDark, false));
        }, 3000);
      }
    }
  };

  const categoriesList = [
    { id: 'all', label: 'All Markers', emoji: '🗺️' },
    { id: 'academic', label: 'Blocks', emoji: '🎓' },
    { id: 'department', label: 'Departments', emoji: '🏛️' },
    { id: 'facility', label: 'Facilities', emoji: '🏢' },
    { id: 'sports', label: 'Sports Complex', emoji: '⚽' }
  ];

  return (
    <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden font-sans border shadow-xl flex flex-col md:flex-row transition-all duration-300 border-slate-200/80 bg-slate-950" ref={mapContainerRef}>
      
      {/* ----------------------------------------------------
          LEFT SIDEBAR PANEL: SEARCH & NAVIGATION LOGIC
          ---------------------------------------------------- */}
      <div className={`w-full md:w-96 shrink-0 flex flex-col h-[40%] md:h-full z-20 border-r transition-colors duration-300 ${
        isDark ? 'bg-[#0f1115] border-slate-900 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Floating Search Bar */}
        <div className="p-4 relative border-b border-slate-100 dark:border-slate-900">
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-950/80 border-slate-800 focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 focus-within:border-blue-600'
          }`}>
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search CSE labs, toilet, canteen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs font-semibold placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Search suggestions list */}
          {searchResults.length > 0 && (
            <div className={`absolute left-4 right-4 top-16 max-h-56 overflow-y-auto rounded-2xl shadow-xl z-50 border transition-all duration-200 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {searchResults.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectSearchResult(loc)}
                  className="w-full text-left px-4 py-3 border-b last:border-none flex items-center gap-3 hover:bg-blue-600/10 transition-colors cursor-pointer border-slate-100 dark:border-slate-800/80"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono">{loc.name}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold">{loc.block} • {loc.floor} • Room {loc.roomNo}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category filters */}
        <div className={`px-4 py-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide border-b ${
          isDark ? 'border-slate-900' : 'border-slate-100'
        }`}>
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Routing Selector & Metrics */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-950/45 border-slate-900' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="text-xs font-black uppercase tracking-wider mb-3 text-blue-500 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Shortest Campus Routing
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 w-8">From</span>
                <select
                  value={startPointId}
                  onChange={(e) => setStartPointId(e.target.value)}
                  className={`flex-1 py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 w-8">To</span>
                <select
                  value={destPointId}
                  onChange={(e) => setDestPointId(e.target.value)}
                  className={`flex-1 py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                >
                  <option value="">-- Choose Facility --</option>
                  {locations.filter(l => l.id !== startPointId).map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                {isNavigating && (
                  <button
                    onClick={handleClearRoute}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                      isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 border-slate-200 text-slate-700'
                    }`}
                  >
                    Clear Path
                  </button>
                )}
                
                <button
                  onClick={handleGenerateRoute}
                  disabled={!destPointId}
                  className={`flex-1 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    destPointId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Route inside SCE
                </button>
              </div>
            </div>
          </div>

          {/* Turn by turn directions rendering */}
          {isNavigating && routeMetrics && (
            <div className="space-y-4 pt-1 animate-fade-in">
              <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                isDark ? 'bg-blue-950/20 border-blue-900/40 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'
              }`}>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Route Leg</p>
                  <h4 className="text-base font-black font-mono">{routeMetrics.distance} meters</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Est. Walk time</p>
                  <h4 className="text-base font-black font-mono">~ {routeMetrics.duration} min</h4>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Step-by-step guidance</h5>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {routeSteps.map((step, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex gap-3 items-start transition-colors ${
                      isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-500 text-xs font-bold mt-0.5">
                        {step.direction === 'left' && '←'}
                        {step.direction === 'right' && '→'}
                        {step.direction === 'straight' && '↑'}
                        {step.direction === 'arrive' && '🏁'}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] leading-relaxed font-semibold">{step.instruction}</p>
                        {step.distText !== '0 m' && (
                          <span className="text-[9px] font-mono text-slate-400 font-bold block mt-0.5">Segment: {step.distText}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Default view / general info */}
          {!isNavigating && !selectedLocation && (
            <div className={`p-5 text-center rounded-2xl border ${
              isDark ? 'bg-slate-900/10 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-500 stroke-1 animate-pulse" />
              <p className="text-xs font-semibold">Select any campus marker on the map or configure starting gate path directions.</p>
            </div>
          )}

          {/* Selected marker info Card */}
          {selectedLocation && !isNavigating && (
            <div className={`rounded-2xl border overflow-hidden transition-all duration-300 animate-fade-in ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="h-28 relative bg-slate-900">
                <img 
                  src={selectedLocation.photoUrl} 
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded-md">
                  {selectedLocation.category.toUpperCase()}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-black leading-tight font-mono">{selectedLocation.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    Block: {selectedLocation.block} • Floor: {selectedLocation.floor} • Room: {selectedLocation.roomNo}
                  </p>
                </div>

                <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                  {selectedLocation.description}
                </p>

                {selectedLocation.isKmlSource && (
                  <div className="py-1 px-2.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-bold rounded-lg inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    KML Verified Location
                  </div>
                )}

                <div className="flex gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setStartPointId('loc-main-gate');
                      setDestPointId(selectedLocation.id);
                      setTimeout(() => handleGenerateRoute(), 100);
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Navigate here
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic KML Status Indicator footer */}
        <div className={`p-3 border-t text-[10px] font-semibold flex items-center justify-between ${
          isDark ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              kmlStatus === 'success' ? 'bg-green-500' : 
              kmlStatus === 'partial' ? 'bg-yellow-500' : 
              kmlStatus === 'loading' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="font-mono text-slate-400">
              KML Base: {
                kmlStatus === 'success' ? 'Saranathan KML Calibrated' :
                kmlStatus === 'partial' ? 'Anchor calibrated (Partial)' :
                kmlStatus === 'loading' ? 'Parsing KML data...' : 'Failed KML, Local fallback'
              }
            </span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            title="Reload KML"
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full cursor-pointer text-slate-400 hover:text-slate-100"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          RIGHT CANVAS PANEL: LEAFLET MAP ELEMENT
          ---------------------------------------------------- */}
      <div className="flex-1 h-[60%] md:h-full relative overflow-hidden bg-[#0d0e11]">
        
        {/* Actual Map Leaflet mounting wrapper */}
        <div className="w-full h-full z-10" id="campus-leaflet-map-element" ref={mapRef} />

        {/* Floating Reset View Compass */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          
          <button
            onClick={handleResetView}
            title="Reset Campus View"
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-slate-100 hover:bg-slate-900' 
                : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Compass 
              className="w-5 h-5 text-blue-500 transition-transform duration-300"
              style={{ transform: `rotate(${mapRotation}deg)` }}
            />
          </button>
          
        </div>

        {/* Floating Custom Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-slate-100 hover:bg-slate-900' 
                : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-slate-100 hover:bg-slate-900' 
                : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            title="Fullscreen toggle"
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800 text-slate-100 hover:bg-slate-900' 
                : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Legend / Overlay details */}
        <div className={`absolute bottom-4 left-4 z-20 p-3 rounded-2xl shadow-lg border backdrop-blur-md text-[9px] font-mono font-bold flex flex-col gap-1.5 transition-colors duration-300 ${
          isDark ? 'bg-slate-950/80 border-slate-900 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-500'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" />
            <span>ACADEMIC BLOCKS (JS, KS, BD, ME...)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
            <span>HOD CABINS & DEPT SERVICES</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
            <span>FACILITIES & UTILITIES (Canteen, Lib)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-green-500 inline-block" />
            <span>SPORTSGROUND & AUDITORIUMS</span>
          </div>
        </div>

      </div>

      <style>{`
        .route-polyline-animate {
          stroke-dasharray: 10, 10;
          animation: dash-flow 25s linear infinite;
        }

        @keyframes dash-flow {
          to {
            stroke-dashoffset: -1000;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .leaflet-container {
          background: #0d0e11 !important;
        }
      `}</style>

    </div>
  );
}