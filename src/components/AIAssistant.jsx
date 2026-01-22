import React, { useState } from 'react';
import clsx from 'clsx';

/**
 * AIAssistant Component
 * Part of the "Dawn of the New Morning" project.
 * Demystifying the shift from manual coding to AI orchestration.
 */
export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState(null);

  const handleOrchestration = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setErrorMessage('');
    setErrorType(null);

    try {
      // Logic for AI Orchestration will be implemented here
      // For now, simulating a village engine response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResponse(`Orchestrating mission: ${input}`);
    } catch (err) {
      setErrorMessage('The Village Engine encountered a synchronization error.');
      setErrorType('CONNECTION_FAILURE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding-vert--lg">
      <div className="container">
        <div className="card shadow--md">
          <div className="card__header">
            <h3><span className="margin-right--sm">🤖</span> AI Orchestrator</h3>
            <p className="text--secondary">Command the Village Engine to manifest your vision.</p>
          </div>
          
          <div className="card__body">
            <textarea
              className="button--block margin-bottom--md"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)',
                fontSize: '1rem',
                fontFamily: 'var(--ifm-font-family-monospace)'
              }}
              placeholder="Enter your mission parameters..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={handleOrchestration}
              disabled={loading || !input.trim()}
              className={clsx(
                'button button--primary button--lg button--block',
                loading && 'button--outline'
              )}
              style={{
                letterSpacing: '1px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'ORCHESTRATING...' : 'EXECUTE MISSION'}
            </button>
          </div>

          {(errorMessage || errorType) && (
            <div className="card__footer">
              <div className="alert alert--danger" role="alert">
                <strong>{errorType || 'Error'}:</strong> {errorMessage}
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="card__footer">
              <div className="alert alert--success" role="alert">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}