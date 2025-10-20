import React, { useState } from 'react';
import { planningApi } from './services/api.service';
import type { ProjectBlueprint } from './types/planning.types';
import RequirementsForm from './components/RequirementsForm';
import WorkflowCanvas from './components/WorkflowCanvas';
import ApprovalPanel from './components/ApprovalPanel';
import DetailedContextPanel from './components/DetailedContextPanel';
import { AlertCircle, Rocket, Loader2 } from 'lucide-react';

type AppState = 'input' | 'generating' | 'review' | 'approved';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [requirements, setRequirements] = useState('');
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBlueprint = async (req: string) => {
    setRequirements(req);
    setState('generating');
    setError(null);

    const result = await planningApi.generateBlueprint(req);

    if (result.success && result.data?.blueprint) {
      setBlueprint(result.data.blueprint);
      setState('review');
    } else {
      setError(result.error || 'Failed to generate blueprint');
      setState('input');
    }
  };

  const handleApprove = () => {
    setState('approved');
    console.log('✅ Sending to Code Generation AI:');
    console.log(JSON.stringify(blueprint?.detailedContext, null, 2));
    // TODO: Pass blueprint.detailedContext to Code Generation Agent
  };

  const handleReject = () => {
    setBlueprint(null);
    setState('input');
  };

  const handleModify = async (feedback: string) => {
    setState('generating');
    await handleGenerateBlueprint(`${requirements}\n\nChanges: ${feedback}`);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="text-blue-600" size={48} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Project Builder
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Describe → Review Workflow → Generate Code
          </p>
        </header>

        {state === 'input' && (
          <RequirementsForm 
            onSubmit={handleGenerateBlueprint}
            loading={false}
          />
        )}

        {state === 'generating' && (
          <div className="card text-center py-16">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={64} />
            <h3 className="text-2xl font-bold mb-2">Creating Workflow...</h3>
            <p className="text-slate-600">Analyzing architecture and generating detailed context</p>
          </div>
        )}

        {error && (
          <div className="card bg-red-50 border-red-200 mb-8">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={24} />
              <div>
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {state === 'review' && blueprint && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <div className="text-4xl font-bold">{blueprint.workflow.nodes.length}</div>
                <div className="text-blue-100">Workflow Nodes</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <div className="text-4xl font-bold">{blueprint.workflow.edges.length}</div>
                <div className="text-green-100">Connections</div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <div className="text-4xl font-bold">{blueprint.features.length}</div>
                <div className="text-purple-100">Features</div>
              </div>
            </div>

            {/* Workflow Diagram */}
            <WorkflowCanvas 
              nodes={blueprint.workflow.nodes} 
              edges={blueprint.workflow.edges} 
            />

            {/* Approval */}
            <ApprovalPanel
              onApprove={handleApprove}
              onReject={handleReject}
              onModify={handleModify}
            />

            {/* Detailed Context (for developers/debugging) */}
            <DetailedContextPanel context={blueprint.detailedContext} />
          </div>
        )}

        {state === 'approved' && blueprint && (
          <div className="card text-center py-16 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-700 mb-4">Blueprint Approved!</h2>
            <p className="text-slate-600 mb-6">
              Sending {Object.keys(blueprint.detailedContext.nodeDetails).length} detailed specifications to Code Generation AI...
            </p>
            <Loader2 className="animate-spin mx-auto text-green-600" size={48} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
