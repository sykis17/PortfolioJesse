import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { callGeminiAPI, WF3_PAGE_STANDARD } from '../utils/ai-utils';

export default function AIAssistant() {
  const { siteConfig } = useDocusaurusContext();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('worker');

  const apiKey = siteConfig.customFields.geminiApiKey;

  const roles = {
    worker: "Suorittava työntekijä (fokus: selkeät ohjeet, checklistit, turvallisuus)",
    admin: "Pääkäyttäjä (fokus: järjestelmän hallinta, muokkaus, konfigurointi)",
    engineer: "Insinööri/Työnjohto (fokus: tekninen data, laadunvalvonta, suunnittelu)",
    monitor: "Monitoroija/Vakuutusyhtiö (fokus: raportit, audit-trail, riskienhallinta)"
  };

  async function askAI() {
    if (!input) return;
    setLoading(true);
    setResponse('');

    try {
      const contextRes = await fetch('/PortfolioJesse/ai-context/CODE_MAP.txt');
      const codeContext = contextRes.ok ? await contextRes.text() : "Kontekstia ei voitu ladata.";

      const systemInstruction = `
        Olet asiantuntija. Käyttäjän rooli: ${roles[role]}.
        
        Noudatat tätä sivustandardia kaikessa sisällön luomisessa:
        ${WF3_PAGE_STANDARD}

        Tiedossa oleva koodikartta:
        ${codeContext.substring(0, 10000)}
      `;

      const aiText = await callGeminiAPI(apiKey, input, systemInstruction);
      setResponse(aiText);
    } catch (error) {
      setResponse(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // ... UI-koodi pysyy samana kuin aiemmin ...
    <div className="p-4 border border-blue-500 rounded-lg bg-slate-900 text-white shadow-2xl my-4">
       {/* (Pidetään se selkeä UI jonka loit) */}
       <div className="flex justify-between items-center mb-3">
          <h3 className="text-blue-400 m-0">🤖 WorkFlow3 Assistentti</h3>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-slate-800 text-xs border border-blue-500 rounded px-2 py-1">
            <option value="worker">Työntekijä</option>
            <option value="admin">Admin</option>
            <option value="engineer">Insinööri</option>
            <option value="monitor">Monitoroija</option>
          </select>
       </div>
       <textarea 
        className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-sm text-white focus:border-blue-400 outline-none"
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kysy mitä tahansa tai pyydä luomaan uusi sivu..."
      />
      <button onClick={askAI} disabled={loading} className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 w-full font-bold transition-all">
        {loading ? 'Työstetään...' : 'LÄHETÄ'}
      </button>
      {response && <div className="mt-4 p-3 bg-slate-800 border-l-4 border-blue-500 text-sm whitespace-pre-wrap">{response}</div>}
    </div>
  );
}