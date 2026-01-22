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

  const apiKey = siteConfig.customFields.geminiApiKey;

  async function askAI() {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse('');
    setErrorType(null);

    try {
      // 1. Fetch Context Map
      let codeContext = "";
      try {
        const contextRes = await fetch('/ai-context/CODE_MAP.txt');
        if (contextRes.ok) {
          codeContext = await contextRes.text();
        } else {
          throw new Error("CODE_MAP_MISSING");
        }
      } catch (e) {
        console.warn("Context map fetch failed. Proceeding with limited knowledge.");
        codeContext = "Project Code Map unavailable. Use general Docusaurus/PocketBase standards.";
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
      const aiText = await callGeminiAPI(apiKey, input, systemInstruction);
      setResponse(aiText);

    } catch (error) {
      console.error("AIAssistant Error:", error);
      setErrorType('critical');
      setResponse(`SYSTEM_ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
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