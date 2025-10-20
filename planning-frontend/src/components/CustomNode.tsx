import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const categoryColors: Record<string, string> = {
  'Frontend': 'from-blue-500 to-blue-600',
  'Backend': 'from-green-500 to-green-600',
  'Database': 'from-purple-500 to-purple-600',
  'Integration': 'from-orange-500 to-orange-600',
  'Auth': 'from-red-500 to-red-600',
};

const categoryBorders: Record<string, string> = {
  'Frontend': 'border-blue-300',
  'Backend': 'border-green-300',
  'Database': 'border-purple-300',
  'Integration': 'border-orange-300',
  'Auth': 'border-red-300',
};

const typeIcons: Record<string, string> = {
  page: '📄',
  component: '🧩',
  api: '🔌',
  service: '⚙️',
  database: '🗄️',
  integration: '🔗',
  auth: '🔐',
  client: '💻',
  server: '🖥️',
};

const CustomNode = memo(({ data }: any) => {
  const colorGradient = categoryColors[data.category] || 'from-gray-500 to-gray-600';
  const borderColor = categoryBorders[data.category] || 'border-gray-300';
  const icon = typeIcons[data.type] || '📦';

  return (
    <div className={`px-5 py-3 shadow-xl rounded-xl bg-white border-2 ${borderColor} min-w-[180px] hover:shadow-2xl hover:scale-105 transition-all duration-200`}>
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-500 border-2 border-white" />
      
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorGradient} text-white shadow-md`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1">
          <div className="font-bold text-slate-800 text-sm leading-tight">{data.label}</div>
          <div className="text-xs text-slate-500">{data.type}</div>
        </div>
      </div>
      
      <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${colorGradient} bg-opacity-10 text-center font-medium mt-2`}>
        {data.category}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-green-500 border-2 border-white" />
    </div>
  );
});

export default CustomNode;
