
import { StudentProfile, MatchedGroup } from './types';

export const SUBJECTS = [
  "Calculus",
  "Linear Algebra",
  "Quantum Physics",
  "Organic Chemistry",
  "World History",
  "Data Structures",
  "Machine Learning",
  "Literary Analysis",
  "Microeconomics",
  "Art History"
];

export const AVAILABILITY_OPTIONS = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Flexible"
];

export const STUDY_METHODS = [
  "Quiet Co-working",
  "Active Discussion & Quizzing",
  "Problem Solving Sessions",
  "Document Collaboration",
  "Virtual Whiteboard"
];

export const MOCK_PROFILES: StudentProfile[] = [
  {
    id: 1,
    name: "Alex",
    subjectsCanHelp: ["Calculus", "Linear Algebra"],
    subjectsHelpNeeded: ["Quantum Physics", "Organic Chemistry"],
    availability: ["Weekday Evenings", "Weekend Afternoons"],
    studyMethod: "Virtual Whiteboard",
    avatarUrl: "https://picsum.photos/seed/alex/200"
  },
  {
    id: 2,
    name: "Brenda",
    subjectsCanHelp: ["World History", "Literary Analysis"],
    subjectsHelpNeeded: ["Data Structures", "Machine Learning"],
    availability: ["Weekday Mornings", "Flexible"],
    studyMethod: "Document Collaboration",
    avatarUrl: "https://picsum.photos/seed/brenda/200"
  },
  {
    id: 3,
    name: "Charlie",
    subjectsCanHelp: ["Data Structures", "Machine Learning"],
    subjectsHelpNeeded: ["Calculus", "Microeconomics"],
    availability: ["Weekend Mornings", "Weekend Afternoons"],
    studyMethod: "Problem Solving Sessions",
    avatarUrl: "https://picsum.photos/seed/charlie/200"
  },
  {
    id: 4,
    name: "Dana",
    subjectsCanHelp: ["Quantum Physics", "Organic Chemistry"],
    subjectsHelpNeeded: ["Art History", "Literary Analysis"],
    availability: ["Weekday Afternoons", "Weekday Evenings"],
    studyMethod: "Active Discussion & Quizzing",
    avatarUrl: "https://picsum.photos/seed/dana/200",
    isFriend: true,
  },
  {
    id: 5,
    name: "Eli",
    subjectsCanHelp: ["Microeconomics", "Art History"],
    subjectsHelpNeeded: ["Linear Algebra"],
    availability: ["Flexible"],
    studyMethod: "Quiet Co-working",
    avatarUrl: "https://picsum.photos/seed/eli/200"
  },
   {
    id: 6,
    name: "Fiona",
    subjectsCanHelp: ["Data Structures", "Calculus"],
    subjectsHelpNeeded: ["Machine Learning", "World History"],
    availability: ["Weekday Evenings", "Weekend Mornings"],
    studyMethod: "Problem Solving Sessions",
    avatarUrl: "https://picsum.photos/seed/fiona/200"
  },
  {
    id: 7,
    name: "George",
    subjectsCanHelp: ["Literary Analysis"],
    subjectsHelpNeeded: ["Quantum Physics", "Organic Chemistry"],
    availability: ["Weekday Mornings", "Weekday Afternoons"],
    studyMethod: "Active Discussion & Quizzing",
    avatarUrl: "https://picsum.photos/seed/george/200"
  }
];

export const MOCK_GROUPS: MatchedGroup[] = [
    {
        id: 101,
        name: 'Data Structures Duo',
        topic: 'Data Structures',
        members: [MOCK_PROFILES[2], MOCK_PROFILES[5]], // Charlie & Fiona
        capacity: 3,
        matchReason: 'This focused pair is looking for one more member to master algorithms and data structures through intensive problem-solving sessions.'
    },
    {
        id: 102,
        name: 'Quantum Quartet',
        topic: 'Quantum Physics',
        members: [MOCK_PROFILES[0], MOCK_PROFILES[3], MOCK_PROFILES[6]], // Alex, Dana, George
        capacity: 4,
        matchReason: 'A dynamic group tackling the complexities of quantum mechanics. They have one spot left for a dedicated student who enjoys active discussions.'
    }
];