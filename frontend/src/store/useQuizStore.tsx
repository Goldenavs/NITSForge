// src/store/useQuizStore.ts
import { create } from 'zustand';
import { type Question } from '../data/mockQuestions';
import { supabase } from '../services/supabase';

interface QuizState {
  // State
  status: 'idle' | 'loading' | 'in-progress' | 'finished';
  questions: Question[];
  currentIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  
  // Actions
  startQuiz: () => Promise<void>;
  answerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  status: 'idle',
  questions: [],
  currentIndex: 0,
  selectedAnswers: {},
  score: 0,

  startQuiz: async () => {
    set({ status: 'loading' });

    // Fetch questions from Supabase
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching questions:', error);
      set({ status: 'idle' });
      return;
    }

    set({
      status: 'in-progress',
      questions: data as Question[] || [],
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

  finishQuiz: async () => {
    const { questions, selectedAnswers } = get();
    let finalScore = 0;
    
    // Calculate final score
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        finalScore += 1;
      }
    });

    set({ status: 'finished', score: finalScore });

    // Grab the current user session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.log('Guest user finished the quiz. Skipping session log to DB.');
      // Keep data in state. Guest migration handles it on signup.
      return;
    }

    // Insert into quiz_sessions
    const accuracyRate = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        mode: 'standard', // default mode
        total_questions: questions.length,
        correct_answers: finalScore,
        accuracy_rate: accuracyRate,
        xp_earned: finalScore * 10, // Example XP calculation
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (sessionError) {
      console.error('Error saving quiz session:', sessionError);
      return;
    }

    // Insert into session_answers
    const sessionId = sessionData.id;
    const answerInserts = questions.map(q => ({
      session_id: sessionId,
      user_id: userId,
      question_id: q.id,
      selected_answer: selectedAnswers[q.id] || null,
      is_correct: selectedAnswers[q.id] === q.correct_answer,
    }));

    if (answerInserts.length > 0) {
      const { error: answersError } = await supabase
        .from('session_answers')
        .insert(answerInserts);

      if (answersError) {
        console.error('Error saving session answers:', answersError);
      }
    }
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