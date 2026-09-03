export type OfficeAppType = 'word' | 'excel' | 'powerpoint';

export type AgentExecutionMode = 
  | 'chat'              // Conversation only
  | 'assisted'          // Proposes actions, inspects context
  | 'agent'             // Executes authorized tools
  | 'safe-agent'        // Executes only pre-approved read/format tools
  | 'expert-workflow';  // Multi-step automated Office workflows

export type ContextExtractionMode = 
  | 'selection'         // Current Selection
  | 'current-object'    // Active Sheet / Paragraph / Slide
  | 'current-document'  // Full Document / Workbook / Presentation
  | 'current-application' // Host metadata
  | 'custom';           // Explicitly attached context

export type ToolPermissionCategory = 
  | 'READ' 
  | 'WRITE' 
  | 'CREATE' 
  | 'DELETE' 
  | 'FORMAT' 
  | 'EXECUTE';

export interface PendingToolOperation {
  id: string;
  toolName: string;
  title: string;
  host: OfficeAppType;
  permissionCategory: ToolPermissionCategory;
  summaryChanges: string[];
  parameters: any;
  requiresConfirmation: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  host: OfficeAppType;
  operation: string;
  tool: string;
  target: string;
  result: 'success' | 'failed' | 'cancelled';
  approvalStatus: 'auto-approved' | 'user-approved' | 'rejected';
  details?: string;
}

export interface Realm {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  recommendedApp: OfficeAppType | 'all';
  systemPromptAddon: string;
  quickActions: Array<{
    id: string;
    label: string;
    promptTemplate: string;
    icon: string;
  }>;
}

export type ProviderType = 'gemini' | 'openrouter' | 'groq' | '9router' | 'custom' | 'smart-aggregator';

export interface CustomProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
}

export interface ProviderSettings {
  activeProvider: ProviderType;
  smartAggregatorEnabled: boolean;
  activeAgentMode: AgentExecutionMode;
  activeContextMode: ContextExtractionMode;
  gemini: {
    apiKey: string;
    model: string;
  };
  openrouter: {
    apiKey: string;
    model: string;
  };
  groq: {
    apiKey: string;
    model: string;
  };
  nineRouter: {
    baseUrl: string;
    apiKey: string;
    model: string;
  };
  customProviders: CustomProviderConfig[];
  activeCustomProviderId?: string;
  priorityOrder: ProviderType[];
  permissionPolicy: {
    autoApproveRead: boolean;
    autoApproveWrite: boolean;
    alwaysAskDelete: boolean;
    alwaysAskMultiObject: boolean;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  providerUsed?: string;
  agentMode?: AgentExecutionMode;
  toolProgress?: {
    step: string;
    status: 'running' | 'completed' | 'failed' | 'pending-approval';
    details?: string;
  }[];
  suggestedAction?: {
    type: 'insert-word' | 'insert-excel-formula' | 'insert-slide' | 'format-table' | 'create-chart';
    data: any;
    label: string;
  };
}

export interface SimulatedDocument {
  wordContent: string;
  excelCells: Array<Array<{ value: string; formula?: string }>>;
  powerPointSlides: Array<{
    id: string;
    title: string;
    bullets: string[];
    speakerNotes: string;
  }>;
  selectedText: string;
  activeCell: { row: number; col: number };
  activeSlideIndex: number;
}

export interface DiagnosticCheckItem {
  id: string;
  name: string;
  category: 'office' | 'gateway' | 'security' | 'provider';
  status: 'passed' | 'warning' | 'failed' | 'checking';
  latencyMs?: number;
  message?: string;
}
