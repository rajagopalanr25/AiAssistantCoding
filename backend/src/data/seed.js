import bcrypt from 'bcryptjs';
import { Problem, User } from '../models/index.js';
import { seedProblems } from './seedProblems.js';

export async function runSeed() {
  try {
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      console.log('[Seed] Seeding 12 interview problems into database...');
      await Problem.insertMany(seedProblems);
      console.log('✅ [Seed] Successfully seeded 12 problems.');
    } else {
      console.log(`[Seed] Database already contains ${problemCount} problems.`);
    }

    // Ensure demo user exists
    const demoUser = await User.findOne({ email: 'demo@codearena.ai' });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Alex Rivera',
        email: 'demo@codearena.ai',
        passwordHash,
        profile: {
          bio: 'Senior Full Stack Engineer preparing for Staff/Lead technical interviews.',
          targetRole: 'Senior Software Engineer',
          yearsOfExperience: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          preferredLanguage: 'javascript'
        },
        stats: {
          interviewsCompleted: 3,
          problemsSolved: 3,
          totalScoreSum: 265,
          totalTokensUsed: 3450,
          totalDurationSeconds: 4320
        }
      });
      console.log('✅ [Seed] Default demo user created: demo@codearena.ai (password: password123)');
    }
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
}

