import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Language } from '../types';
import {
  User,
  Save,
  CheckCircle2,
  Code2,
  Briefcase,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [targetRole, setTargetRole] = useState(user?.profile?.targetRole || 'Full Stack Software Engineer');
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.profile?.yearsOfExperience || 2);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(user?.profile?.preferredLanguage || 'javascript');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.updateProfile({
        name,
        bio,
        targetRole,
        yearsOfExperience: Number(yearsOfExperience),
        preferredLanguage
      });
      updateUser(res.user);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal details, engineering specialization, and preferred coding environment.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-5">
          {/* Avatar and basic info */}
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
            <img
              src={user?.profile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'user')}`}
              alt={name}
              className="w-16 h-16 rounded-2xl bg-dark-900 border border-purple-500/40 p-1"
            />
            <div>
              <h3 className="text-base font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-300">Candidate Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-300">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={30}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-300">Preferred Programming Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as Language)}
              className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3.10</option>
              <option value="java">Java (OpenJDK)</option>
              <option value="cpp">C++ (GCC)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-300">Candidate Bio & Goals</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your technical specialties, preparation roadmap, or dream companies..."
              className="w-full bg-dark-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

