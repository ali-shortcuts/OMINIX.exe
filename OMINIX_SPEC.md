# OMINIX — Master Production Technical Specification & Architecture Blueprint (v2.0)

This repository implements the formal architecture defined in **`TECHNICAL_SPECIFICATION.md`**:

## 1. System Mission & Core Mandate
> **OMINIX SHALL PROVIDE AN AGENTIC OFFICE AUTOMATION LAYER CAPABLE OF PLANNING, EXECUTING, VERIFYING, AND REVISING MULTI-STEP TASKS ACROSS SUPPORTED MICROSOFT OFFICE APPLICATIONS.**

1. **Strict In-Office User Experience**:
   - The user interface operates exclusively inside **Microsoft Excel**, **Microsoft Word**, and **Microsoft PowerPoint** via the native Ribbon Tab and Office Task Pane.
   - The user is **never** redirected to an external browser (Google Chrome, Edge, etc.) to perform work.
   - Background orchestration runs through a silent local process (`OMINIX Core` / `OMINIX.exe`).

2. **Full Tool Taxonomy & Execution Engine**:
   - **Excel**: Workbooks, Worksheets, Cell Ranges, Formulas, Tables (ListObjects), Charts, Formatting, and Calculations.
   - **Word**: Document Body, Paragraphs, Styles, Ranges, Headings, Tables, Comments, Search & Replace.
   - **PowerPoint**: Slides, Text Shapes, Layouts, Tables, Charts, and Speaker Notes.

3. **Planner, Execution & Verification Loop**:
   - **Plan**: Decomposes user intents into typed tool calls.
   - **Action Preview**: Summarizes mutations with human confirmation gates.
   - **Transaction & Snapshot**: Pre-mutation snapshots enable clean Rollback/Undo.
   - **Verification Probe**: Validates that target ranges, formulas, charts, or tables were genuinely created and calculate without `#REF!` or `#VALUE!`.
   - **Auto-Repair / Rollback**: Automatically attempts corrective action before rolling back on failure.

4. **Granular Permission & Scope Engine**:
   - **Permission Levels**: `READ`, `FORMAT`, `WRITE`, `CREATE`, `DELETE`, `EXECUTE`, `EXPORT`.
   - **Spatial Scopes**: `Selected Range`, `Current Object`, `Current Sheet`, `Current Document / Workbook / Presentation`.
   - All destructive operations (`DELETE`) strictly require explicit user confirmation.

5. **Multi-Level Context Engine & SpreadSheet Profiler**:
   - Context Levels 0 through 5 (from zero-context to intelligent sampled subsets).
   - Data Profiler for large datasets (e.g., 200,000 rows): samples boundary rows, infers data types, computes distributions, and stays within token budgets (< 2,500 tokens).

6. **Provider-Agnostic AI Hub**:
   - Structured hierarchy: Direct Cloud (Gemini, Groq, OpenAI), Gateway Adapters (OpenRouter, 9Router-compatible proxies), and Local Offline (Ollama, LM Studio).
   - Dynamic Model Discovery & Multi-Criteria Router (Capability, Privacy/DLP, Health, Quota/429, Cost/Latency).
   - No Office component contains provider-specific logic.

7. **Enterprise Security, DLP & Prompt Injection Protection**:
   - Rigid delimiter demarcation separating `<system_policy>`, `<untrusted_document_content>`, and `<user_instruction>`.
   - Data Loss Protection (DLP) regex/entity scanning with auto-redaction and local-only routing for confidential data.
   - Secrets stored via Windows DPAPI / Credential Vault; never plaintext in configs or logs.

8. **Office Compatibility Matrix & Capability Scanner**:
   - Dynamic Requirement Set detection (ExcelApi, WordApi, PPTApi) and WebView runtime check.
   - Supports Modern Microsoft 365, Office 2021/2024, and Office 2016/2019 with graceful degradation. Obsolete versions (Office 2000/2003) are explicitly unsupported.

9. **Native Host & Watchdog (`OMINIX.exe`)**:
   - Dynamic loopback port allocation (no hardcoded port 3000 requirement).
   - Automatic local TLS self-signed certificate generation and Trusted Root installation.
   - Watchdog monitoring for registry entries (`TrustedCatalogs`) and service self-healing.

