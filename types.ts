// FIX: Removed self-import of 'StudentProfile' which was causing a declaration conflict.

export interface StudentProfile {
  id: number;
  name: string;
  subjectsCanHelp: string[];
  subjectsHelpNeeded: string[];
  availability: string[];
  studyMethod: string;
  avatarUrl: string;
  isFriend?: boolean;
}

export interface MatchedStudent extends StudentProfile {
  matchReason: string;
}

export interface MatchedGroup {
  id: number;
  name: string;
  members: StudentProfile[];
  capacity: number;
  matchReason:string;
  topic: string;
}

export type Match = MatchedStudent | MatchedGroup;


export enum View {
  Login,
  Home,
  Profile,
  Matches,
  Collaboration,
}

export interface StudySessionData {
    match: Match;
    subject: string;
    userProfile: StudentProfile;
}

export interface StudyPlan {
    keyTopics: string[];
    discussionQuestions: string[];
    practiceProblem: {
        problem: string;
        solution: string;
    };
}

export interface ChatMessage {
  sender: string; // The name of the sender, or 'You' for the current user
  text: string;
  timestamp: string;
}

export interface LeaderboardUser {
  name: string;
  avatarUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  type: 'group' | 'individual';
  users: LeaderboardUser[];
  score: number;
  topic?: string;
}