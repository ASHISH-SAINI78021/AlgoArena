import React, { useState } from 'react';

const OutputConsole = ({ output, isRunning }) => {
  const [input, setInput] = useState("");

  return (
    <div style={{ background: '#1e1e1e', height: '100%', color: '#ddd', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid #333', padding: '10px', fontWeight: 'bold' }}>
        Console
      </div>
      <div style={{ padding: '10px', flex: 1, overflowY: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {isRunning ? "Running code..." : output}
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid #333' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Input for program (stdin)... (Not implemented yet)"
          style={{ width: '100%', background: '#252526', color: '#fff', border: 'none', padding: '5px', height: '60px' }}
        />
      </div>
    </div>
  );
};

export default OutputConsole;