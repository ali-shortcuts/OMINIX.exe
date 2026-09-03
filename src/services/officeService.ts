// OMINIX Office Bridge
// Supports Microsoft Office JavaScript API (Word, Excel, PowerPoint)
// and handles fallback simulation for standalone preview and testing.

declare global {
  interface Window {
    Office?: any;
    Word?: any;
    Excel?: any;
    PowerPoint?: any;
  }
}

export const isRunningInOffice = (): boolean => {
  return typeof window !== 'undefined' && !!window.Office && !!window.Office.context;
};

export const getOfficeHostApp = (): 'word' | 'excel' | 'powerpoint' | 'standalone' => {
  if (typeof window === 'undefined') return 'standalone';
  
  const urlParams = new URLSearchParams(window.location.search);
  const appParam = urlParams.get('app');
  if (appParam === 'word' || appParam === 'excel' || appParam === 'powerpoint') {
    return appParam;
  }

  if (window.Office && window.Office.context) {
    const host = window.Office.context.host;
    if (host === 'Word' || (window.Office as any).HostType?.Word === host) return 'word';
    if (host === 'Excel' || (window.Office as any).HostType?.Excel === host) return 'excel';
    if (host === 'PowerPoint' || (window.Office as any).HostType?.PowerPoint === host) return 'powerpoint';
  }

  return 'standalone';
};

// ==================== WORD BRIDGE ====================
export const insertTextToWord = async (text: string): Promise<boolean> => {
  if (window.Word && typeof window.Word.run === 'function') {
    try {
      await window.Word.run(async (context: any) => {
        const range = context.document.getSelection();
        range.insertText(text, 'End');
        await context.sync();
      });
      return true;
    } catch (err) {
      console.error('Word insertion error:', err);
      return false;
    }
  }
  return false;
};

export const insertTableToWord = async (rows: number, cols: number, data: string[][]): Promise<boolean> => {
  if (window.Word && typeof window.Word.run === 'function') {
    try {
      await window.Word.run(async (context: any) => {
        const range = context.document.getSelection();
        const table = range.insertTable(rows, cols, 'After', data);
        table.styleBuiltIn = 'GridTable4-Accent1';
        await context.sync();
      });
      return true;
    } catch (err) {
      console.error('Word insert table error:', err);
      return false;
    }
  }
  return false;
};

// ==================== EXCEL BRIDGE ====================
export const insertFormulaToExcel = async (formulaOrVal: string, targetAddress?: string): Promise<boolean> => {
  if (window.Excel && typeof window.Excel.run === 'function') {
    try {
      await window.Excel.run(async (context: any) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = targetAddress ? sheet.getRange(targetAddress) : context.workbook.getSelectedRange();
        if (formulaOrVal.startsWith('=')) {
          range.formulas = [[formulaOrVal]];
        } else {
          range.values = [[formulaOrVal]];
        }
        await context.sync();
      });
      return true;
    } catch (err) {
      console.error('Excel insertion error:', err);
      return false;
    }
  }
  return false;
};

export const formatRangeInExcel = async (address: string, format: { bold?: boolean; fill?: string; fontColor?: string }): Promise<boolean> => {
  if (window.Excel && typeof window.Excel.run === 'function') {
    try {
      await window.Excel.run(async (context: any) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange(address);
        if (format.bold !== undefined) range.format.font.bold = format.bold;
        if (format.fill) range.format.fill.color = format.fill;
        if (format.fontColor) range.format.font.color = format.fontColor;
        await context.sync();
      });
      return true;
    } catch (err) {
      console.error('Excel format error:', err);
      return false;
    }
  }
  return false;
};

// ==================== POWERPOINT BRIDGE ====================
export const insertSlideToPowerPoint = async (title: string, bullets: string[]): Promise<boolean> => {
  if (window.Office && window.Office.context && window.Office.context.document) {
    try {
      const content = `${title}\n\n` + bullets.map(b => `• ${b}`).join('\n');
      window.Office.context.document.setSelectedDataAsync(content, (asyncResult: any) => {
        if (asyncResult.status === window.Office.AsyncResultStatus.Failed) {
          console.warn('PowerPoint insertion status:', asyncResult.error?.message);
        }
      });
      return true;
    } catch (err) {
      console.error('PowerPoint error:', err);
      return false;
    }
  }
  return false;
};
