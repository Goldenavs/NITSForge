// src/data/mockQuestions.ts

export type QuestionCategory =
  | 'Basic Theory of Information'
  | 'Computer Architecture'
  | 'Operating Systems'
  | 'Data Structures & Algorithms'
  | 'Databases'
  | 'Networking & Communication'
  | 'Information Security'
  | 'Software Engineering & Development';

export interface Question {
  source?: string;
  id: string;
  text: string;
  options: { A: string; B: string; C: string; D: string; };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  category: QuestionCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  exam_period?: string;
  tags?: string[];
}

export const mockQuestions: Question[] = [
  {
    id: 'FE-DS-001',
    category: 'Data Structures & Algorithms',
    difficulty: 'easy',
    text: 'Which data structure uses a LIFO (Last-In, First-Out) method for adding and removing elements?',
    options: {
      A: 'Queue',
      B: 'Stack',
      C: 'Linked List',
      D: 'Binary Tree'
    },
    correct_answer: 'B',
    explanation: 'A stack operates on a Last-In, First-Out (LIFO) principle. The last element added to the stack is the first one to be removed, much like a stack of plates.',
    source: 'Spring 2024'
  },
  {
    id: 'FE-NET-001',
    category: 'Networking & Communication',
    difficulty: 'medium',
    text: 'In the OSI reference model, which layer is responsible for routing packets to their destination network?',
    options: {
      A: 'Data Link Layer',
      B: 'Transport Layer',
      C: 'Network Layer',
      D: 'Session Layer'
    },
    correct_answer: 'C',
    explanation: 'The Network Layer (Layer 3) handles logical addressing (IP addresses) and routing, determining the best path for data packets to travel across networks.',
    source: 'Fall 2023'
  },
  {
    id: 'FE-SEC-001',
    category: 'Information Security',
    difficulty: 'medium',
    text: 'Which of the following best describes a "Salting" technique in cryptography?',
    options: {
      A: 'Encrypting a password twice using two different algorithms.',
      B: 'Adding random data to a password before hashing it to defend against dictionary attacks.',
      C: 'Compressing a file before applying a digital signature.',
      D: 'Storing cryptographic keys on a physically separate hardware device.'
    },
    correct_answer: 'B',
    explanation: 'Salting involves appending random data (a salt) to a password before running it through a hash function. This ensures that two users with the same password will have different hashes, thwarting rainbow table and dictionary attacks.',
    source: 'Spring 2023'
  }
];