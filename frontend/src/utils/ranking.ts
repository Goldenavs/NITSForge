// src/utils/ranking.ts

/**
 * Calculates the user's current level based on total XP.
 * Formula: Level = floor((XP / 500) ^ (1 / 1.5)) + 1
 */
export const calculateLevel = (totalXp: number): number => {
  if (totalXp <= 0) return 1;
  return Math.floor(Math.pow(totalXp / 500, 1 / 1.5)) + 1;
};

/**
 * Calculates the total XP required to reach the NEXT level.
 * Formula: Required XP = 500 * (Current Level ^ 1.5)
 */
export const getNextLevelXp = (currentLevel: number): number => {
  return Math.ceil(500 * Math.pow(currentLevel, 1.5));
};

/**
 * Returns a rank title based on the current level.
 */
export const getRankTitle = (level: number): string => {
  if (level < 10) return 'IT Student';
  if (level < 20) return 'Junior Dev';
  if (level < 30) return 'Systems Analyst';
  if (level < 40) return 'IT Engineer';
  if (level < 50) return 'Senior Architect';
  return 'FE Grandmaster';
};
