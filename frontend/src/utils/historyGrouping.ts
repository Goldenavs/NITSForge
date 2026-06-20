import type { AnswerHistoryRecord } from '../hooks/useHistory';

export interface GroupedAttempt {
  session_id: string;
  session_mode: string;
  answered_at: string; // The time of the most recent answer in this attempt
  questions: AnswerHistoryRecord[];
}

export interface GroupedDate {
  dateStr: string;
  dateObj: Date;
  attempts: GroupedAttempt[];
}

/**
 * Formats a Date object into a readable date string (e.g. "Jun 20, 2026")
 */
function formatDateString(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Groups a flat array of history records into a nested structure: Date -> Attempt -> Questions
 */
export function groupHistoryByDateAndAttempt(records: AnswerHistoryRecord[]): GroupedDate[] {
  const dateMap = new Map<string, Map<string, GroupedAttempt>>();

  for (const record of records) {
    const dateObj = new Date(record.answered_at);
    const dateStr = formatDateString(dateObj);

    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, new Map<string, GroupedAttempt>());
    }

    const attemptsMap = dateMap.get(dateStr)!;

    if (!attemptsMap.has(record.session_id)) {
      attemptsMap.set(record.session_id, {
        session_id: record.session_id,
        session_mode: record.session_mode,
        answered_at: record.answered_at,
        questions: []
      });
    }

    const attempt = attemptsMap.get(record.session_id)!;
    attempt.questions.push(record);

    // Update the attempt's answered_at to the most recent question's time if necessary
    if (new Date(record.answered_at).getTime() > new Date(attempt.answered_at).getTime()) {
      attempt.answered_at = record.answered_at;
    }
  }

  // Convert the Maps back into an array structure and sort them descending
  const groupedDates: GroupedDate[] = [];

  for (const [dateStr, attemptsMap] of dateMap.entries()) {
    const attempts = Array.from(attemptsMap.values());

    // Sort attempts within the date descending by answered_at
    attempts.sort((a, b) => new Date(b.answered_at).getTime() - new Date(a.answered_at).getTime());

    // Sort questions within the attempt descending by answered_at
    attempts.forEach(attempt => {
      attempt.questions.sort((a, b) => new Date(b.answered_at).getTime() - new Date(a.answered_at).getTime());
    });

    groupedDates.push({
      dateStr,
      dateObj: new Date(attempts[0].answered_at), // Representative date object for sorting
      attempts
    });
  }

  // Sort dates descending
  groupedDates.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  return groupedDates;
}
