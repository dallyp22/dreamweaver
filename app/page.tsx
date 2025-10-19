'use client';

import { useState, useEffect } from 'react';

interface GenerationStatus {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: string;
  files?: {
    markdown: string;
    json: string;
    csv: string;
    summary: string;
  };
}

export default function Home() {
  const [city, setCity] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    setIsGenerating(true);
    setStatus(null);

    try {
      // Start generation
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const data = await response.json();
      const jobId = data.jobId;

      // Poll for status
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/status/${jobId}`);
        const statusData: GenerationStatus = await statusResponse.json();

        setStatus(statusData);

        if (statusData.status === 'completed' || statusData.status === 'failed') {
          clearInterval(pollInterval);
          setIsGenerating(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setStatus({
        jobId: '',
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d5a3d', marginBottom: '0.5rem' }}>
          🌲 WilderSeasons Edition Generator
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Generate city-specific 52-week family activity guides in minutes
        </p>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            City Name
          </label>
          <input
            id="city"
            type="text"
            className="input"
            placeholder="e.g., Madison, Wisconsin"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isGenerating}
          />

          <button type="submit" className="button" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Edition'}
          </button>
        </form>
      </div>

      {status && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Generation Progress</h2>

          {status.status === 'running' || status.status === 'pending' ? (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${status.progress}%` }}>
                  {status.progress}%
                </div>
              </div>
              <p style={{ color: '#666' }}>{status.message || 'Processing...'}</p>
            </>
          ) : status.status === 'completed' ? (
            <>
              <div className="status-message status-success">
                ✅ Generation complete!
              </div>

              <h3 style={{ marginBottom: '1rem' }}>Download Files:</h3>
              <div className="download-links">
                <a href={`/api/download/${status.jobId}/markdown`} className="download-link">
                  📄 Markdown
                </a>
                <a href={`/api/download/${status.jobId}/json`} className="download-link">
                  📊 JSON
                </a>
                <a href={`/api/download/${status.jobId}/csv`} className="download-link">
                  📈 CSV (Canva)
                </a>
                <a href={`/api/download/${status.jobId}/summary`} className="download-link">
                  📝 Summary
                </a>
              </div>
            </>
          ) : (
            <div className="status-message status-error">
              ❌ Generation failed: {status.error}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>How It Works</h2>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Enter a city name (e.g., "Des Moines, Iowa")</li>
          <li>Claude generates 60 real family-friendly places from its knowledge base</li>
          <li>AI curates and scores the best toddler-friendly activities</li>
          <li>Claude generates 52 weeks of activities using vetted recipes, songs, and books</li>
          <li>Download Markdown, JSON, CSV, and TXT files ready for use</li>
        </ol>
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
          ⏱️ Average generation time: 6-7 minutes
        </p>
      </div>
    </div>
  );
}

