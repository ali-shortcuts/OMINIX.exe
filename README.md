# OMINIX - Office AI Platform

> **OMINIX** is a unified local AI integration platform for Microsoft Office (Word, Excel, and PowerPoint). It provides a native Ribbon and Taskpane interface powered by multi-provider AI routing (Google Gemini, OpenRouter, Groq, 9Router, and local Ollama), contextual document extraction, and permission-controlled agent tools.

[![GitHub Repository](https://img.shields.io/badge/GitHub-ali--shortcuts%2FOMINIX.exe-blue?logo=github)](https://github.com/ali-shortcuts/OMINIX.exe)
[![Build & Release OMINIX.exe](https://github.com/ali-shortcuts/OMINIX.exe/actions/workflows/build-exe.yml/badge.svg)](https://github.com/ali-shortcuts/OMINIX.exe/actions/workflows/build-exe.yml)

---

## Creator & Support

### Powered by Mr Ali

* **GitHub:** [https://github.com/ali-shortcuts](https://github.com/ali-shortcuts)
* **Repository:** [https://github.com/ali-shortcuts/OMINIX.exe](https://github.com/ali-shortcuts/OMINIX.exe)
* **Email:** [Ali.hekmati2026@gmail.com](mailto:Ali.hekmati2026@gmail.com)
* **Telegram:** [https://t.me/Ali_silent0](https://t.me/Ali_silent0)
* **Telegram Channel:** [https://t.me/Ali_shortcuts](https://t.me/Ali_shortcuts)
* **Facebook:** [https://www.facebook.com/AliShortcuts](https://www.facebook.com/AliShortcuts)
* **TikTok:** [https://www.tiktok.com/@ali_shortcuts](https://www.tiktok.com/@ali_shortcuts)
* **Instagram:** [https://www.instagram.com/ali_shortcuts](https://www.instagram.com/ali_shortcuts)
* **YouTube:** [https://www.youtube.com/@Ali_Shortcuts](https://www.youtube.com/@Ali_Shortcuts)

---

## Desktop Windows Executable & Office Integration

OMINIX includes native Windows integration scripts and executable host:

1. **Direct Launch (`OMINIX.exe` or `OMINIX-Launcher.bat`)**:
   - Registers the Office Add-in in Windows Registry (`HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs`).
   - Starts the local high-speed AI Gateway on `http://localhost:3000`.
   - Opens the unified Office Taskpane in your browser or Office runtime.
2. **Office Applications Supported**:
   - **Microsoft Word**: Smart text summarization, proofreading, formatting, styling.
   - **Microsoft Excel**: Formula generation, table analysis, pivot suggestions, data cleansing.
   - **Microsoft PowerPoint**: Slide outline generation, executive summaries, presentation formatting.

### Quick Windows Setup
```cmd
# 1. Clone repository
git clone https://github.com/ali-shortcuts/OMINIX.exe.git
cd OMINIX.exe

# 2. Run the Windows launcher
OMINIX-Launcher.bat
# Or double-click publish/OMINIX.exe
```

---

## Architectural Highlights

1. **Native Ribbon & Taskpane Integration**:
   - Custom `OMINIX` ribbon tab with commands for Word, Excel, and PowerPoint.
   - Dedicated side task pane (380–420px width) containing session management, model switcher, and agent workflows.
2. **Context Extraction Modes**:
   - Selection Only
   - Current Object (Active Sheet / Active Slide / Current Paragraph)
   - Current Document (Full Workbook / Full Presentation / Full Document)
3. **Agent Execution Modes**:
   - Chat Mode: Interactive conversations
   - Assisted Mode: Context-aware suggestions
   - Agent Mode: Full automated tool actions
   - Safe Agent Mode: Read & format operations only
   - Expert Workflow Mode: Multi-step planned routines
4. **Security & Permission Policies**:
   - Automated reads and simple writes
   - Mandatory human approval dialog for deletions and multi-object mutations
   - Comprehensive audit logging (`AuditEvent`) with timestamps and target ranges
5. **Multi-Provider Fallback Routing**:
   - Primary: Google Gemini (`gemini-2.5-flash`) via server-side `@google/genai`
   - High-Speed: Groq
   - Comprehensive Hub: OpenRouter
   - Offline / Private: 9Router and local Ollama (`localhost:11434`)
6. **Desktop EXE & Office Sideloading**:
   - Automated batch installer (`install-ominix-office.bat`)
   - Office Developer WEF registry registration
   - Dedicated XML manifests for Word, Excel, PowerPoint, and Unified Suite

---

## License & Copyright

Designed and developed with high-performance standards.  
**Powered by Mr Ali**
