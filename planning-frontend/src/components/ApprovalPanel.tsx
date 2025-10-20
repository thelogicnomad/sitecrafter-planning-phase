import React, { useState } from 'react';
import { Check, X, Edit } from 'lucide-react';

interface ApprovalPanelProps {
  onApprove: () => void;
  onReject: () => void;
  onModify: (feedback: string) => void;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({ onApprove, onReject, onModify }) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <h3 className="text-xl font-bold mb-4">✨ Review Project Blueprint</h3>
      <p className="text-slate-600 mb-6">
        Does this architecture look good? Approve to start code generation, or request changes.
      </p>

      {!showFeedback ? (
        <div className="flex gap-4">
          <button
            onClick={onApprove}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Check size={24} />
            Approve & Start Coding
          </button>

          <button
            onClick={() => setShowFeedback(true)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-yellow-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Edit size={24} />
            Request Changes
          </button>

          <button
            onClick={onReject}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-lg font-bold hover:from-red-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <X size={24} />
            Start Over
          </button>
        </div>
      ) : (
        <div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What would you like to change? E.g., 'Add authentication with OAuth', 'Use MongoDB instead of PostgreSQL', etc."
            className="input-field min-h-[120px] mb-4"
          />
          <div className="flex gap-4">
            <button
              onClick={() => onModify(feedback)}
              disabled={!feedback.trim()}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              Submit Changes
            </button>
            <button
              onClick={() => setShowFeedback(false)}
              className="px-6 py-3 border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPanel;
