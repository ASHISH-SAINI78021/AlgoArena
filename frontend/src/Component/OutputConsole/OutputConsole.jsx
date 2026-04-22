import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const OutputConsole = ({ output, isRunning, isAnalyzingComplexity, stdin, setStdin }) => {
  const { theme } = useTheme();

  return (
    <div style={{
      background: theme.bg,
      height: '100%',
      color: theme.text,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 16px',
        fontWeight: 'bold',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.subtext,
        background: theme.card,
        backdropFilter: `blur(${theme.blur})`
      }}>
        Console
      </div>
      <div style={{
        padding: '16px',
        flex: 1,
        overflowY: 'auto',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        color: isRunning ? theme.accent : theme.text
      }}>
        {isRunning ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="spinner" style={{ width: '12px', height: '12px', border: `2px solid ${theme.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            Running code...
          </div>
        ) : (
          <>
            {Array.isArray(output) ? output.map((block, i) => (
              <div
                key={i}
                style={{
                  color: block.type === 'stderr' ? '#ff5252' : block.type === 'info' ? theme.accent : theme.text,
                  fontWeight: block.type === 'info' ? 'bold' : 'normal',
                  marginBottom: '4px'
                }}
              >
                {block.content}
              </div>
            )) : output}
            {isAnalyzingComplexity && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: theme.accent, fontSize: '12px', fontWeight: 'bold' }}>
                <div className="spinner" style={{ width: '10px', height: '10px', border: `2px solid ${theme.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Analyzing Space & Time Complexity...
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ padding: '12px', borderTop: `1px solid ${theme.border}`, background: theme.sidebar }}>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Input for program (stdin)..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            color: '#fff',
            border: `1px solid ${theme.border}`,
            padding: '10px',
            height: '80px',
            borderRadius: '8px',
            fontSize: '12px',
            outline: 'none',
            resize: 'none'
          }}
        />
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OutputConsole;