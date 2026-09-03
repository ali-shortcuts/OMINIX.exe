import { Realm } from '../types';

export const DEFAULT_REALMS: Realm[] = [
  {
    id: 'realm-word',
    name: 'Document Architect & Editor',
    title: 'Executive Word Authoring & Editorial Engine',
    description: 'Tone calibration, executive summaries, corporate memos, scholarly research structure, and stylistic proofreading.',
    icon: 'FileText',
    color: 'from-blue-600 to-indigo-700',
    recommendedApp: 'word',
    systemPromptAddon: 'You are OMINIX Word Architect. Provide authoritative, concise, and executive-ready prose with flawless grammar and structured document formatting.',
    quickActions: [
      { id: 'summarize', label: 'Summarize Selection', promptTemplate: 'Summarize the selected text into 3-5 high-impact, actionable executive bullet points.', icon: 'Minimize2' },
      { id: 'formalize', label: 'Transform to Executive Tone', promptTemplate: 'Rewrite this text into a polished, authoritative corporate executive memorandum tone.', icon: 'Sparkles' },
      { id: 'grammar', label: 'Proofread & Enhance Grammar', promptTemplate: 'Meticulously proofread this passage for grammatical correctness, active voice, and conciseness.', icon: 'CheckCircle2' },
      { id: 'make-table', label: 'Convert Data to Word Table', promptTemplate: 'Organize the facts, metrics, or comparisons in this passage into a well-structured document table.', icon: 'Table' },
    ]
  },
  {
    id: 'realm-excel',
    name: 'Data & Formula Alchemist',
    title: 'Advanced Excel Analytics & Modeling',
    description: 'Dynamic array formulas (XLOOKUP, INDEX/MATCH, LET, LAMBDA), data cleaning, pivot planning, and syntax diagnosis.',
    icon: 'TableProperties',
    color: 'from-emerald-600 to-teal-800',
    recommendedApp: 'excel',
    systemPromptAddon: 'You are OMINIX Excel Alchemist. Provide exact, optimized Excel formulas, clean tabular models, and step-by-step logic for data analysis.',
    quickActions: [
      { id: 'formula-lookup', label: 'Generate Lookup (XLOOKUP)', promptTemplate: 'Construct an optimal XLOOKUP formula for matching key records, explaining lookup array, return array, and fallback value.', icon: 'Search' },
      { id: 'sumifs', label: 'Multi-Condition Aggregation (SUMIFS)', promptTemplate: 'Write an optimized SUMIFS / COUNTIFS formula handling multiple criteria for the selected range.', icon: 'PlusCircle' },
      { id: 'clean-data', label: 'Sanitize & Deduplicate Data', promptTemplate: 'Provide step-by-step Excel formula and Power Query guidance to sanitize, trim, and deduplicate this column.', icon: 'Filter' },
      { id: 'explain-error', label: 'Diagnose Formula Error (#N/A, #VALUE)', promptTemplate: 'Diagnose the root cause of #N/A, #VALUE!, or #REF! errors in this calculation and provide the fix.', icon: 'AlertTriangle' },
    ]
  },
  {
    id: 'realm-powerpoint',
    name: 'Presentation Director',
    title: 'PowerPoint Narrative & Slide Strategy',
    description: 'Slide deck architecture, punchy bullet points, visual layout recommendations, and executive speaker notes.',
    icon: 'Presentation',
    color: 'from-amber-600 to-orange-700',
    recommendedApp: 'powerpoint',
    systemPromptAddon: 'You are OMINIX Presentation Director. Craft high-retention slide structures, punchy bullet copy, and confident speaker notes.',
    quickActions: [
      { id: 'slide-deck-5', label: 'Generate 5-Slide Deck Outline', promptTemplate: 'Generate a structured 5-slide executive pitch deck outlining: Title, Problem, Solution, Market/Traction, and Strategic Ask.', icon: 'Layers' },
      { id: 'bullet-refine', label: 'Condense into Impact Bullets', promptTemplate: 'Condense this dense paragraph into 3 punchy, presentation-ready bullet points (under 8 words each).', icon: 'ListOrdered' },
      { id: 'speaker-notes', label: 'Generate Speaker Notes', promptTemplate: 'Write natural, persuasive spoken script notes for the presenter to deliver during this slide presentation.', icon: 'Mic' },
      { id: 'visual-ideas', label: 'Suggest Visual Layouts', promptTemplate: 'Propose modern 2-column or 3-column card layouts, chart types, and iconography to elevate this slide visually.', icon: 'Palette' },
    ]
  },
  {
    id: 'realm-vba',
    name: 'Office Automation & VBA Engineer',
    title: 'VBA Macro & Office Scripts Architect',
    description: 'Automated macros, TypeScript Office Scripts, batch file processing, and cross-application data pipelines.',
    icon: 'Code2',
    color: 'from-violet-600 to-purple-800',
    recommendedApp: 'all',
    systemPromptAddon: 'You are OMINIX Automation Architect. Produce modular, error-handled VBA and TypeScript Office Scripts with clear comments and implementation guides.',
    quickActions: [
      { id: 'vba-macro', label: 'Generate Automation Macro', promptTemplate: 'Write a robust, error-handled VBA macro to automate this recurring Office workflow with shortcut key bindings.', icon: 'Play' },
      { id: 'export-pdf', label: 'Batch Export to PDF', promptTemplate: 'Generate a VBA procedure that formats and exports the active worksheet or document into a timestamped PDF.', icon: 'FileDown' },
      { id: 'word-to-excel', label: 'Extract Word Tables to Excel', promptTemplate: 'Write an automation script that extracts tabular data from a Word document and appends it cleanly into Excel.', icon: 'ArrowLeftRight' },
    ]
  },
  {
    id: 'realm-general',
    name: 'OMINIX Universal Intelligence',
    title: 'General Inquiries, Research & Translation',
    description: 'Cross-disciplinary synthesis, language translation, document auditing, and reasoning engine.',
    icon: 'Bot',
    color: 'from-cyan-600 to-blue-700',
    recommendedApp: 'all',
    systemPromptAddon: 'You are OMINIX Core Gateway. Assist with deep analytical research, strategic planning, high-accuracy multilingual translations, and reasoning.',
    quickActions: [
      { id: 'translate-en', label: 'Translate to English', promptTemplate: 'Translate this selected passage into natural, clear, and professional English.', icon: 'Globe' },
      { id: 'executive-summary', label: 'Executive Briefing Memo', promptTemplate: 'Synthesize the provided materials into a high-level executive briefing memorandum with risk highlights.', icon: 'FileCheck' },
      { id: 'brainstorm', label: 'Strategic Brainstorming', promptTemplate: 'Formulate 5 strategic perspectives and actionable recommendations regarding this initiative.', icon: 'Lightbulb' },
    ]
  }
];
