// src/store/useQuizStore.ts
import { create } from 'zustand';
import { type Question, mockQuestions } from '../data/mockQuestions';

interface QuizState {
  // State
  status: 'idle' | 'in-progress' | 'finished';
  questions: Question[];
  currentIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  
  // Actions
  startQuiz: () => void;
  answerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  status: 'idle',
  questions: [],
  currentIndex: 0,
  selectedAnswers: {},
  score: 0,

  startQuiz: () => {
    // In the future, this will fetch from Supabase. For now, we use our mock data.
    set({
      status: 'in-progress',
      questions: mockQuestions,
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
    });
  },

  answerQuestion: (questionId, answer) => {
    set((state) => ({
      selectedAnswers: { ...state.selectedAnswers, [questionId]: answer }
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      get().finishQuiz();
    }
  },

  finishQuiz: () => {
    const { questions, selectedAnswers } = get();
    let finalScore = 0;
    
    // Calculate final score
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        finalScore += 1;
      }
    });

    set({ status: 'finished', score: finalScore });
  },

  resetQuiz: () => {
    set({
      status: 'idle',
      questions: [],
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
    });
  }
}));