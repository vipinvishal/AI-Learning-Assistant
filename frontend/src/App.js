import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setExplanation('');
    setCopied(false);

    try {
      const response = await fetch('http://localhost:8000/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (response.ok) {
        setExplanation(data.explanation);
      } else {
        setExplanation(`Error: ${data.error}`);
      }
    } catch (error) {
      setExplanation(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Learning Assistant</h1>
        <p className="subtitle">Enter a topic you want to learn about</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Quantum Computing'"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <div className="loader" /> : 'Explain'}
          </button>
        </form>
        {explanation && (
          <div className="explanation">
            <div className="explanation-header">
              <h2>Explanation</h2>
              <button onClick={handleCopy} className="copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter style={a11yDark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {explanation}
            </ReactMarkdown>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
