import React, { useState } from 'react';
import { 
  OfficeAppType, 
  SimulatedDocument 
} from '../types';
import { 
  FileText, 
  TableProperties, 
  Presentation, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Info,
  Maximize2
} from 'lucide-react';

interface DocumentViewerProps {
  currentApp: OfficeAppType;
  simulatedDoc: SimulatedDocument;
  onUpdateSimulatedDoc: (doc: SimulatedDocument) => void;
  onSelectText: (text: string) => void;
  onQuickAiPrompt: (prompt: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  currentApp,
  simulatedDoc,
  onUpdateSimulatedDoc,
  onSelectText,
  onQuickAiPrompt,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });

  // Handle Text Selection in Word
  const handleWordMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      onSelectText(selection.toString().trim());
    }
  };

  // Excel cell update
  const handleCellChange = (r: number, c: number, value: string) => {
    const newCells = simulatedDoc.excelCells.map((row, ri) =>
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          return { ...cell, value };
        }
        return cell;
      })
    );
    onUpdateSimulatedDoc({ ...simulatedDoc, excelCells: newCells });
  };

  // PowerPoint slide navigation
  const activeSlide = simulatedDoc.powerPointSlides[simulatedDoc.activeSlideIndex] || simulatedDoc.powerPointSlides[0];

  return (
    <main className="flex-1 bg-slate-950 p-4 md:p-6 overflow-y-auto flex flex-col items-center justify-start text-left">
      {/* Simulation Host Info Bar */}
      <div className="w-full max-w-4xl mb-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Interactive Host Surface:</span>
          <span className="text-slate-400 capitalize">{currentApp}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Highlight text or select cells to pass live context into OMINIX
        </div>
      </div>

      {/* ===================== 1. WORD DOCUMENT VIEW ===================== */}
      {currentApp === 'word' && (
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 md:p-12 min-h-[600px] flex flex-col space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
              <FileText className="w-4 h-4" />
              <span>Microsoft Word &bull; Executive_Proposal_2026.docx</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Page 1 of 1</span>
          </div>

          <div
            onMouseUp={handleWordMouseUp}
            className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 focus:outline-none"
          >
            <h1 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-2">
              Strategic Executive Directive: Office AI Integration Framework
            </h1>

            <p className="text-slate-300">
              The integration of local artificial intelligence pipelines into desktop enterprise applications represents a foundational inflection point in knowledge-worker productivity. Through the deployment of OMINIX, organizational document workflows achieve sub-second context extraction and continuous compliance auditing.
            </p>

            <h2 className="text-base font-semibold text-indigo-300 pt-2">
              1. Core Architecture Principles
            </h2>

            <p className="text-slate-300">
              OMINIX operates directly within the Microsoft Office execution sandbox via the modern Office.js bridge and desktop WebView2 runtime. By decoupling the presentation surface from remote LLM providers through an encrypted local gateway, document confidentiality is preserved without sacrificing low-latency inference.
            </p>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
              <div className="font-bold text-indigo-400 mb-1">// Document Text Buffer</div>
              <textarea
                value={simulatedDoc.wordContent}
                onChange={(e) => onUpdateSimulatedDoc({ ...simulatedDoc, wordContent: e.target.value })}
                rows={4}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-xs text-slate-200"
              />
            </div>

            <p className="text-slate-400 text-xs italic">
              Tip: Select any sentence above to inspect it in the OMINIX Taskpane.
            </p>
          </div>
        </div>
      )}

      {/* ===================== 2. EXCEL WORKBOOK VIEW ===================== */}
      {currentApp === 'excel' && (
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 md:p-6 min-h-[550px] flex flex-col space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <TableProperties className="w-4 h-4" />
              <span>Microsoft Excel &bull; Financial_Forecast_Q3_2026.xlsx</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Cell: {String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1}
              </span>
            </div>
          </div>

          {/* Formula Bar */}
          <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-bold px-1">fx</span>
            <input
              type="text"
              readOnly
              value={simulatedDoc.excelCells[selectedCell.row]?.[selectedCell.col]?.formula || simulatedDoc.excelCells[selectedCell.row]?.[selectedCell.col]?.value || ''}
              className="w-full bg-transparent text-slate-200 focus:outline-none"
            />
          </div>

          {/* Grid */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="w-10 p-2 border-r border-slate-800 text-center font-mono text-[10px]">#</th>
                  <th className="p-2 border-r border-slate-800 text-left font-mono">A (Metric)</th>
                  <th className="p-2 border-r border-slate-800 text-right font-mono">B (Q1)</th>
                  <th className="p-2 border-r border-slate-800 text-right font-mono">C (Q2)</th>
                  <th className="p-2 border-r border-slate-800 text-right font-mono">D (Q3 Forecast)</th>
                  <th className="p-2 text-right font-mono">E (YOY Growth)</th>
                </tr>
              </thead>
              <tbody>
                {simulatedDoc.excelCells.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-800/80 hover:bg-slate-800/40">
                    <td className="p-2 bg-slate-950 border-r border-slate-800 text-center font-mono text-[10px] text-slate-500">
                      {rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => {
                      const isSelected = selectedCell.row === rIdx && selectedCell.col === cIdx;
                      return (
                        <td
                          key={cIdx}
                          onClick={() => {
                            setSelectedCell({ row: rIdx, col: cIdx });
                            onSelectText(`Cell ${String.fromCharCode(65 + cIdx)}${rIdx + 1}: ${cell.value}`);
                          }}
                          className={`p-1.5 border-r border-slate-800/80 cursor-pointer ${
                            cIdx > 0 ? 'text-right font-mono' : 'text-left font-medium'
                          } ${isSelected ? 'bg-indigo-950 border-2 border-indigo-500 text-white' : 'text-slate-300'}`}
                        >
                          <input
                            type="text"
                            value={cell.value}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            className={`w-full bg-transparent text-inherit text-xs focus:outline-none ${
                              cIdx > 0 ? 'text-right' : 'text-left'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Worksheet: <strong className="text-slate-200">Summary Forecast</strong></span>
            <button
              onClick={() => onQuickAiPrompt('Analyze cell variance between Q2 and Q3 in this sheet.')}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask OMINIX to Analyze Sheet Data</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== 3. POWERPOINT PRESENTATION VIEW ===================== */}
      {currentApp === 'powerpoint' && (
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 min-h-[550px] flex flex-col space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Presentation className="w-4 h-4" />
              <span>Microsoft PowerPoint &bull; Executive_Pitch_Deck.pptx</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Slide {simulatedDoc.activeSlideIndex + 1} of {simulatedDoc.powerPointSlides.length}</span>
            </div>
          </div>

          {/* Slide Deck Canvas */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Slide {simulatedDoc.activeSlideIndex + 1} &bull; Strategic Briefing
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {activeSlide?.title || 'Slide Title'}
              </h2>
              <ul className="space-y-3 pt-2">
                {activeSlide?.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>CONFIDENTIAL &bull; BOARD OF DIRECTORS</span>
              <span className="font-mono text-slate-500">OMINIX Presentation Runtime</span>
            </div>
          </div>

          {/* Speaker Notes Area */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <div className="font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <span>Speaker Notes:</span>
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              {activeSlide?.speakerNotes || 'No notes for this slide.'}
            </p>
          </div>

          {/* Slide Thumbnails Switcher */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto">
            {simulatedDoc.powerPointSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => onUpdateSimulatedDoc({ ...simulatedDoc, activeSlideIndex: idx })}
                className={`p-2 rounded-lg border text-left flex-shrink-0 w-44 transition ${
                  simulatedDoc.activeSlideIndex === idx
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-500">Slide {idx + 1}</div>
                <div className="text-xs font-semibold truncate text-slate-200">{slide.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
