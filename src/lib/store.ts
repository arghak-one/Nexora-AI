import { useEffect, useState } from "react";

// Types
export interface Student {
  id: number;
  name: string;
  class: string;
  attendance?: number;
  marks?: number;
  risk?: string;
  aiScore?: number;
  isNew?: boolean;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: string[];
  email: string;
  rating: number;
  isNew?: boolean;
}

export interface Parent {
  id: number;
  parentName: string;
  studentName: string;
  class: string;
  phone?: string;
  email?: string;
  relationship?: string;
  isNew?: boolean;
}

export interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  students?: number;
  avgScore?: number;
  attendance?: number;
  isNew?: boolean;
}

export interface ResultRecord {
  id: number;
  studentName: string;
  class: string;
  subject: string;
  marks: number;
  total: number;
  percentage: number;
  status: string;
  grade: string;
  isNew?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  department: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  fileUrl: string | null;
  content: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface BehaviourRecord {
  id: string;
  studentName: string;
  class: string;
  type: "warning" | "concern" | "positive";
  description: string;
  date: string;
  reportedBy: string;
  frequency?: number;
  createdAt?: number;
  updatedAt?: number;
}

// Default Data
export const defaultStudents: Student[] = [
  { id: 1, name: "Rahul Kumar", class: "10A", attendance: 95, marks: 88, risk: "Low", aiScore: 9.2 },
  { id: 2, name: "Priya Sharma", class: "10A", attendance: 72, marks: 65, risk: "High", aiScore: 5.8 },
  { id: 3, name: "Amit Patel", class: "10B", attendance: 88, marks: 76, risk: "Low", aiScore: 7.9 },
  { id: 4, name: "Sneha Gupta", class: "9A", attendance: 91, marks: 82, risk: "Low", aiScore: 8.5 },
  { id: 5, name: "Vikram Singh", class: "10B", attendance: 58, marks: 45, risk: "High", aiScore: 3.2 },
  { id: 6, name: "Ananya Das", class: "9B", attendance: 85, marks: 79, risk: "Medium", aiScore: 7.1 },
  { id: 7, name: "Rohan Mehta", class: "9A", attendance: 93, marks: 91, risk: "Low", aiScore: 9.5 },
  { id: 8, name: "Kavita Reddy", class: "10A", attendance: 78, marks: 68, risk: "Medium", aiScore: 6.4 },
];

export const defaultTeachers: Teacher[] = [
  { id: 1, name: "Dr. Meera Roy", subject: "Mathematics", classes: ["9A", "10A"], email: "meera@eduai.com", rating: 4.8 },
  { id: 2, name: "Mr. Anil Das", subject: "Physics", classes: ["9B", "10B"], email: "anil@eduai.com", rating: 4.5 },
  { id: 3, name: "Ms. Priya Jain", subject: "Chemistry", classes: ["10A", "11A"], email: "priya@eduai.com", rating: 4.9 },
  { id: 4, name: "Dr. Suresh Nair", subject: "English", classes: ["10B", "12A"], email: "suresh@eduai.com", rating: 4.3 },
  { id: 5, name: "Mrs. Kavita Rao", subject: "Computer Science", classes: ["11A", "12A"], email: "kavita@eduai.com", rating: 4.7 },
  { id: 6, name: "Mr. Rajesh Kumar", subject: "Biology", classes: ["9A", "9B"], email: "rajesh@eduai.com", rating: 4.6 },
];

export const defaultClasses: ClassItem[] = [
  { id: 1, name: "Class 9A", students: 32, teacher: "Dr. Meera Roy", avgScore: 81, attendance: 91 },
  { id: 2, name: "Class 9B", students: 30, teacher: "Mr. Anil Das", avgScore: 74, attendance: 86 },
  { id: 3, name: "Class 10A", students: 35, teacher: "Ms. Priya Jain", avgScore: 79, attendance: 89 },
  { id: 4, name: "Class 10B", students: 28, teacher: "Dr. Suresh Nair", avgScore: 72, attendance: 84 },
  { id: 5, name: "Class 11A", students: 34, teacher: "Mrs. Kavita Rao", avgScore: 85, attendance: 93 },
  { id: 6, name: "Class 12A", students: 31, teacher: "Mr. Rajesh Kumar", avgScore: 77, attendance: 88 },
];

export const defaultResults: ResultRecord[] = [
  { id: 1, studentName: "Rahul Kumar", class: "10A", subject: "Mathematics", marks: 88, total: 100, percentage: 88, status: "Pass", grade: "A" },
  { id: 2, studentName: "Priya Sharma", class: "10A", subject: "Mathematics", marks: 42, total: 100, percentage: 42, status: "Fail", grade: "F" },
  { id: 3, studentName: "Amit Patel", class: "10B", subject: "Physics", marks: 76, total: 100, percentage: 76, status: "Pass", grade: "B" },
  { id: 4, studentName: "Sneha Gupta", class: "9A", subject: "Chemistry", marks: 91, total: 100, percentage: 91, status: "Pass", grade: "A+" },
  { id: 5, studentName: "Vikram Singh", class: "10B", subject: "English", marks: 55, total: 100, percentage: 55, status: "Pass", grade: "D" },
  { id: 6, studentName: "Ananya Das", class: "9B", subject: "Computer Science", marks: 95, total: 100, percentage: 95, status: "Pass", grade: "A+" },
  { id: 7, studentName: "Rohan Mehta", class: "9A", subject: "Biology", marks: 38, total: 100, percentage: 38, status: "Fail", grade: "F" },
  { id: 8, studentName: "Kavita Reddy", class: "10A", subject: "Physics", marks: 82, total: 100, percentage: 82, status: "Pass", grade: "A" },
  { id: 9, studentName: "Rahul Kumar", class: "10A", subject: "English", marks: 99, total: 100, percentage: 99, status: "Pass", grade: "A+" },
  { id: 10, studentName: "Priya Sharma", class: "10A", subject: "Chemistry", marks: 65, total: 100, percentage: 65, status: "Pass", grade: "C" },
  { id: 11, studentName: "Amit Patel", class: "10B", subject: "Mathematics", marks: 72, total: 100, percentage: 72, status: "Pass", grade: "B" },
  { id: 12, studentName: "Sneha Gupta", class: "9A", subject: "English", marks: 85, total: 100, percentage: 85, status: "Pass", grade: "A" },
  { id: 13, studentName: "Vikram Singh", class: "10B", subject: "Computer Science", marks: 60, total: 100, percentage: 60, status: "Pass", grade: "C" },
  { id: 14, studentName: "Ananya Das", class: "9B", subject: "Mathematics", marks: 79, total: 100, percentage: 79, status: "Pass", grade: "B" },
  { id: 15, studentName: "Rohan Mehta", class: "9A", subject: "Mathematics", marks: 93, total: 100, percentage: 93, status: "Pass", grade: "A+" },
  { id: 16, studentName: "Kavita Reddy", class: "10A", subject: "Chemistry", marks: 68, total: 100, percentage: 68, status: "Pass", grade: "C" },
];

export const defaultProfile: UserProfile = {
  name: "Argha Mukherjee",
  email: "argha@eduai.com",
  phone: "+91 98765 43210",
  location: "Kolkata, India",
  role: "Super Admin",
  department: "Academic Administration"
};

export const defaultReports: ReportRecord[] = [
  { id: "r1", title: "Term 1 Performance Report", type: "Academic", date: "March 15, 2026", size: "2.4 MB", fileUrl: null, content: "This report covers the performance metrics for Term 1 across all high school classes. Overall math scores climbed by 4%, but sciences need intervention." },
  { id: "r2", title: "Monthly Attendance Summary", type: "Attendance", date: "March 1, 2026", size: "1.1 MB", fileUrl: null, content: "Average monthly attendance stood at 92%. Class 10B dropped to 85% in the final week due to illness." },
  { id: "r3", title: "AI Risk Assessment Report", type: "AI Analytics", date: "Feb 28, 2026", size: "3.2 MB", fileUrl: null, content: "Based on recent behaviors and results, 7 students are tracked as 'High Risk'. View detailed recommendations on page 4." },
  { id: "r4", title: "Fee Collection Summary — Q1", type: "Financial", date: "Feb 15, 2026", size: "0.8 MB", fileUrl: null, content: "85% of Q1 fees collected successfully. Overdue accounts total approximately $14,000. Follow-ups scheduled." },
  { id: "r5", title: "Student Behaviour Analysis", type: "Behavioural", date: "Feb 10, 2026", size: "1.6 MB", fileUrl: null, content: "Disciplinary actions reduced by 15% this quarter. Commendations awarded to 40 students for exemplary peer support." },
  { id: "r6", title: "Parent Feedback Compilation", type: "Feedback", date: "Jan 30, 2026", size: "2.0 MB", fileUrl: null, content: "Survey results indicate 89% parent satisfaction. Primary request: More frequent communication regarding homework expectations." },
];

export const defaultBehaviours: BehaviourRecord[] = [
  { id: "b1", studentName: "Vikram Singh", class: "10B", type: "warning", description: "Repeated late arrivals — 5 times this month", date: "Today", reportedBy: "Mr. Sharma", frequency: 5 },
  { id: "b2", studentName: "Priya Sharma", class: "10A", type: "concern", description: "Declining participation in class discussions", date: "Yesterday", reportedBy: "Mrs. Gupta", frequency: 2 },
  { id: "b3", studentName: "Rahul Kumar", class: "10A", type: "positive", description: "Excellent leadership during group project", date: "2 days ago", reportedBy: "Mr. Davis", frequency: 1 },
  { id: "b4", studentName: "Rohan Mehta", class: "9A", type: "positive", description: "Consistent improvement in homework submissions", date: "3 days ago", reportedBy: "Ms. Lee", frequency: 4 },
  { id: "b5", studentName: "Kavita Reddy", class: "10A", type: "concern", description: "Showing signs of disengagement in Physics class", date: "4 days ago", reportedBy: "Dr. Singh", frequency: 3 },
  { id: "b6", studentName: "Amit Patel", class: "10B", type: "positive", description: "Helped peer tutoring sessions voluntarily", date: "5 days ago", reportedBy: "Mr. Sharma", frequency: 1 },
];

// Event Emitter
export const STORE_UPDATE_EVENT = "nexora_store_update";

function triggerUpdate() {
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

// Storage Helpers
function loadData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultValue;
}

function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
  triggerUpdate();
}

// API
export const store = {
  getStudents: () => loadData<Student[]>("nexora_students", defaultStudents),
  setStudents: (data: Student[]) => saveData("nexora_students", data),
  
  getTeachers: () => loadData<Teacher[]>("teachers_data", defaultTeachers),
  setTeachers: (data: Teacher[]) => saveData("teachers_data", data),
  
  getParents: () => loadData<Parent[]>("nexora_parents", []),
  setParents: (data: Parent[]) => saveData("nexora_parents", data),

  getClasses: () => loadData<ClassItem[]>("nexora_classes", defaultClasses),
  setClasses: (data: ClassItem[]) => saveData("nexora_classes", data),

  getResults: () => loadData<ResultRecord[]>("results_data", defaultResults),
  setResults: (data: ResultRecord[]) => saveData("results_data", data),

  getUserProfile: () => loadData<UserProfile>("userProfile", defaultProfile),
  setUserProfile: (data: UserProfile) => saveData("userProfile", data),

  getReports: () => loadData<ReportRecord[]>("reportsData", defaultReports),
  setReports: (data: ReportRecord[]) => saveData("reportsData", data),

  getBehaviours: () => loadData<BehaviourRecord[]>("nexora_behaviours", defaultBehaviours),
  setBehaviours: (data: BehaviourRecord[]) => saveData("nexora_behaviours", data),
};

// React Hook
export function useStoreUpdate() {
  const [stamp, setStamp] = useState(Date.now());
  useEffect(() => {
    const handler = () => setStamp(Date.now());
    window.addEventListener(STORE_UPDATE_EVENT, handler);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, handler);
  }, []);
  return stamp;
}
