import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { callGeminiAPI } from '../utils/ai-utils';

const PAGE_STANDARD = `
Standard: Docusaurus + Tailwind CSS.
- Always wrap content in the <Layout> component for new pages.
- Use Tailwind utility classes for styling.
- Use the Triple-Level info structure (Senior, Junior, Customer) for logic.
- Ensure all code snippets are provided in copy-pasteable MDX/JSX blocks.
`;

export default function AIAssistant() {
  const { siteConfig } = useDocusaurusContext();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null); // track if error is AI or Context
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [isTransientError, setIsTransientError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [codeContext, setCodeContext] = useState('');
  const [showApiKeyEditor, setShowApiKeyEditor] = useState(false);
  const [localApiKey, setLocalApiKey] = useState('');

  const apiKey = siteConfig.customFields.geminiApiKey;

  async function askAI() {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse('');
    setErrorType(null);
    setErrorMessage('');
    setErrorCode(null);
    setIsTransientError(false);

    try {
      let loadedContext = codeContext;
      if (!loadedContext) {
        try {
          const contextRes = await fetch('/ai-context/CODE_MAP.txt');
          if (contextRes.ok) {
            loadedContext = await contextRes.text();
            setCodeContext(loadedContext);
          } else {
            setIsTransientError(true);
            setErrorMessage('Context fetch failed — using limited project context.');
            loadedContext = 'Project Code Map unavailable. Use general Docusaurus/PocketBase standards.';
          }
        } catch (e) {
          setIsTransientError(true);
          setErrorMessage('Context fetch failed — using limited project context.');
          loadedContext = 'Project Code Map unavailable. Use general Docusaurus/PocketBase standards.';
        }
      }

      // 2. Build System Prompt
      const systemInstruction = `
        You are the Orchestrator for Jesse's Professional Portfolio.
        GOAL: Explain the 'Dawn of the New Morning' philosophy and provide technical implementation.
        
        CURRENT PROJECT STRUCTURE:
        ${codeContext.substring(0, 8000)}

        DEVELOPMENT STANDARD:
        ${PAGE_STANDARD}

        INSTRUCTIONS:
        - Provide full source code for new components.
        - Maintain a professional engineering tone.
        - Focus on the shift from manual coding to AI orchestration.
      `;

      // 3. Execute API Call
      const effectiveApiKey = localApiKey || apiKey;
      if (!effectiveApiKey) {
        setErrorType('auth');
        setErrorMessage('Missing API key — set your Gemini API key to continue.');
        setLoading(false);
        return;
      }

      try {
        const aiText = await callGeminiAPI(effectiveApiKey, input, systemInstruction);
        setResponse(aiText || '');
      } catch (apiErr) {
        console.error('AI call failed', apiErr);
        const msg = (apiErr && (apiErr.message || apiErr.error)) || String(apiErr);
        if (/401|unauthorized/i.test(msg)) {
          setErrorType('auth');
          setErrorMessage('Authentication failed (401) — update API key.');
        } else if (/429|rate limit/i.test(msg)) {
          setErrorType('rate');
          setIsTransientError(true);
          setErrorMessage('Rate limited — please wait and try again.');
        } else if (/network|fetch|failed to fetch/i.test(msg)) {
          setErrorType('network');
          setIsTransientError(true);
          setErrorMessage('Network error calling AI — please retry.');
        } else {
          setErrorType('critical');
          setErrorMessage('AI request failed — please try again later.');
        }
        setErrorCode(apiErr && apiErr.status ? apiErr.status : null);
      }

    } catch (error) {
      console.error('AIAssistant Error:', error);
      setErrorType('critical');
      setErrorMessage('Unexpected error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    setRetryCount((c) => c + 1);
    askAI();
  }

  async function handleReloadContext() {
    setLoading(true);
    setErrorMessage('');
    try {
      const contextRes = await fetch('/ai-context/CODE_MAP.txt');
      if (contextRes.ok) {
        const txt = await contextRes.text();
        setCodeContext(txt);
        setErrorMessage('Context reloaded.');
        setIsTransientError(false);
      } else {
        setErrorMessage('Failed to reload context.');
      }
    } catch (e) {
      setErrorMessage('Failed to reload context.');
    } finally {
      setLoading(false);
    }
  }

  function toggleApiKeyEditor() {
    setShowApiKeyEditor((s) => !s);
  }

  function saveLocalApiKey() {
    setShowApiKeyEditor(false);
  }

  return (
    <div className="p-6 border border-blue-500/20 rounded-2xl bg-slate-900 text-white shadow-2xl my-8 font-sans border-t-4 border-t-blue-600">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500 animate-ping'}`} />
          <h3 className="text-xl font-bold tracking-tight text-blue-400 m-0">
            Portfolio Assistant <span className="text-slate-500 text-xs font-normal">v2.2</span>
          </h3>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-widest border ${
          loading ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 'bg-blue-900/50 text-blue-300 border-blue-500/30'
        }`}>
          {loading ? 'Processing' : 'Connected'}
        </span>
      </div>
      
      <textarea 
        className="w-full p-4 bg-slate-800/40 rounded-xl border border-slate-700 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 'How does the Village Engine integrate with PocketBase?'..."
      />

      <button 
        onClick={askAI} 
        disabled={loading} 
        className={`mt-4 w-full py-4 rounded-xl font-black text-sm tracking-[0.2em] transition-all ${
          loading 
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-[0.98]'
        }`}
      >
        {loading ? 'ORCHESTRATING...' : 'EXECUTE MISSION'}
      </button>

      {(errorMessage || errorType) && (
        <div className="mt-4 p-4 rounded-lg bg-red-900/10 border border-red-800/10 text-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-sm font-semibold ${isTransientError ? 'text-yellow-200' : 'text-red-200'}`}>
                {errorMessage || 'An unexpected error occurred.'}
              </div>
              {errorCode && <div className="text-xs text-slate-400 mt-1">Code: {errorCode}</div>}
            </div>
            <div className="flex gap-2">
              <button onClick={handleRetry} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Retry</button>
              <button onClick={handleReloadContext} disabled={loading} className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-50">Reload Context</button>
              <button onClick={toggleApiKeyEditor} className="px-3 py-1 bg-amber-600 text-white rounded">Update API Key</button>
            </div>
          </div>
          {showApiKeyEditor && (
            <div className="mt-3 flex gap-2">
              <input value={localApiKey} onChange={(e) => setLocalApiKey(e.target.value)} placeholder="Paste API key..." className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-sm" />
              <button onClick={saveLocalApiKey} className="px-3 py-1 bg-emerald-600 text-white rounded">Save</button>
            </div>
          )}
        </div>
      )}

      {response && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">System Output</span>
            <span className={`text-[10px] italic font-bold ${errorType ? 'text-red-500' : 'text-emerald-500'}`}>
              {errorType ? 'Audit Status: Critical Failure' : 'Audit Status: Verified Output'}
            </span>
          </div>
          <div className="p-5 bg-black/40 border border-slate-800 rounded-xl text-sm leading-relaxed max-h-[600px] overflow-y-auto">
            <div className="whitespace-pre-wrap font-mono text-slate-300">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}