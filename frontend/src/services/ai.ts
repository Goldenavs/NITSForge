// src/services/ai.ts
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/ai';
import { supabase } from './supabase';

export interface ExplainRequest {
  questionText: string;
  options: Record<string, string>;
  correctAnswer: string;
  userAnswer?: string | null;
}

export async function explainQuestion(request: ExplainRequest): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error("You must be logged in to use Forge AI.");
    }

    const response = await fetch(`${API_BASE_URL}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch AI explanation.');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(error.message || "An unexpected error occurred while contacting Forge AI.");
  }
}
