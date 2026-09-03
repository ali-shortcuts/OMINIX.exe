# OMINIX — Master Technical Specification Memory & Architecture Blueprint

This repository implements the exact architecture defined in the **OMINIX Master Technical Specification**:

## Core Tenets
1. **Office-First Rule**: The canonical user experience lives inside **Microsoft Excel**, **Microsoft Word**, and **Microsoft PowerPoint** (Ribbon tab + Task Pane workspace).
2. **No Browser-Centered UX**: Web/Express/local endpoints act solely as infrastructure/local gateway and task pane host.
3. **English-Only Internal Product**: Clean, professional English UI, menus, logs, commands, and settings.
4. **One OMINIX Core, Three Office Clients**:
   - **Excel Bridge**: Formulas, cell ranges, tables, formatting, charts, worksheets.
   - **Word Bridge**: Paragraphs, document body, styles, search & replace, executive reports, tables.
   - **PowerPoint Bridge**: Slides, shapes, text frames, formatting, speaker notes.
5. **Local Gateway & Provider Hub**:
   - Centralized Provider Hub with adapter contracts (`authenticate`, `listModels`, `sendChat`, `streamChat`, `healthCheck`).
   - Adapters: OpenRouter, Gemini, OpenCode, Generic OpenAI-Compatible, Local Models (Ollama, LM Studio).
   - Smart Router & Fallback Engine (inspired by 9Router architecture: health check, rate-limit 429 auto-failover, quota tracking).
6. **Agent & Tool Engine with Explicit Permissions**:
   - Discrete tools: `excel.get_range`, `excel.set_range_values`, `excel.create_chart`, `word.insert_text`, `powerpoint.create_slide`, etc.
   - Permission categories: READ, WRITE, CREATE, DELETE, FORMAT, EXECUTE with confirmation dialogs for destructive actions.
7. **Production Windows Deliverable**:
   - `OMINIX-Setup.exe` package generation script, WiX/NSIS setup configs, and automated Office Trusted Catalog registry installer (`install-ominix-office.bat`).
   - Office Add-in manifests: `manifest-word.xml`, `manifest-excel.xml`, `manifest-powerpoint.xml`, and unified manifest.
