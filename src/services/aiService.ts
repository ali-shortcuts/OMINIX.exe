import { ChatMessage, ProviderSettings, ProviderType, AgentExecutionMode, ContextExtractionMode } from '../types';

export const DEFAULT_SETTINGS: ProviderSettings = {
  activeProvider: 'gemini',
  smartAggregatorEnabled: true,
  activeAgentMode: 'assisted',
  activeContextMode: 'selection',
  gemini: {
    apiKey: '',
    model: 'gemini-2.5-flash',
  },
  openrouter: {
    apiKey: '',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  groq: {
    apiKey: '',
    model: 'llama-3.3-70b-versatile',
  },
  nineRouter: {
    baseUrl: 'http://localhost:20128/v1',
    apiKey: '',
    model: 'claude-3-5-sonnet',
  },
  customProviders: [
    {
      id: 'custom-ollama',
      name: 'Local Ollama (localhost:11434)',
      baseUrl: 'http://localhost:11434/v1',
      apiKey: '',
      model: 'llama3:latest',
      isActive: false
    },
    {
      id: 'custom-lmstudio',
      name: 'LM Studio (localhost:1234)',
      baseUrl: 'http://localhost:1234/v1',
      apiKey: '',
      model: 'local-model',
      isActive: false
    },
    {
      id: 'custom-deepseek',
      name: 'DeepSeek API',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: '',
      model: 'deepseek-chat',
      isActive: false
    }
  ],
  priorityOrder: ['gemini', 'openrouter', 'groq', 'custom', '9router'],
  permissionPolicy: {
    autoApproveRead: true,
    autoApproveWrite: true,
    alwaysAskDelete: true,
    alwaysAskMultiObject: true
  }
};

const STORAGE_KEY = 'ominix_provider_settings_v2';

export const loadSettings = (): ProviderSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: ProviderSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
};

export interface SendMessageParams {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  appType: 'word' | 'excel' | 'powerpoint' | 'general';
  activeRealm: string;
  selectedText?: string;
  contextMode?: ContextExtractionMode;
  agentMode?: AgentExecutionMode;
  documentSummary?: string;
  settings: ProviderSettings;
}

export const sendChatMessage = async (params: SendMessageParams): Promise<{ text: string; providerUsed: string }> => {
  const { messages, appType, activeRealm, selectedText, contextMode, agentMode, documentSummary, settings } = params;

  let providerToUse: ProviderType = settings.activeProvider;
  let apiKey = '';
  let model = '';
  let baseUrl = '';

  if (settings.smartAggregatorEnabled && settings.activeProvider === 'smart-aggregator') {
    providerToUse = 'smart-aggregator';
  } else if (settings.activeProvider === 'gemini') {
    apiKey = settings.gemini.apiKey;
    model = settings.gemini.model;
  } else if (settings.activeProvider === 'openrouter') {
    apiKey = settings.openrouter.apiKey;
    model = settings.openrouter.model;
  } else if (settings.activeProvider === 'groq') {
    apiKey = settings.groq.apiKey;
    model = settings.groq.model;
  } else if (settings.activeProvider === '9router') {
    baseUrl = settings.nineRouter.baseUrl;
    apiKey = settings.nineRouter.apiKey;
    model = settings.nineRouter.model;
  } else if (settings.activeProvider === 'custom') {
    const activeCustom = settings.customProviders.find(p => p.id === settings.activeCustomProviderId) || settings.customProviders[0];
    if (activeCustom) {
      baseUrl = activeCustom.baseUrl;
      apiKey = activeCustom.apiKey;
      model = activeCustom.model;
    }
  }

  // Build fallback list for Smart Aggregator
  const fallbackList: any[] = [];
  if (settings.gemini.apiKey || true) {
    fallbackList.push({ provider: 'gemini', apiKey: settings.gemini.apiKey, model: settings.gemini.model });
  }
  if (settings.openrouter.apiKey) {
    fallbackList.push({ provider: 'openrouter', apiKey: settings.openrouter.apiKey, model: settings.openrouter.model });
  }
  if (settings.groq.apiKey) {
    fallbackList.push({ provider: 'groq', apiKey: settings.groq.apiKey, model: settings.groq.model });
  }
  const activeCustom = settings.customProviders.find(p => p.isActive);
  if (activeCustom && activeCustom.baseUrl) {
    fallbackList.push({ provider: 'custom', baseUrl: activeCustom.baseUrl, apiKey: activeCustom.apiKey, model: activeCustom.model });
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: providerToUse,
      apiKey,
      model,
      baseUrl,
      messages,
      providerFallbackList: fallbackList,
      contextData: {
        appType,
        activeRealm,
        selectedText,
        contextMode: contextMode || settings.activeContextMode,
        agentMode: agentMode || settings.activeAgentMode,
        documentSummary
      }
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.details?.[0] || 'An error occurred while communicating with the AI model gateway.');
  }

  return {
    text: data.text,
    providerUsed: data.providerUsed || 'OMINIX Core Gateway'
  };
};
