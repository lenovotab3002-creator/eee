
export interface StudentProfile {
  id: number;
  name: string;
  subjectsCanHelp: string[];
  subjectsHelpNeeded: string[];
  availability: string[];
  studyMethod: string;
  avatarUrl: string;
}

export interface MatchedStudent extends StudentProfile {
  matchReason: string;
}

export enum View {
  Home,
  Profile,
  Matches,
  Collaboration,
}

export interface StudySessionData {
    partner: MatchedStudent;
    subject: string;
}

export interface StudyPlan {
    keyTopics: string[];
    discussionQuestions: string[];
    practiceProblem: {
        problem: string;
        solution: string;
    };
}
