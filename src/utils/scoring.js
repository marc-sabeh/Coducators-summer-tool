import { questions } from '../data/questions';

const PROFILE_ORDER = ['creative', 'engineer', 'gameDesigner', 'aiExplorer', 'leader'];

// answers: array of 7 answer indices (0-4) or null
export function calculateScores(answers) {
  const scores = { creative: 0, engineer: 0, gameDesigner: 0, aiExplorer: 0, leader: 0 };
  answers.forEach((idx, qIndex) => {
    if (idx == null) return;
    const answer = questions[qIndex]?.answers[idx];
    if (!answer) return;
    Object.entries(answer.scores).forEach(([k, v]) => {
      if (k in scores) scores[k] += v;
    });
  });
  return scores;
}

// Returns winning profile key. Uses Q12 (index 11) as tiebreaker.
export function getWinningProfile(scores, answers) {
  const max = Math.max(...Object.values(scores));
  const tied = PROFILE_ORDER.filter(k => scores[k] === max);
  if (tied.length === 1) return tied[0];

  // Q7 tiebreaker (index 6): A=creative B=engineer C=gameDesigner D=aiExplorer E=leader
  const q12 = answers[6];
  if (q12 != null) {
    const tieProfile = PROFILE_ORDER[q12];
    if (tied.includes(tieProfile)) return tieProfile;
  }
  return tied[0];
}

// Returns top 3 profile keys by score
export function getTopStrengths(scores) {
  return [...PROFILE_ORDER].sort((a, b) => scores[b] - scores[a]).slice(0, 3);
}
