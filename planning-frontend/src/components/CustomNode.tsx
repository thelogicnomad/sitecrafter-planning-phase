import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const categoryColors: Record<string, string> = {
  'Frontend': 'from-blue-500 to-blue-600',
  'Backend': 'from-green-500 to-green-600',
  'Database': 'from-purple-500 to-purple-600',
  'Integration': 'from-orange-500 to-orange-600',
  'Auth': 'from-red-500 to-red-600',
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
  const color = categoryColors[data.category] || 'from-gray-500 to-gray-600';
  const icon = typeIcons[data.type] || '📦';

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-slate-200 min-w-[160px] hover:shadow-xl transition-all">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <div className="text-2xl">{icon}</div>
        <div className="font-semibold text-slate-800 text-sm">{data.label}</div>
      </div>
      
      <div className="text-xs text-slate-500 mt-1">{data.category}</div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

export default CustomNode;
