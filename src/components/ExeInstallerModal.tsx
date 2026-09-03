import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  Layers, 
  FileCode, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { OfficeAppType } from '../types';

interface ExeInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExeInstallerModal: React.FC<ExeInstallerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedBatch, setCopiedBatch] = useState(false);
  const [copiedRegistry, setCopiedRegistry] = useState(false);

  if (!isOpen) return null;

  const batchScriptContent = `@echo off
:: ============================================================================
:: OMINIX Office AI Suite - Automated Desktop Sideloading Script
:: Compatible with: Microsoft 365, Office 2021, Office 2019, Office 2016 (x64/x86)
:: ============================================================================
echo [OMINIX] Initializing Office Add-in Registration...

set "OMINIX_DIR=%LOCALAPPDATA%\\OMINIX\\Manifests"
if not exist "%OMINIX_DIR%" mkdir "%OMINIX_DIR%"

echo [OMINIX] Downloading unified manifest...
curl -s -o "%OMINIX_DIR%\\ominix-office-manifest.xml" "%~dp0ominix-manifest-all.xml"

echo [OMINIX] Registering Trusted Add-in Catalogs in Windows Registry...
reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\WEF\\Developer" /v "OMINIX_Catalog" /t REG_SZ /d "%OMINIX_DIR%" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\Office\\15.0\\WEF\\Developer" /v "OMINIX_Catalog" /t REG_SZ /d "%OMINIX_DIR%" /f >nul 2>&1

echo.
echo ============================================================================
echo [SUCCESS] OMINIX Office Add-in Registered Successfully!
echo Open Word, Excel, or PowerPoint, go to Insert - My Add-ins - Shared Folder,
echo and click 'OMINIX' to add it to your Ribbon.
echo ============================================================================
pause
`;

  const registryCommand = `reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\WEF\\Developer" /v "OMINIX_Catalog" /t REG_SZ /d "%LOCALAPPDATA%\\OMINIX\\Manifests" /f`;

  const copyToClipboard = (text: string, type: 'batch' | 'reg') => {
    navigator.clipboard.writeText(text);
    if (type === 'batch') {
      setCopiedBatch(true);
      setTimeout(() => setCopiedBatch(false), 1500);
    } else {
      setCopiedRegistry(true);
      setTimeout(() => setCopiedRegistry(false), 1500);
    }
  };

  const handleDownloadBatch = () => {
    const blob = new Blob([batchScriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'install-ominix-office.bat';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                OMINIX-Setup.exe & Office Add-in Deployment
              </h3>
              <p className="text-xs text-slate-400">
                Install OMINIX directly into desktop Microsoft Word, Excel, and PowerPoint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Method 0: Direct EXE Download from GitHub */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold tracking-wider uppercase">
                    Official Release v1.0.0
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">Download Native Windows Executable</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Published and hosted on GitHub under <span className="text-blue-400 font-mono">ali-shortcuts/OMINIX.exe</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/ali-shortcuts/OMINIX.exe/releases/latest"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md hover:shadow-blue-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download OMINIX.exe</span>
                </a>
                <a
                  href="https://github.com/ali-shortcuts/OMINIX.exe"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition border border-slate-700"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <a
                href="https://github.com/ali-shortcuts/OMINIX.exe/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-xs">OMINIX.exe</div>
                    <div className="text-[10px] text-slate-400">Standalone Windows Desktop Host</div>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-blue-400" />
              </a>

              <a
                href="https://github.com/ali-shortcuts/OMINIX.exe/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-slate-200 transition"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-xs">OMINIX-Office-AI-Windows.zip</div>
                    <div className="text-[10px] text-slate-400">EXE + Manifest + Batch Bundle</div>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-indigo-400" />
              </a>
            </div>
          </div>

          {/* Method 1: Automated Script */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-white text-sm">Automated Windows Batch Installer</h4>
              </div>
              <button
                onClick={handleDownloadBatch}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download install-ominix-office.bat</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Runs registry registration automatically for Microsoft Office Developer Shared Catalogs and configures local trusted manifest paths.
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-amber-300/90 overflow-x-auto border border-slate-800/80">
                {batchScriptContent.slice(0, 310)}...
              </pre>
              <button
                onClick={() => copyToClipboard(batchScriptContent, 'batch')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition flex items-center gap-1"
                title="Copy Batch Script"
              >
                {copiedBatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Method 2: Manifest Downloads */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-white text-sm">Download Office XML Manifests</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Download the official Office.js manifest for individual applications or the unified suite:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <a
                href="/api/manifest/all"
                download="ominix-manifest-all.xml"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <FileCode className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-200">Unified Suite</span>
                <span className="text-[10px] text-slate-500">All Office Apps</span>
              </a>

              <a
                href="/api/manifest/word"
                download="ominix-manifest-word.xml"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <FileCode className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-200">Word</span>
                <span className="text-[10px] text-slate-500">manifest.xml</span>
              </a>

              <a
                href="/api/manifest/excel"
                download="ominix-manifest-excel.xml"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <FileCode className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-200">Excel</span>
                <span className="text-[10px] text-slate-500">manifest.xml</span>
              </a>

              <a
                href="/api/manifest/powerpoint"
                download="ominix-manifest-powerpoint.xml"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500 text-center transition flex flex-col items-center gap-1 group"
              >
                <FileCode className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                <span className="text-xs font-semibold text-slate-200">PowerPoint</span>
                <span className="text-[10px] text-slate-500">manifest.xml</span>
              </a>
            </div>
          </div>

          {/* Packaging Guide for OMINIX-Setup.exe */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-white text-xs">OMINIX-Setup.exe Build Instructions</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To compile the native Windows executable using WiX Toolset or electron-builder:
            </p>
            <div className="p-2.5 bg-slate-900 rounded font-mono text-[11px] text-slate-300 border border-slate-800">
              npx electron-builder --win --x64 -c.win.target=nsis
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Desktop Compatibility: Windows 10/11 &bull; Office 2016+</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
