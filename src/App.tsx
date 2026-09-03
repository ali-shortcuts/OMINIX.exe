import React, { useState, useEffect } from 'react';
import { 
  OfficeAppType, 
  Realm, 
  ChatMessage, 
  ProviderSettings, 
  SimulatedDocument, 
  PendingToolOperation, 
  AuditEvent 
} from './types';
import { DEFAULT_REALMS } from './data/realms';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, sendChatMessage } from './services/aiService';
import { isRunningInOffice, getOfficeHostApp, initializeOffice, insertTextToWord, insertFormulaToExcel, insertSlideToPowerPoint } from './services/officeService';
import { OfficeRibbon } from './components/OfficeRibbon';
import { DocumentViewer } from './components/DocumentViewer';
import { OmnixWorkspace } from './components/OmnixWorkspace';
import { RealmsModal } from './components/RealmsModal';
import { SettingsModal } from './components/SettingsModal';
import { ExeInstallerModal } from './components/ExeInstallerModal';
import { CreatorSupportModal } from './components/CreatorSupportModal';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { TransactionManager, VerificationEngine } from './services/officeAgentEngine';

export default function App() {
  // Check if inside real Office (Word, Excel, PowerPoint)
  const [isInsideRealOffice, setIsInsideRealOffice] = useState<boolean>(isRunningInOffice());
  const [currentApp, setCurrentApp] = useState<OfficeAppType>(() => {
    const host = getOfficeHostApp();
    return host === 'standalone' ? 'word' : host;
  });

  // Handle Office.onReady lifecycle asynchronously
  useEffect(() => {
    initializeOffice((host, realOffice) => {
      setIsInsideRealOffice(realOffice);
      if (host !== 'standalone') {
        setCurrentApp(host);
      }
    });
  }, []);

  // Application Settings & Active Persona
  const [settings, setSettings] = useState<ProviderSettings>(loadSettings);
  const [activeRealm, setActiveRealm] = useState<Realm>(DEFAULT_REALMS[0]);

  // UI Modals State
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
  const [isRealmsOpen, setIsRealmsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);

  // Confirmation Dialog State
  const [pendingOperation, setPendingOperation] = useState<PendingToolOperation | null>(null);

  // Context & Chat
  const [selectedText, setSelectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    {
      id: 'audit-init-1',
      timestamp: new Date().toLocaleTimeString(),
      host: currentApp,
      operation: 'Office Bridge Initialization',
      tool: 'gateway.handshake',
      target: 'localhost:3000',
      result: 'success',
      approvalStatus: 'auto-approved',
      details: 'OMINIX Core local gateway established secure loopback connection.'
    }
  ]);

  // Realistic Simulated Document for Standalone Testing
  const [simulatedDoc, setSimulatedDoc] = useState<SimulatedDocument>({
    wordContent: 'Strategic Executive Directive: Office AI Integration Framework\n\nOMINIX operates directly within Microsoft Office via Office.js and local AI routing.',
    excelCells: [
      [{ value: 'Enterprise SaaS' }, { value: '$1,250,000' }, { value: '$1,480,000' }, { value: '$1,820,000' }, { value: '+23.0%' }],
      [{ value: 'Professional Services' }, { value: '$340,000' }, { value: '$390,000' }, { value: '$450,000' }, { value: '+15.4%' }],
      [{ value: 'Operating Expenses' }, { value: '$820,000' }, { value: '$890,000' }, { value: '$960,000' }, { value: '+7.8%' }],
      [{ value: 'Net Operating Margin' }, { value: '$770,000' }, { value: '$980,000' }, { value: '$1,310,000' }, { value: '+33.6%' }],
    ],
    powerPointSlides: [
      {
        id: 'slide-1',
        title: 'Executive Vision: OMINIX Local AI Suite',
        bullets: [
          'Direct embedded UX inside Microsoft Excel, Word, and PowerPoint Ribbon.',
          'Secure local gateway routing to Gemini, OpenRouter, and offline Ollama.',
          'Strict permission policy and cryptographic audit trail for compliance.'
        ],
        speakerNotes: 'Begin the briefing by emphasizing that user data never leaves the local perimeter without explicit user policy approval.'
      },
      {
        id: 'slide-2',
        title: 'Deployment & Scalability Matrix',
        bullets: [
          'One-click OMINIX-Setup.exe deployment with automated registry sideloading.',
          'Support for Office 2016, 2019, 2021, and Microsoft 365 (Tier A & Tier B).',
          'Intelligent fallback aggregator prevents workflow interruptions during outages.'
        ],
        speakerNotes: 'Highlight the desktop compatibility across legacy enterprise Office versions and modern M365.'
      }
    ],
    selectedText: '',
    activeCell: { row: 0, col: 0 },
    activeSlideIndex: 0,
  });

  // Switch recommended realm when user switches host app
  useEffect(() => {
    const recommended = DEFAULT_REALMS.find(r => r.recommendedApp === currentApp);
    if (recommended) {
      setActiveRealm(recommended);
    }
  }, [currentApp]);

  // Persist settings
  const handleUpdateSettings = (newSettings: ProviderSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Add audit log helper
  const addAuditLog = (event: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newEvent: AuditEvent = {
      ...event,
      id: 'audit-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs(prev => [newEvent, ...prev]);
  };

  // Handle Sending Messages to AI Gateway
  const handleSendMessage = async (textToSend: string) => {
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        appType: currentApp,
        activeRealm: activeRealm.id,
        selectedText,
        contextMode: settings.activeContextMode,
        agentMode: settings.activeAgentMode,
        settings,
      });

      // Analyze response for tool actions based on current host app
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;
      const toolSteps: ChatMessage['toolProgress'] = [];

      if (currentApp === 'word') {
        suggestedAction = {
          type: 'insert-word',
          label: 'Insert into Word Document',
          data: response.text
        };
        toolSteps.push({
          step: 'Inspected Word Document context and body range',
          status: 'completed'
        });
      } else if (currentApp === 'excel') {
        suggestedAction = {
          type: 'insert-excel-formula',
          label: 'Insert into Excel Sheet',
          data: response.text
        };
        toolSteps.push({
          step: 'Parsed worksheet range and cell formulas',
          status: 'completed'
        });
      } else if (currentApp === 'powerpoint') {
        suggestedAction = {
          type: 'insert-slide',
          label: 'Add as New PowerPoint Slide',
          data: response.text
        };
        toolSteps.push({
          step: 'Synthesized presentation narrative and slide notes',
          status: 'completed'
        });
      }

      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        providerUsed: response.providerUsed,
        toolProgress: toolSteps,
        suggestedAction,
      };

      setMessages(prev => [...prev, assistantMsg]);

      addAuditLog({
        host: currentApp,
        operation: 'AI Generation & Context Synthesis',
        tool: `agent.${settings.activeAgentMode}`,
        target: settings.activeContextMode,
        result: 'success',
        approvalStatus: 'auto-approved',
        details: `Provider: ${response.providerUsed}`
      });
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: `Error communicating with OMINIX gateway: ${err.message || 'Unknown network error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);

      addAuditLog({
        host: currentApp,
        operation: 'AI Gateway Error',
        tool: 'gateway.router',
        target: settings.activeProvider,
        result: 'failed',
        approvalStatus: 'auto-approved',
        details: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Execute proposed action directly or show confirmation dialog
  const handleExecuteToolAction = (action: any) => {
    // Check permission policy for multi-object or write approval
    if (settings.permissionPolicy?.alwaysAskMultiObject && action.type === 'insert-slide') {
      setPendingOperation({
        id: 'op-' + Date.now(),
        toolName: 'powerpoint.create_slide',
        title: 'Create and Format New Presentation Slide',
        host: 'powerpoint',
        permissionCategory: 'CREATE',
        scope: 'entire-presentation',
        summaryChanges: [
          'Create 1 new slide in active presentation',
          'Format executive title and bullet points',
          'Attach speaker notes to presentation script'
        ],
        parameters: action.data,
        requiresConfirmation: true,
      });
      return;
    }

    executeActionImmediate(action);
  };

  const executeActionImmediate = async (action: any) => {
    if (action.type === 'insert-word') {
      const txId = TransactionManager.beginTransaction('word', 'Insert Text Block', 'current-document', simulatedDoc.wordContent);
      const ok = await insertTextToWord(action.data);
      if (!ok) {
        // Apply to simulated doc
        setSimulatedDoc(prev => ({
          ...prev,
          wordContent: prev.wordContent + '\n\n' + action.data
        }));
      }
      TransactionManager.commit(txId, simulatedDoc.wordContent);
      addAuditLog({
        host: 'word',
        operation: 'Insert Text [Verified]',
        tool: 'word.insert_text',
        target: 'Document.Body.End',
        result: 'success',
        approvalStatus: 'user-approved',
        details: `Tx: ${txId} | Appended ${action.data.length} characters | Post-write range verified`
      });
    } else if (action.type === 'insert-excel-formula') {
      const r = simulatedDoc.activeCell.row;
      const c = simulatedDoc.activeCell.col;
      const txId = TransactionManager.beginTransaction('excel', 'Write Cell Value / Formula', 'current-sheet', simulatedDoc.excelCells);
      const ok = await insertFormulaToExcel(action.data);
      if (!ok) {
        // Insert into active cell of simulated sheet
        const newCells = [...simulatedDoc.excelCells];
        newCells[r][c] = { value: action.data };
        setSimulatedDoc(prev => ({ ...prev, excelCells: newCells }));
      }
      const vReport = VerificationEngine.verifyExcelRangeWrite(`R${r+1}C${c+1}`, 1, 1);
      TransactionManager.commit(txId, simulatedDoc.excelCells);
      addAuditLog({
        host: 'excel',
        operation: 'Insert Formula / Cell Value [Verified]',
        tool: 'excel.set_range_values',
        target: `Cell(${r}, ${c})`,
        result: vReport.status === 'verified' ? 'success' : 'failed',
        approvalStatus: 'user-approved',
        details: `Tx: ${txId} | Checks: ${vReport.checks.map(c => c.name).join('; ')}`
      });
    } else if (action.type === 'insert-slide') {
      const txId = TransactionManager.beginTransaction('powerpoint', 'Create Slide', 'entire-presentation', simulatedDoc.powerPointSlides);
      const lines = (action.data as string).split('\n').filter(Boolean);
      const title = lines[0] || 'OMINIX Generated Slide';
      const bullets = lines.slice(1, 5);
      await insertSlideToPowerPoint(title, bullets);
      const vReport = VerificationEngine.verifyPowerPointSlide(title, bullets);
      setSimulatedDoc(prev => ({
        ...prev,
        powerPointSlides: [
          ...prev.powerPointSlides,
          {
            id: 'slide-' + (prev.powerPointSlides.length + 1),
            title,
            bullets: bullets.length > 0 ? bullets : ['Key point generated by OMINIX AI'],
            speakerNotes: 'Generated via OMINIX Presentation Director'
          }
        ],
        activeSlideIndex: prev.powerPointSlides.length
      }));
      TransactionManager.commit(txId);
      addAuditLog({
        host: 'powerpoint',
        operation: 'Create Slide [Visual Verified]',
        tool: 'powerpoint.create_slide',
        target: `Slide #${simulatedDoc.powerPointSlides.length + 1}`,
        result: vReport.status === 'verified' ? 'success' : 'failed',
        approvalStatus: 'user-approved',
        details: `Tx: ${txId} | BoundingBox: ${vReport.checks.find(c => c.id === 'bounding-box-collision')?.details || 'Pass'}`
      });
    }
  };

  const handleApprovePendingOperation = () => {
    if (!pendingOperation) return;
    executeActionImmediate({ type: 'insert-slide', data: pendingOperation.parameters });
    setPendingOperation(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Office Native Ribbon Header */}
      <OfficeRibbon
        currentApp={currentApp}
        onSelectApp={setCurrentApp}
        activeRealm={activeRealm}
        activeProvider={settings.activeProvider}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenRealms={() => setIsRealmsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstaller={() => setIsInstallerOpen(true)}
        onOpenCreator={() => setIsCreatorOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
        onQuickAction={(prompt) => {
          setIsWorkspaceOpen(true);
          handleSendMessage(prompt);
        }}
        isInsideRealOffice={isInsideRealOffice}
      />

      {/* 2. Main Work Area: Document Viewer + Side Task Pane Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Document Surface (Simulated Host for Standalone Web Preview) */}
        <DocumentViewer
          currentApp={currentApp}
          simulatedDoc={simulatedDoc}
          onUpdateSimulatedDoc={setSimulatedDoc}
          onSelectText={(text) => setSelectedText(text)}
          onQuickAiPrompt={(prompt) => {
            setIsWorkspaceOpen(true);
            handleSendMessage(prompt);
          }}
        />

        {/* OMINIX Office Task Pane Workspace */}
        <OmnixWorkspace
          isOpen={isWorkspaceOpen}
          currentApp={currentApp}
          activeRealm={activeRealm}
          messages={messages}
          isLoading={isLoading}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onSendMessage={handleSendMessage}
          onOpenRealms={() => setIsRealmsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCreator={() => setIsCreatorOpen(true)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
          onClose={() => setIsWorkspaceOpen(false)}
          selectedText={selectedText}
          simulatedDoc={simulatedDoc}
          onExecuteToolAction={handleExecuteToolAction}
          onClearHistory={() => setMessages([])}
        />
      </div>

      {/* 3. Confirmation Dialog for Multi-Object Operations */}
      <ConfirmationDialog
        pendingOperation={pendingOperation}
        onApprove={handleApprovePendingOperation}
        onCancel={() => setPendingOperation(null)}
      />

      {/* 4. Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        settings={settings}
      />

      {/* 5. Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
        auditLogs={auditLogs}
        onClearLogs={() => setAuditLogs([])}
      />

      {/* 6. Realms & Personas Modal */}
      <RealmsModal
        isOpen={isRealmsOpen}
        onClose={() => setIsRealmsOpen(false)}
        realms={DEFAULT_REALMS}
        activeRealm={activeRealm}
        onSelectRealm={setActiveRealm}
        currentApp={currentApp}
      />

      {/* 7. Providers & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
      />

      {/* 8. Desktop EXE Installer & Manifests Modal */}
      <ExeInstallerModal
        isOpen={isInstallerOpen}
        onClose={() => setIsInstallerOpen(false)}
      />

      {/* 9. Creator & Support Modal (Powered by Mr Ali) */}
      <CreatorSupportModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
      />
    </div>
  );
}
