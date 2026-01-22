import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { callGeminiAPI } from '../utils/ai-utils';

// Site standard for the AI to follow
const PAGE_STANDARD = `
Standard: Docusaurus + Tailwind CSS.
- Always wrap content in the <Layout> component for new pages.
- Use Tailwind utility classes for styling (e.g., flex, gap-4, shadow-lg).
- Use the Triple-Level info structure (Senior, Junior, Customer) when explaining logic.
- Ensure all code snippets are provided in clean, copy-pasteable MDX/JSX blocks.
`;

export default function AIAssistant() {
  const { siteConfig } = useDocusaurusContext();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = siteConfig.customFields.geminiApiKey;

  async function askAI() {
    if (!input) return;
    setLoading(true);
    setResponse('');

    try {
      // Fetch the Code Map from the static folder
      const contextRes = await fetch('/ai-context/CODE_MAP.txt');
      const codeContext = contextRes.ok ? await contextRes.text() : "Project Code Map could not be loaded.";

      const systemInstruction = `
        You are here to help anyone entering Jesse's Professional Portfolio.
        Your goal is to make their experience seamless by overviewing and explaining how this portfolio works.
        When in style-guide.mdx your favourite thing is colors and complementary colors. Encourage the user to try different themes and colors.

        CURRENT PROJECT STRUCTURE (CODE_MAP):
        ${codeContext.substring(0, 8000)}

        DEVELOPMENT STANDARD:
        ${PAGE_STANDARD}

        INSTRUCTIONS:
        - If the user asks for a new page for code, provide the full source code and inside what other files should be added or modified.
        - Prioritize PocketBase integration and Tailwind CSS.
        - Maintain a professional, high-level engineering tone.
        - Focus on teaching and providing useful related insights rather than just coding.
      `;

      const aiText = await callGeminiAPI(apiKey, input, systemInstruction);
      setResponse(aiText);
    } catch (error) {
      setResponse("AI Connection Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border border-blue-500/20 rounded-2xl bg-slate-900 text-white shadow-2xl my-8 font-sans border-t-4 border-t-blue-600">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <h3 className="text-xl font-bold tracking-tight text-blue-400 m-0">
            Portfolio Assistant <span className="text-slate-500 text-xs font-normal">v2.0</span>
          </h3>
        </div>
        <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-1 rounded uppercase tracking-widest border border-blue-500/30">
          Engine Connected
        </span>
      </div>
      
      <p className="text-sm text-slate-400 mb-4">
        Input your request to generate components, audit logic, or expand the workings of the portfolio.
      </p>

      <textarea 
        className="w-full p-4 bg-slate-800/40 rounded-xl border border-slate-700 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 'Create a new page for the Village Engine with a PocketBase fetch example'..."
      />

      <button 
        onClick={askAI} 
        disabled={loading} 
        className={`mt-4 w-full py-3 rounded-xl font-bold text-sm tracking-[0.2em] transition-all ${
          loading 
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]'
        }`}
      >
        {loading ? 'PROCESSING ARCHITECTURE...' : 'EXECUTE ORCHESTRATION'}
      </button>

      {response && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">System Output</span>
            <span className="text-[10px] text-slate-500 italic">Audit Status: Verified</span>
          </div>
          <div className="p-5 bg-black/30 border border-slate-800 rounded-xl text-sm leading-relaxed max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="whitespace-pre-wrap font-mono text-slate-300">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}