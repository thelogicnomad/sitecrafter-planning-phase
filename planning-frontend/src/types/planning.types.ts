export interface UserJourney {
  journey: string;
  steps: Array<{
    step: number;
    action: string;
    flow: string;
    explanation: string;
  }>;
}

export interface DetailedContext {
  projectOverview: string;
  architectureExplanation: string;
  nodeDetails: Record<string, any>;
  edgeDetails: Record<string, any>;
  fileStructure: any;
  databaseSchema: any;
  apiSpecification: any;
  componentSpecification: any;
  integrations: any[];
  authentication: any;
  deployment: any;
}

export interface PlanningPhase {
  phase: string;
  tasks: string[];
  reasoning: string;
  dependencies?: string[];
  duration?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'client' | 'server' | 'database' | 'api' | 'service' | 'integration' | 'auth' | 'page' | 'component';
  label: string;
  category?: 'Frontend' | 'Backend' | 'Database' | 'Integration' | 'Auth';
  description?: string;
  icon?: string;
  position?: { x: number; y: number };
  data?: {
    routes?: string[];
    models?: string[];
    endpoints?: string[];
    components?: string[];
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'default' | 'http' | 'websocket' | 'database';
}

export interface ProjectBlueprint {
  projectName: string;
  description: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    external: string[];
  };
  features: string[];
  workflow: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
  fileStructure: {
    path: string;
    type: 'file' | 'folder';
    children?: any[];
  }[];
  detailedContext: DetailedContext;
  phases?: PlanningPhase[];
}

export interface PlanningResponse {
  success: boolean;
  data?: {
    blueprint: ProjectBlueprint;
    rawOutput: string;
  };
  error?: string;
}