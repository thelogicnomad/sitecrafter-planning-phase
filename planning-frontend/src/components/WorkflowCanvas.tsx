import React, { useMemo } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { WorkflowNode as WorkflowNodeType, WorkflowEdge } from '../types/planning.types';
import CustomNode from './CustomNode';

interface WorkflowCanvasProps {
  nodes: WorkflowNodeType[];
  edges: WorkflowEdge[];
}

const nodeTypes = {
  custom: CustomNode,
};

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ nodes: workflowNodes, edges: workflowEdges }) => {
  
  /**
   * ✅ SMART LAYERED LAYOUT - Organize by category in vertical layers
   */
  const calculateSmartLayout = (nodes: WorkflowNodeType[]) => {
    // Group nodes by category
    const layers: Record<string, WorkflowNodeType[]> = {
      'Frontend': [],
      'Backend': [],
      'Database': [],
      'Integration': [],
      'Auth': []
    };

    nodes.forEach(node => {
      if (node.category && layers[node.category]) { // ✅ Added null check
        layers[node.category].push(node);
      } else {
        layers['Backend'].push(node); // Default fallback
      }
    });

    const positions: Record<string, { x: number; y: number }> = {};
    let currentY = 50;
    const layerSpacing = 220; // Vertical space between layers
    const nodeSpacing = 280; // Horizontal space between nodes

    // Layout order: Frontend → Backend → Database → Integration → Auth
    const layerOrder = ['Frontend', 'Backend', 'Database', 'Integration', 'Auth'];

    layerOrder.forEach(category => {
      const layerNodes = layers[category];
      if (layerNodes.length === 0) return;

      // Center nodes horizontally
      const layerWidth = layerNodes.length * nodeSpacing;
      let currentX = Math.max(50, (1400 - layerWidth) / 2); // Center in viewport

      layerNodes.forEach(node => {
        positions[node.id] = { x: currentX, y: currentY };
        currentX += nodeSpacing;
      });

      currentY += layerSpacing;
    });

    return positions;
  };

  // Calculate smart positions
  const positions = useMemo(() => calculateSmartLayout(workflowNodes), [workflowNodes]);

  const initialNodes: Node[] = useMemo(() => {
    return workflowNodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: positions[node.id] || { x: 0, y: 0 },
      data: {
        ...node,
        label: node.label,
        type: node.type,
        category: node.category,
      },
    }));
  }, [workflowNodes, positions]);

  const initialEdges: Edge[] = useMemo(() => {
    return workflowEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 25,
        height: 25,
        color: 
          edge.type === 'database' ? '#8b5cf6' : 
          edge.type === 'websocket' ? '#f59e0b' : 
          '#10b981',
      },
      style: {
        stroke: 
          edge.type === 'database' ? '#8b5cf6' : 
          edge.type === 'websocket' ? '#f59e0b' : 
          '#10b981',
        strokeWidth: 2.5,
        strokeDasharray: edge.type === 'database' ? '5, 5' : undefined,
      },
      labelStyle: {
        fontSize: 11,
        fontWeight: 600,
        fill: '#1e293b',
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.9,
        rx: 4,
        ry: 4,
      },
    }));
  }, [workflowEdges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes); // ✅ Removed unused setNodes
  const [edges, , onEdgesChange] = useEdgesState(initialEdges); // ✅ Removed unused setEdges

  // Count nodes by category
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    workflowNodes.forEach(node => {
      if (node.category) { // ✅ Added null check
        stats[node.category] = (stats[node.category] || 0) + 1;
      }
    });
    return stats;
  }, [workflowNodes]);

  return (
    <div className="card">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🏗️</span>
          Interactive Project Workflow
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            {nodes.length} Total Nodes
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
            {edges.length} Connections
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="flex gap-2 mb-4 text-xs flex-wrap">
        {Object.entries(categoryStats).map(([category, count]) => (
          <div key={category} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className={`w-3 h-3 rounded-full ${
              category === 'Frontend' ? 'bg-blue-500' :
              category === 'Backend' ? 'bg-green-500' :
              category === 'Database' ? 'bg-purple-500' :
              category === 'Integration' ? 'bg-orange-500' :
              'bg-red-500'
            }`}></span>
            <span className="font-medium">{category}: {count}</span>
          </div>
        ))}
      </div>
      
      {/* Canvas */}
      <div 
        className="rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-lg relative"
        style={{ height: '900px', width: '100%' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.15,
            includeHiddenNodes: false,
            minZoom: 0.5,
            maxZoom: 1.2,
          }}
          attributionPosition="bottom-left"
          minZoom={0.3}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1.5} 
            color="#cbd5e1"
          />
          <Controls 
            showInteractive={true}
            position="top-right"
          />
          <MiniMap 
            nodeColor={(node) => {
              const category = node.data?.category;
              if (category === 'Frontend') return '#3b82f6';
              if (category === 'Backend') return '#10b981';
              if (category === 'Database') return '#8b5cf6';
              if (category === 'Integration') return '#f59e0b';
              if (category === 'Auth') return '#ef4444';
              return '#6366f1';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-left"
            style={{
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />

         
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border-2 border-green-300">
          <div className="relative">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <div className="absolute top-0 left-0 w-4 h-0.5 bg-green-300 animate-pulse"></div>
          </div>
          <span className="font-semibold text-green-800">HTTP/REST</span>
        </div>
        
        <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-300">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-purple-500"></div>
          <span className="font-semibold text-purple-800">Database</span>
        </div>
        
        <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-300">
          <div className="w-4 h-1 bg-orange-500 rounded animate-pulse"></div>
          <span className="font-semibold text-orange-800">WebSocket</span>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm text-blue-900">
            <strong>Interactive Controls:</strong> Zoom with mouse wheel • Pan by dragging • 
            Use minimap (bottom-left) for navigation • Click nodes to see details • 
            All edges are animated showing data flow direction • Nodes organized by architecture layers
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCanvas;