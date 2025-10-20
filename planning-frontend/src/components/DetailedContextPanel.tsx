import React, { useState } from 'react';
import { Copy, Check, Code2, Database, FileCode, Lock, Cloud } from 'lucide-react';
import type { DetailedContext } from '../types/planning.types';

interface DetailedContextPanelProps {
  context: DetailedContext;
}

const DetailedContextPanel: React.FC<DetailedContextPanelProps> = ({ context }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(context, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileCode },
    { id: 'nodes', label: 'Node Details', icon: Code2 },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API Spec', icon: Cloud },
    { id: 'auth', label: 'Auth', icon: Lock },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="text-indigo-600" size={28} />
          Detailed Context (For Code Generation AI)
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy JSON</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b-2 border-slate-200 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
          {activeTab === 'overview' && JSON.stringify({
            projectOverview: context.projectOverview,
            architectureExplanation: context.architectureExplanation
          }, null, 2)}
          
          {activeTab === 'nodes' && JSON.stringify(context.nodeDetails, null, 2)}
          {activeTab === 'database' && JSON.stringify(context.databaseSchema, null, 2)}
          {activeTab === 'api' && JSON.stringify(context.apiSpecification, null, 2)}
          {activeTab === 'auth' && JSON.stringify(context.authentication, null, 2)}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <p className="text-sm text-green-800 font-semibold">
          ✅ This detailed context contains EVERYTHING the code generation AI needs:
        </p>
        <ul className="mt-2 text-xs text-green-700 space-y-1">
          <li>• Complete file structure with implementation details</li>
          <li>• All API endpoints with request/response schemas</li>
          <li>• Database tables with exact column types</li>
          <li>• Component specifications with props and styling</li>
          <li>• Authentication flow and security implementation</li>
          <li>• Integration setup for external services</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailedContextPanel;
