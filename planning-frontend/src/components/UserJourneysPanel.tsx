import React from 'react';
import type { UserJourney } from '../types/planning.types';
import { MapPin, ArrowRight } from 'lucide-react';

interface UserJourneysPanelProps {
  journeys: UserJourney[];
}

const UserJourneysPanel: React.FC<UserJourneysPanelProps> = ({ journeys }) => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <MapPin className="text-purple-600" size={28} />
        User Journeys (How It Works)
      </h2>

      <div className="space-y-6">
        {journeys.map((journey, idx) => (
          <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">
              🎯 {journey.journey}
            </h3>

            <div className="space-y-4">
              {journey.steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 mb-1">
                      {step.action}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-700 mb-2 font-mono bg-white px-3 py-1 rounded-lg inline-block">
                      {step.flow.split('→').map((part, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <ArrowRight size={14} />}
                          <span>{part.trim()}</span>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed bg-white p-3 rounded-lg">
                      💡 {step.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserJourneysPanel;
