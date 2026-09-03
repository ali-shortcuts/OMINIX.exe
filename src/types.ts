export type OfficeAppType = 'word' | 'excel' | 'powerpoint';

export type AgentExecutionMode = 
  | 'chat'              // Conversation only
  | 'assisted'          // Proposes actions, inspects context
  | 'agent'             // Executes authorized tools with verification
  | 'safe-agent'        // Executes only pre-approved read/format tools
  | 'expert-workflow';  // Multi-step automated Office workflows

export type ContextLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ContextExtractionMode = 
  | 'selection'         // Level 1: Selection
  | 'current-object'    // Level 2: Active Sheet / Paragraph / Slide
  | 'current-document'  // Level 3/4: Full Document / Workbook / Presentation
  | 'current-application' // Host metadata
  | 'profiled-subset'   // Level 5: Compressed statistical sample
  | 'custom';           // Explicitly attached context

export type ToolPermissionCategory = 
  | 'READ' 
  | 'FORMAT' 
  | 'WRITE' 
  | 'CREATE' 
  | 'DELETE' 
  | 'EXECUTE'
  | 'EXPORT';

export type PermissionScope = 
  | 'selected-range'
  | 'current-object'
  | 'current-sheet'
  | 'current-document'
  | 'current-workbook'
  | 'entire-presentation';

export interface VerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

export interface VerificationReport {
  status: 'verified' | 'failed' | 'repaired' | 'rolled-back';
  checks: VerificationCheck[];
  repairedStep?: string;
  errorMessage?: string;
}

export interface TransactionSnapshot {
  id: string;
  timestamp: string;
  host: OfficeAppType;
  description: string;
  scope: PermissionScope;
  preState: any;
  postState?: any;
  status: 'active' | 'committed' | 'rolled-back';
}

export interface ToolContract {
  id: string;
  name: string;
  description: string;
  host: OfficeAppType | 'cross-office';
  permission: ToolPermissionCategory;
  scope: PermissionScope;
  minRequirementSet: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  canBeBatched: boolean;
  canBeRolledBack: boolean;
  approvalTier: 'AUTO' | 'CONFIRM' | 'STRICT_CONFIRM';
  verificationMethod: 'READ_AFTER_WRITE' | 'FORMULA_INTEGRITY' | 'DOM_STRUCTURE' | 'VISUAL_LAYOUT';
}

export interface PlanStep {
  id: string;
  order: number;
  toolId: string;
  description: string;
  host: OfficeAppType;
  parameters: Record<string, any>;
  dependsOn?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'rolled-back';
  output?: any;
  error?: string;
  verificationReport?: VerificationReport;
}

export interface ExecutionPlanGraph {
  id: string;
  userIntent: string;
  estimatedDurationMs: number;
  steps: PlanStep[];
  status: 'draft' | 'awaiting_approval' | 'executing' | 'completed' | 'failed' | 'cancelled';
  requiresStrictConfirmation: boolean;
  affectedDocuments: string[];
}

export interface DeltaOperation {
  id: string;
  timestamp: string;
  toolId: string;
  host: OfficeAppType;
  targetAddress: string;
  inverseOperation: {
    toolId: string;
    parameters: Record<string, any>;
  };
}

export interface OperationJournal {
  transactionId: string;
  documentId: string;
  operations: DeltaOperation[];
  status: 'recording' | 'committed' | 'reverted';
}

export interface CrossOfficeJob {
  id: string;
  title: string;
  status: 'queued' | 'running' | 'waiting_approval' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progressPercent: number;
  currentStepIndex: number;
  stepsCount: number;
  sourceDoc?: { type: OfficeAppType; name: string };
  targetDoc?: { type: OfficeAppType; name: string };
  cancelRequested?: boolean;
}

export interface PendingToolOperation {
  id: string;
  toolName: string;
  title: string;
  host: OfficeAppType;
  permissionCategory: ToolPermissionCategory;
  scope: PermissionScope;
  summaryChanges: string[];
  parameters: any;
  requiresConfirmation: boolean;
  approvalTier?: 'AUTO' | 'CONFIRM' | 'STRICT_CONFIRM';
  actionPreview?: {
    intent: string;
    affectedTargets: string[];
    riskLevel: 'low' | 'medium' | 'high';
    addedCount?: number;
    modifiedCount?: number;
    deletedCount?: number;
  };
}

export interface OfficeCapabilityInfo {
  host: OfficeAppType;
  version: string;
  build: string;
  installationType: 'ClickToRun' | 'MSI' | 'Store' | 'Web';
  runtimeEngine: 'WebView2' | 'EdgeHTML' | 'Trident' | 'Browser';
  supportedRequirementSets: Record<string, string>;
  operatingMode: 'FULL_AGENT' | 'LIMITED_AGENT' | 'COMPATIBILITY';
}

export interface DlpRuleResult {
  hasConfidentialData: boolean;
  detectedTypes: string[];
  redactedCount: number;
  policyApplied: 'ALLOW' | 'MASK' | 'BLOCK' | 'CONFIRM';
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

export type ProviderCategory = 'cloud' | 'gateway' | 'local';

export type ModelCapability = 
  | 'chat' 
  | 'vision' 
  | 'tool-calling' 
  | 'long-context' 
  | 'structured-output' 
  | 'streaming';

export type ProviderType = 
  | 'gemini' 
  | 'openrouter' 
  | 'groq' 
  | '9router' 
  | 'ollama'
  | 'opencode'
  | 'custom' 
  | 'smart-aggregator';

export interface RegisteredModel {
  id: string;
  name: string;
  providerId: ProviderType | string;
  contextWindow: number;
  capabilities: ModelCapability[];
  pricingPer1kTokens?: { input: number; output: number };
}

export interface CustomProviderConfig {
  id: string;
  name: string;
  category: ProviderCategory;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  capabilities?: ModelCapability[];
}

export interface ProviderSettings {
  activeProvider: ProviderType;
  smartAggregatorEnabled: boolean;
  activeAgentMode: AgentExecutionMode;
  activeContextMode: ContextExtractionMode;
  contextLevel: ContextLevel;
  dlpPolicy: 'ALLOW' | 'MASK' | 'BLOCK' | 'CONFIRM';
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
  ollama: {
    baseUrl: string;
    model: string;
  };
  customProviders: CustomProviderConfig[];
  activeCustomProviderId?: string;
  priorityOrder: ProviderType[];
  permissionPolicy: {
    autoApproveRead: boolean;
    autoApproveFormat: boolean;
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
