// src/store/useQuizStore.ts
import { create } from 'zustand';
import { type Question } from '../data/mockQuestions';
import { supabase } from '../services/supabase';

interface QuizState {
  // State
  status: 'idle' | 'loading' | 'in-progress' | 'finished';
  mode: 'zen' | 'practice' | 'quick' | 'topic' | 'date' | 'missed' | 'simulation' | 'speed' | 'survival' | 'sandbox' | 'ai-generated' | 'daily-challenge';
  questions: Question[];
  currentIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  xpEarned: number;
  timeRemaining: number | null;
  timeSpent: number;
  endTime: number | null;
  lives: number | null;
  aiAllowed: boolean | null;
  abortController: AbortController | null;
  aiGenerationError: string | null;

  // Actions
  startQuiz: (mode?: string, options?: any) => Promise<void>;
  clearAiError: () => void;
  answerQuestion: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
  abandonQuiz: () => void;
  tick: () => void;
  deductLife: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  status: 'idle',
  mode: 'practice',
  questions: [],
  currentIndex: 0,
  selectedAnswers: {},
  score: 0,
  xpEarned: 0,
  timeRemaining: null,
  timeSpent: 0,
  endTime: null,
  lives: null,
  aiAllowed: null,
  abortController: null,
  aiGenerationError: null,

  clearAiError: () => set({ aiGenerationError: null }),

  startQuiz: async (mode = 'practice', options: any = {}) => {
    set({ status: 'loading', mode: mode as any, timeSpent: 0, xpEarned: 0, aiAllowed: options?.aiAllowed ?? true });

    let finalQuestions: Question[] = [];
    let timer: number | null = null;
    let endTime: number | null = null;

    if (mode === 'daily-challenge') {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("Must be logged in for daily challenge");
        set({ status: 'idle' });
        return;
      }

      const { data, error } = await supabase.rpc('get_adaptive_daily_challenge', { p_user_id: userId });

      if (error) {
        console.error('Error fetching daily challenge:', error);
        alert(error.message); // e.g. "Daily challenge already completed today."
        set({ status: 'idle' });
        return;
      }

      finalQuestions = data as Question[] || [];
    } else if (mode === 'missed') {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("Must be logged in for missed questions");
        set({ status: 'idle' });
        return;
      }

      const reqCount = options?.questionCount || 30;
      const { data, error } = await supabase.rpc('get_missed_questions', { p_user_id: userId, p_limit: reqCount });

      if (error) {
        console.error('Error fetching missed questions:', error);
        alert("Failed to fetch missed questions. Please try again.");
        set({ status: 'idle' });
        return;
      }

      if (!data || data.length === 0) {
        alert("Great job! You don't have any missed questions on record.");
        set({ status: 'idle' });
        return;
      }

      // Shuffle locally in case they want a random order (though RPC does random too)
      const fetched = data as Question[] || [];
      finalQuestions = fetched.sort(() => 0.5 - Math.random());
    } else if (mode === 'ai-generated') {
      const controller = new AbortController();
      set({ abortController: controller });

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          set({ status: 'idle', abortController: null, aiGenerationError: "You must be logged in to use AI Generation." });
          return;
        }

        const res = await fetch('http://localhost:5000/api/ai/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            topics: options?.topics || [],
            difficulty: options?.aiDifficulty || 'medium',
            count: options?.questionCount || 10
          }),
          signal: controller.signal
        });

        if (!res.ok) {
          const errData = await res.json();
          set({ 
             status: 'idle', 
             abortController: null, 
             aiGenerationError: errData.error || "Failed to generate AI quiz." 
          });
          return;
        }

        const data = await res.json();
        finalQuestions = data.questions || [];
        
        // Track success in localStorage to power UI countdowns
        localStorage.setItem('forge_last_ai_generation', Date.now().toString());

        set({ abortController: null });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("AI Generation aborted by user.");
        } else {
          console.error("Failed to fetch AI questions:", err);
          set({ status: 'idle', abortController: null, aiGenerationError: "An error occurred during AI synthesis. Please try again." });
          return;
        }
        set({ status: 'idle', abortController: null });
        return;
      }
    } else {
      // Fetch questions from Supabase
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .limit(10000); // Bypass default 1000 row limit for true random shuffle

      // Future filtering e.g. options.category or options.source_exam
      if (options?.category) {
        query = query.eq('category', options.category);
      }
      if (options?.source) {
        query = query.eq('source', options.source);
      }

      // Push Topic filter to database to bypass 1000-row pagination limit
      if (options?.topics && options.topics.length > 0) {
        const topicMap: Record<string, string> = {
          'math': 'Basic Theory of Information',
          'arch': 'Computer Architecture',
          'os': 'Operating Systems',
          'ds': 'Data Structures & Algorithms',
          'db': 'Databases',
          'net': 'Networking & Communication',
          'sec': 'Information Security',
          'se': 'Software Engineering & Development',
          'strat': 'Strategy',
          'mgmt': 'Management'
        };
        const selectedTitles = options.topics.map((id: string) => topicMap[id]);
        query = query.in('category', selectedTitles);
      }

      // Push Date filter to database
      if (options?.dates && options.dates.length > 0) {
        const selectedDates = options.dates.map((d: string) => d.replace(" (latest)", "").trim());
        // Use ilike to handle case-insensitivity and potential leading/trailing whitespace in DB
        const orQuery = selectedDates.map((d: any) => `exam_period.ilike.%${d}%,source.ilike.%${d}%`).join(',');
        query = query.or(orQuery);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        set({ status: 'idle' });
        return;
      }

      // Local Shuffle
      const fetchedQuestions = data as Question[] || [];
      let filteredQuestions = [...fetchedQuestions];

      // Perform a secondary robust local filter just in case
      if (options?.dates && options.dates.length > 0) {
        const selectedDates = options.dates.map((d: string) => d.replace(" (latest)", "").trim().toLowerCase());
        filteredQuestions = filteredQuestions.filter(q => {
          const ep = (q.exam_period || "").trim().toLowerCase();
          const src = (q.source || "").trim().toLowerCase();
          return (ep && selectedDates.some((d: string) => ep.includes(d))) ||
            (src && selectedDates.some((d: string) => src.includes(d)));
        });
      }

      const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
      finalQuestions = shuffled;

      // Determine counts and timer based on mode
      if (mode === 'zen') {
        finalQuestions = shuffled; // infinite/all
      } else if (mode === 'practice') {
        finalQuestions = shuffled.slice(0, options?.questionCount || 30);
      } else if (mode === 'quick') {
        finalQuestions = shuffled.slice(0, options?.questionCount || 10);
        timer = finalQuestions.length * 60; // 1 min per question
      } else if (mode === 'topic' || mode === 'date') {
        const reqCount = options?.questionCount || 30;
        finalQuestions = shuffled.slice(0, reqCount);
        timer = finalQuestions.length * 60; // 1 min per actual question
      } else if (mode === 'missed') {
        timer = finalQuestions.length * 60; // 1 min per actual question
      } else if (mode === 'simulation') {
        finalQuestions = shuffled.slice(0, 100);
        timer = 150 * 60; // 150 minutes in seconds
        endTime = Date.now() + timer * 1000;
      } else if (mode === 'speed') {
        finalQuestions = shuffled.slice(0, options?.questionCount || 30);
        timer = finalQuestions.length * 30; // tight: 30 secs per question
      } else if (mode === 'survival') {
        finalQuestions = shuffled;
        set({ lives: 3 });
      } else if (mode === 'sandbox') {
        finalQuestions = shuffled.slice(0, options?.questionCount || 30);
        timer = options?.timerMinutes ? options.timerMinutes * 60 : null;
      } else {
        // Fallback
        finalQuestions = shuffled.slice(0, 20);
      }
    }

    set({
      status: 'in-progress',
      questions: finalQuestions,
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
      timeRemaining: timer,
      endTime: endTime,
      // lives is only set for survival mode above, otherwise it stays null or current value (which should be null)
      lives: mode === 'survival' ? 3 : null,
      aiAllowed: options?.aiAllowed ?? true,
    });
  },

  tick: () => {
    const state = get();
    const { timeRemaining, status, finishQuiz, mode, endTime, timeSpent } = state;

    if (status !== 'in-progress') return;

    // Always increment timeSpent if in progress
    set({ timeSpent: timeSpent + 1 });

    if (timeRemaining === null) return; // Untimed modes

    let newTimeRemaining = timeRemaining;

    if (mode === 'simulation' && endTime !== null) {
      newTimeRemaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    } else {
      newTimeRemaining = timeRemaining - 1;
    }

    if (newTimeRemaining <= 0) {
      set({ timeRemaining: 0 });
      finishQuiz();
    } else {
      set({ timeRemaining: newTimeRemaining });
    }
  },

  answerQuestion: (questionId, answer) => {
    set((state) => {
      const question = state.questions.find(q => q.id === questionId);
      const isCorrect = question?.correct_answer === answer;
      let newLives = state.lives;

      if (state.mode === 'survival' && !isCorrect && newLives !== null) {
        newLives = Math.max(0, newLives - 1);
      }

      return {
        selectedAnswers: { ...state.selectedAnswers, [questionId]: answer },
        lives: newLives
      };
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions, mode, lives } = get();

    if (mode === 'survival' && lives === 0) {
      get().finishQuiz();
      return;
    }

    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      get().finishQuiz();
    }
  },

  previousQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  jumpToQuestion: (index: number) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index });
    }
  },

  deductLife: () => {
    const { lives, finishQuiz } = get();
    if (lives !== null && lives > 0) {
      const newLives = lives - 1;
      set({ lives: newLives });
      if (newLives === 0) {
        finishQuiz();
      }
    }
  },

  finishQuiz: async () => {
    const { questions, selectedAnswers, mode, currentIndex } = get();

    // For infinite modes, we truncate the questions array to what the user actually reached.
    const finalQuestions = (mode === 'survival' || mode === 'zen')
      ? questions.slice(0, currentIndex + 1)
      : questions;

    // Filter out unattempted questions so we don't flood stats
    const attemptedQuestions = finalQuestions.filter(q => selectedAnswers[q.id] !== undefined);
    let finalScore = 0;

    // Calculate final score based only on attempted questions
    attemptedQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        finalScore += 1;
      }
    });

    set({ status: 'finished', score: finalScore, questions: finalQuestions });

    // Grab the current user session
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Calculate a fallback xpEarned for guests or non-saved modes
    let fallbackXp = finalScore * 5;
    if (mode === 'simulation') fallbackXp += 100;
    if (mode === 'topic') fallbackXp += 30;
    if (mode === 'daily-challenge') fallbackXp += 50;
    if (attemptedQuestions.length > 0 && finalScore === attemptedQuestions.length) fallbackXp += 25;

    // Do not save Practice, Zen, Sandbox, or AI runs to the database or local history
    if (mode === 'practice' || mode === 'zen' || mode === 'sandbox' || mode === 'ai-generated') {
      set({ xpEarned: 0 }); // No XP for practice/zen/sandbox/ai
      return;
    }

    if (!userId) {
      console.log('Guest user finished the quiz. Saving session to localStorage.');
      set({ xpEarned: fallbackXp });


      try {
        const guestSessions = JSON.parse(localStorage.getItem('nitsforge_guest_sessions') || '[]');

        guestSessions.push({
          questions: attemptedQuestions,
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
    const accuracyRate = attemptedQuestions.length > 0 ? (finalScore / attemptedQuestions.length) * 100 : 0;
    const xpMultiplier = mode === 'daily-challenge' ? 2 : 1;

    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        mode: mode,
        total_questions: attemptedQuestions.length,
        correct_answers: finalScore,
        accuracy_rate: accuracyRate,
        xp_earned: finalScore * 10 * xpMultiplier,
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (sessionError) {
      console.error('Error saving quiz session:', sessionError);
      return;
    }

    // Update last_daily_challenge_date if it was a daily challenge
    if (mode === 'daily-challenge') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ last_daily_challenge_date: new Date().toISOString().split('T')[0] })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating daily challenge date:', profileError);
      }
    }

    // Insert into session_answers
    const sessionId = sessionData.id;

    // Prepare answers for batch insert
    const sessionAnswers = attemptedQuestions.map((q) => ({
      session_id: sessionId,
      user_id: userId,
      question_id: q.id,
      selected_answer: selectedAnswers[q.id],
      is_correct: selectedAnswers[q.id] === q.correct_answer,
    }));

    if (sessionAnswers.length > 0) {
      const { error: answersError } = await supabase
        .from('session_answers')
        .insert(sessionAnswers);

      if (answersError) {
        console.error('Error saving session answers:', answersError);
      }
    }

    // Call the Postgres RPC Gamification & Streak Engine
    const { data: gamificationResult, error: rpcError } = await supabase
      .rpc('process_quiz_completion', {
        p_session_id: sessionId,
        p_user_id: userId
      });

    if (rpcError) {
      console.error('Error processing gamification engine:', rpcError);
      set({ xpEarned: fallbackXp });
    } else {
      console.log('Gamification updated:', gamificationResult);
      if (gamificationResult && gamificationResult.xp_earned !== undefined) {
        set({ xpEarned: gamificationResult.xp_earned });
      } else {
        set({ xpEarned: fallbackXp });
      }
    }
  },

  resetQuiz: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({
      status: 'idle',
      mode: 'practice',
      questions: [],
      currentIndex: 0,
      selectedAnswers: {},
      score: 0,
      xpEarned: 0,
      timeRemaining: null,
      timeSpent: 0,
      endTime: null,
      lives: null,
      aiAllowed: null,
      abortController: null,
    });
  },

  abandonQuiz: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({ status: 'idle', abortController: null });
  }
}));