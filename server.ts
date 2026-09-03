import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const rootDir = process.cwd();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// CORS headers for Office iframes and local cross-origin development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Allow Office Desktop webview2 / embedded iframes to frame the applet
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://*.office.com https://*.officeapps.live.com https://*.microsoft.com http://localhost:* https://localhost:*");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Omnix',
    version: '1.0.0',
    providersSupported: ['gemini', 'openrouter', 'groq', '9router', 'custom-openai']
  });
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestPayload {
  provider: 'gemini' | 'openrouter' | 'groq' | '9router' | 'custom' | 'smart-aggregator';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  messages: ChatMessage[];
  temperature?: number;
  providerFallbackList?: Array<{
    provider: 'gemini' | 'openrouter' | 'groq' | 'custom';
    apiKey?: string;
    model?: string;
    baseUrl?: string;
  }>;
  contextData?: {
    appType?: 'word' | 'excel' | 'powerpoint' | 'general';
    selectedText?: string;
    activeRealm?: string;
  };
}

// Call Gemini API via @google/genai
async function callGemini(apiKey: string, model: string, messages: ChatMessage[], systemInstruction?: string) {
  const ai = new GoogleGenAI({ apiKey });
  
  // Format history for Gemini
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  const response = await ai.models.generateContent({
    model: model || 'gemini-2.5-flash',
    contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'سلام' }] }],
    config: {
      systemInstruction: systemInstruction || undefined,
    }
  });

  return response.text || 'پاسخی از مدل دریافت نشد.';
}

// Call OpenAI-compatible endpoint (OpenRouter, Groq, 9Router, Local Ollama, LM Studio, etc.)
async function callOpenAICompatible(baseUrl: string, apiKey: string, model: string, messages: ChatMessage[]) {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const endpoint = cleanBaseUrl.endsWith('/chat/completions') 
    ? cleanBaseUrl 
    : `${cleanBaseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // OpenRouter requires HTTP-Referer and X-Title for rankings
  if (cleanBaseUrl.includes('openrouter.ai')) {
    headers['HTTP-Referer'] = 'https://omnix.office.ai';
    headers['X-Title'] = 'Omnix Office AI Suite';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: model || 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`خطای پرووایدر (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('فرمت پاسخ دریافتی نامعتبر است.');
  }

  return content;
}

// Main API Chat Endpoint with 9Router Smart Fallback Engine
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const payload: ChatRequestPayload = req.body;
    const { provider, apiKey, model, baseUrl, messages, providerFallbackList } = payload;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'پیامی برای ارسال مشخص نشده است.' });
    }

    // System instruction based on realm and Office app
    const appType = payload.contextData?.appType || 'general';
    const realm = payload.contextData?.activeRealm || 'general';
    const selectedText = payload.contextData?.selectedText || '';

    const systemPrompt = `شما "آمنیکس (Omnix)" هستید؛ دستیار هوشمند و جامع مایکروسافت آفیس (Word، Excel، PowerPoint).
قلمرو و حالت فعلی شما: ${realm}
نرم‌افزار فعال کاربر: ${appType.toUpperCase()}
متن/داده انتخاب شده فعلی در سند: ${selectedText ? `"${selectedText}"` : 'هیچ متنی انتخاب نشده است'}

دستورالعمل‌ها:
۱. همواره به زبان کاربر (پیش‌فرض فارسی روان و استاندارد) پاسخ دهید، مگر اینکه کاربر به زبان دیگری درخواست کند.
۲. اگر کاربر در Word است: در نگارش، ویرایش متن، خلاصه‌سازی، جدول‌بندی، اصلاح لحن و گرامر به صورت تمیز و آماده کپی/درج کمک کنید.
۳. اگر کاربر در Excel است: فرمول‌های دقیق (مانند VLOOKUP، XLOOKUP، INDEX/MATCH، SUMIFS)، اسکریپت‌های VBA و تحلیل ساختار داده را با مثال ارائه دهید.
۴. اگر کاربر در PowerPoint است: ساختار اسلایدها (عنوان، بالت‌پوینت‌های کلیدی، یادداشت سخنران Speaker Notes) را تفکیک شده طراحی کنید.
۵. پاسخ‌ها را ساختاریافته، زیبا با نشانه‌گذاری Markdown و شفاف ارائه دهید.`;

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Execution logic
    if (provider === 'gemini') {
      const geminiKey = apiKey || process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.status(400).json({ error: 'کلید API برای Gemini یافت نشد. لطفاً در تنظیمات یا متغیر محیطی آن را وارد کنید.' });
      }
      const responseText = await callGemini(geminiKey, model || 'gemini-2.5-flash', messages, systemPrompt);
      return res.json({ text: responseText, providerUsed: 'Gemini' });
    }

    if (provider === 'openrouter') {
      if (!apiKey) {
        return res.status(400).json({ error: 'کلید API پرووایدر OpenRouter وارد نشده است.' });
      }
      const responseText = await callOpenAICompatible('https://openrouter.ai/api/v1', apiKey, model || 'meta-llama/llama-3.3-70b-instruct:free', fullMessages);
      return res.json({ text: responseText, providerUsed: 'OpenRouter' });
    }

    if (provider === 'groq') {
      if (!apiKey) {
        return res.status(400).json({ error: 'کلید API پرووایدر Groq وارد نشده است.' });
      }
      const responseText = await callOpenAICompatible('https://api.groq.com/openai/v1', apiKey, model || 'llama-3.3-70b-versatile', fullMessages);
      return res.json({ text: responseText, providerUsed: 'Groq' });
    }

    if (provider === '9router') {
      // 9Router acts as a local proxy or cloud gateway
      const routerUrl = baseUrl || 'http://localhost:20128/v1';
      const responseText = await callOpenAICompatible(routerUrl, apiKey || 'sk-9router', model || 'claude-3-5-sonnet', fullMessages);
      return res.json({ text: responseText, providerUsed: '9Router' });
    }

    if (provider === 'custom') {
      if (!baseUrl) {
        return res.status(400).json({ error: 'آدرس پایه (Base URL) پرووایدر سفارشی مشخص نشده است.' });
      }
      const responseText = await callOpenAICompatible(baseUrl, apiKey || '', model || 'default', fullMessages);
      return res.json({ text: responseText, providerUsed: 'Custom' });
    }

    // Smart Aggregator mode (Simulating 9Router fallback across all configured providers)
    if (provider === 'smart-aggregator') {
      const candidates = providerFallbackList || [
        { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY, model: 'gemini-2.5-flash' }
      ];

      const errors: string[] = [];
      for (const item of candidates) {
        try {
          if (item.provider === 'gemini') {
            const key = item.apiKey || process.env.GEMINI_API_KEY;
            if (key) {
              const text = await callGemini(key, item.model || 'gemini-2.5-flash', messages, systemPrompt);
              return res.json({ text, providerUsed: `Smart Aggregator -> Gemini (${item.model || '2.5-flash'})` });
            }
          } else if (item.provider === 'openrouter' && item.apiKey) {
            const text = await callOpenAICompatible('https://openrouter.ai/api/v1', item.apiKey, item.model || 'meta-llama/llama-3.3-70b-instruct:free', fullMessages);
            return res.json({ text, providerUsed: `Smart Aggregator -> OpenRouter (${item.model})` });
          } else if (item.provider === 'groq' && item.apiKey) {
            const text = await callOpenAICompatible('https://api.groq.com/openai/v1', item.apiKey, item.model || 'llama-3.3-70b-versatile', fullMessages);
            return res.json({ text, providerUsed: `Smart Aggregator -> Groq (${item.model})` });
          } else if (item.provider === 'custom' && item.baseUrl) {
            const text = await callOpenAICompatible(item.baseUrl, item.apiKey || '', item.model || 'default', fullMessages);
            return res.json({ text, providerUsed: `Smart Aggregator -> Custom (${item.baseUrl})` });
          }
        } catch (err: any) {
          errors.push(`${item.provider}: ${err.message || 'خطا در ارتباط'}`);
        }
      }

      return res.status(502).json({
        error: 'همه پرووایدرهای روتر با خطا یا اتمام سهمیه مواجه شدند.',
        details: errors
      });
    }

    return res.status(400).json({ error: 'پرووایدر انتخابی ناشناخته است.' });
  } catch (error: any) {
    console.error('API Chat Error:', error);
    res.status(500).json({ error: error.message || 'خطای سرور در پردازش هوش مصنوعی' });
  }
});

// Endpoint to generate Office Add-in Manifest XML for Word, Excel, PowerPoint
app.get('/api/manifest/:target', (req: Request, res: Response) => {
  const target = (req.params.target || 'word').toLowerCase();
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`;

  const targetTitles: Record<string, string> = {
    word: 'Omnix for Word (آمنیکس ورد)',
    excel: 'Omnix for Excel (آمنیکس اکسل)',
    powerpoint: 'Omnix for PowerPoint (آمنیکس پاورپوینت)',
    all: 'Omnix Office AI Suite (آمنیکس آفیس)',
  };

  const hostsXml: Record<string, string> = {
    word: '<Host Name="Document" />',
    excel: '<Host Name="Workbook" />',
    powerpoint: '<Host Name="Presentation" />',
    all: '<Host Name="Document" /><Host Name="Workbook" /><Host Name="Presentation" />',
  };

  const selectedHost = hostsXml[target] || hostsXml.word;
  const title = targetTitles[target] || targetTitles.word;

  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp 
          xmlns="http://schemas.microsoft.com/office/appforoffice/1.1" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0" 
          xmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides"
          xsi:type="TaskPaneApp">
  <Id>d72b380a-5dfb-4024-8f24-9dfa868a8b5e</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Omnix AI</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="${title}" />
  <Description DefaultValue="Omnix AI Workspace for Microsoft Office Suite" />
  <IconUrl DefaultValue="${baseUrl}/assets/icon-32.png" />
  <HighResolutionIconUrl DefaultValue="${baseUrl}/assets/icon-64.png" />
  <SupportUrl DefaultValue="${baseUrl}" />
  <AppDomains>
    <AppDomain>${baseUrl}</AppDomain>
  </AppDomains>
  <Hosts>
    ${selectedHost}
  </Hosts>
  <DefaultSettings>
    <SourceLocation DefaultValue="${baseUrl}?officeMode=true&amp;app=${target}" />
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="VersionOverridesV1_0">
    <Hosts>
      <Host xsi:type="Workbook">
        <DesktopFormFactor>
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <CustomTab id="OmnixTab">
              <Group id="OmnixGroup">
                <Label resid="GroupName" />
                <Icon>
                  <bt:Image size="16" resid="Icon16" />
                  <bt:Image size="32" resid="Icon32" />
                  <bt:Image size="80" resid="Icon80" />
                </Icon>
                <Control xsi:type="Button" id="OmnixTaskpaneButton">
                  <Label resid="ButtonLabel" />
                  <Supertip>
                    <Title resid="ButtonTitle" />
                    <Description resid="ButtonDesc" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon16" />
                    <bt:Image size="32" resid="Icon32" />
                    <bt:Image size="80" resid="Icon80" />
                  </Icon>
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>OmnixTaskpane</TaskpaneId>
                    <SourceLocation resid="TaskpaneUrl" />
                  </Action>
                </Control>
              </Group>
              <Label resid="TabLabel" />
            </CustomTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>
    <Resources>
      <bt:Images>
        <bt:Image id="Icon16" DefaultValue="${baseUrl}/assets/icon-16.png" />
        <bt:Image id="Icon32" DefaultValue="${baseUrl}/assets/icon-32.png" />
        <bt:Image id="Icon80" DefaultValue="${baseUrl}/assets/icon-80.png" />
      </bt:Images>
      <bt:Urls>
        <bt:Url id="TaskpaneUrl" DefaultValue="${baseUrl}?officeMode=true&amp;app=${target}" />
      </bt:Urls>
      <bt:ShortStrings>
        <bt:String id="TabLabel" DefaultValue="آمنیکس (Omnix AI)" />
        <bt:String id="GroupName" DefaultValue="هوش مصنوعی" />
        <bt:String id="ButtonLabel" DefaultValue="پنل آمنیکس" />
        <bt:String id="ButtonTitle" DefaultValue="دستیار هوشمند آمنیکس" />
      </bt:ShortStrings>
      <bt:LongStrings>
        <bt:String id="ButtonDesc" DefaultValue="باز کردن پنل هوش مصنوعی آمنیکس در کنار سند ورد، اکسل یا پاورپوینت" />
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
</OfficeApp>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Disposition', `attachment; filename=omnix-manifest-${target}.xml`);
  res.send(manifestXml);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Omnix Server running on http://localhost:${PORT}`);
  });
}

startServer();
