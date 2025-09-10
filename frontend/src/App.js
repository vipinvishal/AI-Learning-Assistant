import React, { useState } from 'react';
import './App.css';
import { ReactMarkdown } from 'react-markdown';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100 bg-light">
      <header className="App-header bg-primary text-white p-4 shadow-sm">
        <h1 className="display-4">AI Learning Assistant</h1>
      </header>

      <main className="flex-grow-1 container my-5">
        <div className="card shadow-lg p-4 mb-5 bg-white rounded">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 text-primary">Ask Me Anything!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="promptInput" className="form-label visually-hidden">Enter your topic or question:</label>
                <textarea
                  className="form-control form-control-lg"
                  id="promptInput"
                  rows="3"
                  placeholder="e.g., Explain quantum physics simply, Summarize the history of AI, What is the capital of France?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Thinking...
                    </>
                  ) : (
                    'Get Answer'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger mt-4" role="alert">
                Error: {error}
              </div>
            )}

            {response && (
              <div className="response-container">
                <h3 className="text-primary mb-3">Groq Response:</h3>
                <p className="lead text-break">{response}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="App-footer bg-dark text-white p-3 text-center">
        <p className="mb-0">&copy; 2023 AI Learning Assistant. Powered by Groq.</p>
      </footer>
    </div>
  );
}

export default App;