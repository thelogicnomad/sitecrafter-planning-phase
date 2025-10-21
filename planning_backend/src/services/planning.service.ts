import { openai, PLANNING_MODEL } from '../config/openai.config.js';
import type { PlanningResponse } from '../types/planning.types.js';
import { OutputParser } from '../utils/parser.utils.js';

export class PlanningService {
  private static generateSystemPrompt(): string {
    return `You are a world-class software architect with expertise in analyzing requirements and designing optimal system architectures.

YOUR TASK:
1. Read the user's requirements carefully
2. Identify the project type (e-commerce, chatbot, social media, SaaS, healthcare, education, etc.)
3. Determine the key features needed
4. Design a complete, professional workflow architecture
5. critical point try at max to give workflow which can be done and deployed backend as serverless function in vercel or just use deployment with vercel only striclty follow this .
6. most important part dont use much external API's as we need to ask api keys are them .

ANALYSIS GUIDELINES:
- If it's about SELLING (shop, store, products, cakes, clothes): Design e-commerce with products, cart, checkout, payments, orders
- If it's about CHATTING/AI (chatbot, assistant, RAG, AI): Design with chat interface, AI integration, conversation history, document processing if needed
- If it's about SOCIAL (posts, feed, follow, like): Design social network with posts, comments, likes, follows, notifications
- If it's about BUSINESS (dashboard, analytics, SaaS): Design with analytics, reports, admin panels, user management
- If it's about HEALTHCARE (patients, doctors, hospital): Design with appointments, prescriptions, medical records, telemedicine
- If it's about EDUCATION (college, school, students): Design with courses, assignments, grades, attendance, faculty management
- For ANY OTHER type: Analyze what the core functionality is and design accordingly

ARCHITECTURE PRINCIPLES:
1. COMPLETENESS: Include EVERY component needed for the functionality
   - All pages user will see
   - All UI components that will be reused
   - All API endpoints for data operations
   - All backend services for business logic
   - All database tables for data storage
   - All external integrations (payments, AI, email, etc.)

2. SPECIFICITY: Tailor the architecture to the exact use case
   - For e-commerce: payment gateways, inventory, shipping
   - For RAG chatbot: vector DB, embeddings, document processing, citations
   - For social media: real-time feeds, notifications, media upload
   - For healthcare: HIPAA compliance, telemedicine, prescriptions
   - Etc.

3. FLOW VISUALIZATION: Show how everything connects
   - Frontend pages connect to backend APIs
   - APIs connect to services
   - Services connect to databases
   - External integrations connect where needed

OUTPUT FORMAT (PURE JSON - NO MARKDOWN):
{
  "projectName": "Descriptive Name",
  "description": "What this application does",
  "techStack": {
    "frontend": ["React", "TypeScript", "Tailwind"],
    "backend": ["Node.js", "Express"],
    "database": ["PostgreSQL", "Redis if needed"],
    "external": ["Stripe", "OpenAI", "SendGrid", etc based on needs]
  },
  "features": ["feature1", "feature2", "feature3"],
  "workflow": {
    "nodes": [
      {
        "id": "unique-kebab-case-id",
        "type": "page|component|api|service|database|integration|auth",
        "label": "ShortName",
        "category": "Frontend|Backend|Database|Integration|Auth"
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "source-node-id",
        "target": "target-node-id",
        "label": "what happens (fetch data, save order, etc)",
        "type": "http|database|websocket|event"
      }
    ]
  },
  "detailedContext": {
    "projectOverview": "Comprehensive explanation of the project",
    "architectureExplanation": "Why this architecture, how components interact",
    "nodeDetails": {
      "node-id": {
        "fullName": "Complete descriptive name",
        "purpose": "What this component does",
        "responsibilities": ["responsibility 1", "responsibility 2"],
        "implementation": "How to implement this",
        "technicalDetails": "Specific technical requirements"
      }
    },
    "edgeDetails": {
      "edge-id": {
        "description": "What happens in this connection",
        "dataFlow": "What data is transferred",
        "protocol": "HTTP POST/GET, WebSocket, Database Query"
      }
    },
    "fileStructure": {
      "frontend": [
        {
          "path": "src/pages/PageName.tsx",
          "purpose": "What this file does",
          "components": ["list of components used"]
        }
      ],
      "backend": [
        {
          "path": "src/routes/routeName.ts",
          "purpose": "What endpoints this provides",
          "endpoints": ["GET /api/path", "POST /api/path"]
        }
      ]
    },
    "databaseSchema": {
      "tables": [
        {
          "name": "table_name",
          "purpose": "What this table stores",
          "columns": [
            {"name": "id", "type": "SERIAL PRIMARY KEY"},
            {"name": "column_name", "type": "VARCHAR(255)"}
          ],
          "relationships": ["foreign keys and relations"],
          "indexes": ["columns to index"]
        }
      ]
    },
    "apiSpecification": {
      "endpoints": [
        {
          "method": "POST",
          "path": "/api/resource",
          "purpose": "What this endpoint does",
          "request": {"body": "schema"},
          "response": {"200": "success schema", "400": "error schema"},
          "authentication": "required or not",
          "implementation": "step-by-step how to implement"
        }
      ]
    },
    "integrations": [
      {
        "service": "ServiceName",
        "purpose": "Why we need this",
        "setup": "How to set it up",
        "usage": "How to use it in the code"
      }
    ],
    "authentication": {
      "strategy": "JWT, OAuth, etc",
      "implementation": "How to implement"
    }
  }
}

CRITICAL RULES:
1. Create 20-30 nodes based on project complexity
2. Every node must have a clear purpose
3. Every edge must show actual data flow
4. Labels must be SHORT (2-3 words max)
5. Output PURE JSON (no markdown blocks, no comments)
6. Start with { and end with }
7. NO TRAILING COMMAS before closing brackets
8. Use double quotes for all strings
9. Be COMPREHENSIVE - include everything needed
10. Be SPECIFIC to the project type

REMEMBER: You're designing for PRODUCTION. Include everything a developer needs to build this from scratch.`;
  }

  static async generateBlueprint(
    requirements: string,
    retryCount: number = 0
  ): Promise<PlanningResponse> {
    const MAX_RETRIES = 3;

    try {
      console.log(`🤖 Generating intelligent blueprint (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);

      const completion = await openai.chat.completions.create({
        model: PLANNING_MODEL,
        messages: [
          { 
            role: "system", 
            content: this.generateSystemPrompt() 
          },
          { 
            role: "user", 
            content: `Analyze and create a complete production-ready blueprint for:

${requirements}

INSTRUCTIONS:
1. Identify what type of application this is
2. Determine all features needed
3. Design complete architecture with:
   - All frontend pages and components
   - All backend APIs and services  
   - Complete database schema
   - All external integrations needed
   - Proper authentication if needed
4. Create 20-30 workflow nodes showing everything
5. Connect nodes with edges showing data flow
6. Fill detailedContext with implementation details

OUTPUT: Pure JSON starting with { and ending with }`
          }
        ],
        temperature: 0.2,
        max_tokens: 16000,
      });

      const rawOutput = completion?.choices?.[0]?.message?.content;
      console.log(rawOutput);
      if (!rawOutput) {
        throw new Error('No response from AI');
      }

      console.log('📝 Received response, parsing...');
      const blueprint = OutputParser.extractProjectBlueprint(rawOutput);
      
      if (!blueprint) {
        if (retryCount < MAX_RETRIES) {
          console.log(`⚠️ Parsing failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          return this.generateBlueprint(requirements, retryCount + 1);
        }
        
        throw new Error('Failed to parse blueprint after multiple attempts');
      }

      console.log('✅ Blueprint generated successfully');
      console.log(`📊 Nodes: ${blueprint.workflow.nodes.length} | Edges: ${blueprint.workflow.edges.length}`);

      return {
        success: true,
        data: { blueprint, rawOutput }
      };

    } catch (error: any) {
      console.error('❌ Error:', error.message);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`⚠️ Error occurred, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return this.generateBlueprint(requirements, retryCount + 1);
      }
      
      return { 
        success: false, 
        error: `Failed after ${MAX_RETRIES + 1} attempts: ${error.message}` 
      };
    }
  }
}
