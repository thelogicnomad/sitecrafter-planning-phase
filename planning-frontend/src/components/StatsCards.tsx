import React from 'react';
import type { PlanningPhase } from '../types/planning.types';
import { Layers, ListChecks, Calendar } from 'lucide-react';

interface StatsCardsProps {
  phases: PlanningPhase[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ phases }) => {
  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  
  const totalDays = phases.reduce((acc, phase) => {
    if (!phase.duration) return acc;
    const match = phase.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:scale-105 transition-transform">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Layers size={32} />
          </div>
          <div>
            <div className="text-4xl font-bold">{phases.length}</div>
            <div className="text-blue-100">Development Phases</div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105 transition-transform">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <ListChecks size={32} />
          </div>
          <div>
            <div className="text-4xl font-bold">{totalTasks}</div>
            <div className="text-green-100">Total Tasks</div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:scale-105 transition-transform">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Calendar size={32} />
          </div>
          <div>
            <div className="text-4xl font-bold">{totalDays}</div>
            <div className="text-purple-100">Estimated Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
