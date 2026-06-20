require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixQuestions() {
  console.log('Fetching questions...');
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, correct_answer, options');

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  let updatedCount = 0;

  for (const q of questions) {
    let needsUpdate = false;
    let newCorrectAnswer = q.correct_answer;
    let newOptions = q.options;

    // Check if correct_answer is lowercase
    if (['a', 'b', 'c', 'd'].includes(q.correct_answer)) {
      newCorrectAnswer = q.correct_answer.toUpperCase();
      needsUpdate = true;
    }

    // Check if options has lowercase keys
    if (q.options && (q.options.a || q.options.b || q.options.c || q.options.d)) {
      newOptions = {
        A: q.options.a || q.options.A,
        B: q.options.b || q.options.B,
        C: q.options.c || q.options.C,
        D: q.options.d || q.options.D,
      };
      needsUpdate = true;
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({ correct_answer: newCorrectAnswer, options: newOptions })
        .eq('id', q.id);
        
      if (updateError) {
        console.error(`Error updating question ${q.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Successfully fixed ${updatedCount} questions.`);
}

fixQuestions();
