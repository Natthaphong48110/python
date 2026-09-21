export interface StudentProfile {
  id: string;
  name: string;
  classroom: string;
  studentNo: string;
}

export type QuizType = 'pre_test' | 'post_test';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  category: 'naming' | 'types' | 'casting' | 'operators';
  categoryTitle: string;
  title: string;
  codeSnippet?: string;
  options: QuestionOption[];
  explanation: string;
  conceptTip: string;
}

export interface QuizState {
  currentIndex: number;
  selectedOptionId: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  answers: {
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  isCompleted: boolean;
}

export interface MiniGameItem {
  id: string;
  prompt: string;
  valueDisplay: string;
  correctAnswer: string;
  explanation: string;
}

export interface StudentLeaderboardEntry {
  id: string;
  studentName: string;
  classroom: string;
  studentNo: string;
  totalPoints: number;
  preTestScore: number | null;
  postTestScore: number | null;
  gainRate: number | null;
  sorterHighScore: number;
  detectiveHighScore: number;
  labHighScore: number;
  badges: string[];
  lastActive: string;
  totalQuizzesTaken: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  duration: string;
  sections: {
    heading: string;
    description: string;
    codeExample?: string;
    codeExplanation?: string;
    warningNote?: string;
  }[];
  quickCheck: {
    question: string;
    codeSnippet?: string;
    options: { text: string; isCorrect: boolean; explanation: string }[];
  };
}

export type ActiveTab = 'dashboard' | 'lessons' | 'pre_test' | 'post_test' | 'games' | 'leaderboard';
