import type { ProjectBlueprint } from '../types/planning.types.js';

export class OutputParser {
  /**
   * Extract project blueprint with multiple strategies
   */
  static extractProjectBlueprint(text: string): ProjectBlueprint | null {
    console.log('🔍 Starting JSON extraction...');
    
    // Strategy 1: Remove markdown code blocks
    let cleaned = this.removeCodeBlocks(text);
    let result = this.tryParse(cleaned, 'after removing code blocks');
    if (result) return result;

    // Strategy 2: Extract JSON between first { and last }
    cleaned = this.extractJSONBoundary(text);
    result = this.tryParse(cleaned, 'from JSON boundary');
    if (result) return result;

    // Strategy 3: Aggressive cleaning
    cleaned = this.aggressiveClean(text);
    result = this.tryParse(cleaned, 'after aggressive cleaning');
    if (result) return result;

    // Strategy 4: Fix common JSON errors
    cleaned = this.fixCommonErrors(this.extractJSONBoundary(text));
    result = this.tryParse(cleaned, 'after fixing common errors');
    if (result) return result;

    // Strategy 5: Last resort - try to build valid JSON
    cleaned = this.repairJSON(text);
    result = this.tryParse(cleaned, 'after JSON repair');
    if (result) return result;

    console.error('❌ All parsing strategies failed');
    return null;
  }

  /**
   * Remove markdown code blocks
   */
  private static removeCodeBlocks(text: string): string {
    // Remove code block markers
    let result = text.replace(/`{3}json\s*/gi, '');
    result = result.replace(/`{3}\s*/g, '');
    return result.trim();
  }

  /**
   * Extract text between first { and last }
   */
  private static extractJSONBoundary(text: string): string {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      return text;
    }
    
    return text.substring(firstBrace, lastBrace + 1);
  }

  /**
   * Aggressive cleaning
   */
  private static aggressiveClean(text: string): string {
    return text
      // Remove all comments
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix unquoted keys
      .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Fix common JSON errors
   */
  private static fixCommonErrors(text: string): string {
    return text
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, '$1')
      // Fix single quotes to double quotes
      .replace(/'/g, '"')
      // Remove comments
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Fix missing commas between array elements
      .replace(/}\s*{/g, '},{')
      .replace(/]\s*\[/g, '],[')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      .trim();
  }

  /**
   * Advanced JSON repair
   */
  private static repairJSON(text: string): string {
    let json = this.extractJSONBoundary(text);
    json = this.fixCommonErrors(json);
    
    // Try to balance braces
    const openBraces = (json.match(/{/g) || []).length;
    const closeBraces = (json.match(/}/g) || []).length;
    
    if (openBraces > closeBraces) {
      json += '}'.repeat(openBraces - closeBraces);
    }
    
    // Try to balance brackets
    const openBrackets = (json.match(/\[/g) || []).length;
    const closeBrackets = (json.match(/]/g) || []).length;
    
    if (openBrackets > closeBrackets) {
      json += ']'.repeat(openBrackets - closeBrackets);
    }
    
    return json;
  }

  /**
   * Try to parse JSON with validation
   */
  private static tryParse(jsonString: string, strategy: string): ProjectBlueprint | null {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (this.validateBlueprint(parsed)) {
        console.log(`✅ Successfully parsed ${strategy}`);
        return parsed as ProjectBlueprint;
      } else {
        console.warn(`⚠️ Parsed ${strategy} but validation failed`);
        return null;
      }
    } catch (error: any) {
      console.warn(`Failed to parse ${strategy}:`, error.message);
      return null;
    }
  }

  /**
   * Validate blueprint structure
   */
  private static validateBlueprint(obj: any): boolean {
    if (!obj || typeof obj !== 'object') {
      console.warn('Not an object');
      return false;
    }

    if (!obj.projectName) {
      console.warn('Missing projectName');
      return false;
    }

    if (!obj.workflow || typeof obj.workflow !== 'object') {
      console.warn('Missing or invalid workflow');
      return false;
    }

    if (!obj.workflow.nodes || !Array.isArray(obj.workflow.nodes)) {
      console.warn('Missing or invalid workflow.nodes');
      return false;
    }

    if (obj.workflow.nodes.length === 0) {
      console.warn('Empty workflow.nodes array');
      return false;
    }

    if (!obj.workflow.edges || !Array.isArray(obj.workflow.edges)) {
      console.warn('Missing or invalid workflow.edges');
      return false;
    }

    const hasValidNodes = obj.workflow.nodes.every((node: any, index: number) => {
      const valid = node.id && node.type && node.label && node.category;
      if (!valid) {
        console.warn(`Invalid node at index ${index}:`, node);
      }
      return valid;
    });

    if (!hasValidNodes) {
      console.warn('Some nodes have invalid structure');
      return false;
    }

    if (!obj.detailedContext || typeof obj.detailedContext !== 'object') {
      console.warn('Missing or invalid detailedContext');
      obj.detailedContext = {
        projectOverview: '',
        architectureExplanation: '',
        nodeDetails: {},
        edgeDetails: {},
        fileStructure: {},
        databaseSchema: {},
        apiSpecification: {},
        componentSpecification: {},
        integrations: [],
        authentication: {},
        deployment: {}
      };
    }

    console.log('✅ Blueprint structure validated');
    return true;
  }
}
