import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface RequirementsFormProps {
  onSubmit: (requirements: string, projectType: string, techStack: string[]) => void;
  loading: boolean;
}

const RequirementsForm: React.FC<RequirementsFormProps> = ({ onSubmit, loading }) => {
  const [requirements, setRequirements] = useState('');
  const [projectType, setProjectType] = useState('fullstack');
  const [techStack, setTechStack] = useState('React, Node.js, PostgreSQL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirements.trim()) {
      onSubmit(
        requirements,
        projectType,
        techStack.split(',').map(t => t.trim()).filter(Boolean)
      );
    }
  };

  return (
    <div className="card mb-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Sparkles className="text-yellow-500" size={32} />
          Project Requirements
        </h2>
        <p className="text-slate-600">Describe your project and let AI plan it for you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Project Description
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g., Build a social media app with user authentication, posts, comments, and real-time notifications..."
            className="input-field min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="input-field"
            >
              <option value="fullstack">Full-Stack Application</option>
              <option value="web">Web Application</option>
              <option value="mobile">Mobile Application</option>
              <option value="api">API/Backend Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Node.js, PostgreSQL, Redis"
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !requirements.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Plan...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Planning
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RequirementsForm;
