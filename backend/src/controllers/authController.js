import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function register(req, res) {
  try {
    const { name, email, password, targetRole, yearsOfExperience } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      profile: {
        bio: 'Aspiring candidate preparing with CodeArena AI.',
        targetRole: targetRole || 'Full Stack Software Engineer',
        yearsOfExperience: Number(yearsOfExperience) || 2,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        preferredLanguage: 'javascript'
      },
      stats: {
        interviewsCompleted: 0,
        problemsSolved: 0,
        totalScoreSum: 0,
        totalTokensUsed: 0,
        totalDurationSeconds: 0
      }
    });

    const secret = process.env.JWT_SECRET || 'codearena_jwt_secret_super_secure_key_2026';
    const token = jwt.sign({ userId: user._id || user.id }, secret, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        stats: user.stats
      }
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET || 'codearena_jwt_secret_super_secure_key_2026';
    const token = jwt.sign({ userId: user._id || user.id }, secret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        stats: user.stats
      }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve user profile.' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, bio, targetRole, yearsOfExperience, preferredLanguage, avatar } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedProfile = {
      ...user.profile,
      ...(bio !== undefined && { bio }),
      ...(targetRole !== undefined && { targetRole }),
      ...(yearsOfExperience !== undefined && { yearsOfExperience: Number(yearsOfExperience) }),
      ...(preferredLanguage !== undefined && { preferredLanguage }),
      ...(avatar !== undefined && { avatar })
    };

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      {
        ...(name && { name }),
        profile: updatedProfile
      },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        profile: updated.profile,
        stats: updated.stats
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  // In demo / private deployment, provide friendly simulation
  res.json({
    message: `Password reset instructions have been dispatched to ${email || 'your registered address'}. Please check your inbox.`
  });
}

