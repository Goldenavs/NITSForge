// src/store/useQuizStore.ts
import { create } from 'zustand';
import { type Question } from '../data/mockQuestions';
import { supabase } from '../services/supabase';

interface QuizState {
  // State
  status: 'idle' | 'loading' | 'in-progress' | 'finished';
  mode: 'practice' | 'simulation' | 'drill' | 'quick' | 'missed' | 'ai-generated';
  questions: Question[];
  currentIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  timeRemaining: number | null;
  
  // Actions
  startQuiz: (mode?: string, options?: any) => Promise<void>;
  answerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
  tick: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  status: 'idle',
  mode: 'practice',
  questions: [],
  currentIndex: 0,
  selectedAnswers: {},
  score: 0,
  timeRemaining: null,

  startQuiz: async (mode = 'practice', options = {}) => {
    set({ status: 'loading', mode: mode as any });

    // Fetch questions from Supabase
    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true);
      
    // Future filtering e.g. options.category or options.source_exam
    if (options.category) {
      query = query.eq('category', options.category);
    }
    if (options.source) {
      query = query.eq('source', options.source);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching questions:', error);
      set({ status: 'idle' });
      return;
    }

    // Local Shuffle
    const fetchedQuestions = data as Question[] || [];
    const shuffled = fetchedQuestions.sort(() => 0.5 - Math.random());

    // Determine counts and timer based on mode
    let finalQuestions = shuffled;
    let timer = null;

    if (mode === 'simulation') {
      finalQuestions = shuffled.slice(0, 80);
      timer = 150 * 60; // 150 minutes in seconds
    } else if (mode === 'quick') {
      finalQuestions = shuffled.slice(0, 10);
    } else if (mode === 'practice') {
      finalQuestions = shuffled.slice(0, 20); // Practice can be infinite, but limit to 20 for now
    }

    set({
      status: 'in-progress',
      questions: finalQuestions,
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
      timeRemaining: timer,
    });
  },

  tick: () => {
    const { timeRemaining, status, finishQuiz } = get();
    if (status !== 'in-progress' || timeRemaining === null) return;
    
    if (timeRemaining <= 1) {
      // Time's up
      set({ timeRemaining: 0 });
      finishQuiz();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
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
      console.log('Guest user finished the quiz. Saving session to localStorage.');
      
      try {
        const guestSessions = JSON.parse(localStorage.getItem('nitsforge_guest_sessions') || '[]');
        
        guestSessions.push({
          questions,
          selectedAnswers,
          finalScore,
          completedAt: new Date().toISOString()
        });
        
        localStorage.setItem('nitsforge_guest_sessions', JSON.stringify(guestSessions));
      } catch (err) {
        console.error('Failed to save guest session to localStorage', err);
      }
      return;
    }

    // Insert into quiz_sessions
    const accuracyRate = questions.length > 0 ? (finalScore / questions.length) * 100 : 0;
    const { mode } = get();
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        mode: mode,
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
      mode: 'practice',
      questions: [],
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
      timeRemaining: null,
    });
  }
}));