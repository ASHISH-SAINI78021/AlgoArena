
import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CodeEditor = ({ roomId, username, setOutput, setIsRunning, yDoc, provider }) => {
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const sharedDataRef = useRef(null);
  const yTextRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');

  // Explicitly update model language when state changes
  useEffect(() => {
    if (editorInstance && monacoInstance) {
      const model = editorInstance.getModel();
      if (model) {
        monacoInstance.editor.setModelLanguage(model, language);
      }
    }
  }, [language, editorInstance, monacoInstance]);

  // Boilerplate Templates
  const templates = {
    javascript: `// AlgoArena JavaScript Env\nconsole.log("Hello World");`,
    python: `# AlgoArena Python Env\nprint("Hello World")`,
    cpp: `// AlgoArena C++ Env\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`,
    java: `// AlgoArena Java Env\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`
  };

  const getRandomColor = () => {
    const colors = ['#ff5252', '#e040fb', '#448aff', '#69f0ae', '#ffd740', '#ffab40'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
  };

  useEffect(() => {
    if (!editorInstance || !monacoInstance || !yDoc || !provider) return;

    const editor = editorInstance;

    // Set User Awareness with a stable color for this session
    const color = getRandomColor();
    provider.awareness.setLocalStateField('user', {
      name: username || 'Anonymous',
      color: color
    });

    // Track user count and names
    const updateUsers = () => {
      const states = provider.awareness.getStates();
      setUserCount(states.size);

      const activeUsers = [];
      let styleContent = '';

      states.forEach((state, clientId) => {
        if (state.user) {
          activeUsers.push({
            id: clientId,
            name: state.user.name,
            color: state.user.color
          });

          styleContent += `
            .yRemoteSelectionHead-${clientId} {
                border-color: ${state.user.color} !important;
            }
            .yRemoteSelectionHead-${clientId}::after {
                content: "${state.user.name}";
                background-color: ${state.user.color};
                color: white;
                padding: 2px 4px;
                font-size: 10px;
                border-radius: 4px;
                position: absolute;
                top: -20px;
                left: -2px;
                white-space: nowrap;
                z-index: 100;
            }
          `;
        }
      });

      setUsers(activeUsers);

      let styleEl = document.getElementById('yjs-cursor-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'yjs-cursor-styles';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = styleContent;
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    const type = yDoc.getText('monaco');
    const sharedData = yDoc.getMap('sharedData');
    sharedDataRef.current = sharedData;
    yTextRef.current = type;

    const binding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);

    // Sync language from shared state
    const syncLanguage = () => {
      const sharedLang = sharedData.get('language');
      if (sharedLang && sharedLang !== language) {
        setLanguage(sharedLang);
      }
    };

    sharedData.observe(syncLanguage);

    // CRITICAL: Wait for sync before deciding to insert template
    const handleSync = async (isSynced) => {
      if (isSynced) {
        const sharedLang = sharedData.get('language');

        // Only insert template/saved code if the document is totally empty (first setup in this Yjs session)
        if (type.length === 0) {
          try {
            const res = await axios.get(`http://localhost:5000/api/code/${roomId}`);
            if (res.data && res.data.code && res.data.code.trim() !== '') {
              // Found saved code in DB!
              const savedLang = res.data.language || 'javascript';
              setLanguage(savedLang);
              type.insert(0, res.data.code);
              sharedData.set('language', savedLang);
              if (res.data.fileName) setCurrentFileName(res.data.fileName);
            } else {
              // No saved code, use default template
              const currentLang = sharedLang || 'javascript';
              setLanguage(currentLang);
              type.insert(0, templates[currentLang]);
              sharedData.set('language', currentLang);
            }
          } catch (error) {
            console.error("Failed to fetch recovery code:", error);
            // Default fallback
            const currentLang = sharedLang || 'javascript';
            setLanguage(currentLang);
            type.insert(0, templates[currentLang]);
          }
        } else {
          // If document has content, sync the language state to match the shared Yjs state
          if (sharedLang) setLanguage(sharedLang);

          // Also fetch metadata (filename) from backend if not in sync
          axios.get(`http://localhost:5000/api/code/${roomId}`)
            .then(res => {
              if (res.data.fileName) setCurrentFileName(res.data.fileName);
            });
        }
      }
    };

    // Robust Sync initialization: check if already synced or wait for event
    if (provider.synced) {
      handleSync(true);
    } else {
      provider.on('sync', handleSync);
    }

    return () => {
      binding.destroy();
      provider.off('sync', handleSync);
      provider.awareness.off('change', updateUsers);
      sharedData.unobserve(syncLanguage);

      // Cleanup styles on unmount
      const styleEl = document.getElementById('yjs-cursor-styles');
      if (styleEl) styleEl.innerHTML = '';
    };
  }, [yDoc, provider, roomId, username, editorInstance, monacoInstance]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    // Sync language to Yjs shared state
    if (sharedDataRef.current) {
      sharedDataRef.current.set('language', newLang);
    }

    // Auto-switch template if the code is empty or untouched (any of the default templates)
    if (editorInstance && yTextRef.current && yDoc) {
      // ultra-robust check: remove all whitespace for comparison
      const collapse = (str) => str?.replace(/\s+/g, '') || '';
      const currentCodeCollapsed = collapse(editorInstance.getValue());

      const isAnyDefaultTemplate = Object.values(templates).some(t => collapse(t) === currentCodeCollapsed);
      const isEmpty = currentCodeCollapsed === '';

      if (isEmpty || isAnyDefaultTemplate) {
        yDoc.transact(() => {
          yTextRef.current.delete(0, yTextRef.current.length);
          yTextRef.current.insert(0, templates[newLang]);
        });
      }
    }
  };

  const downloadCode = () => {
    if (!editorInstance) return;
    const content = editorInstance.getValue();
    const extMap = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java'
    };
    const extension = extMap[language] || 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algoarena_code_${roomId}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  const { user } = useAuth();

  const saveCode = async () => {
    if (!editorInstance) return;

    let fileName = currentFileName;
    const newName = window.prompt("Enter a unique name for this file:", currentFileName || "");

    if (newName === null) return; // Cancelled
    if (!newName.trim()) {
      alert("File name cannot be empty");
      return;
    }
    fileName = newName.trim();

    const sourceCode = editorInstance.getValue();
    try {
      const res = await axios.post('http://localhost:5000/api/code/save', {
        roomId,
        code: sourceCode,
        language,
        userId: user?.id,
        fileName: fileName
      });
      setCurrentFileName(fileName);
      alert("Code Saved Successfully as " + fileName);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save code");
    }
  };

  const runCode = async () => {
    if (!editorInstance) return;
    const sourceCode = editorInstance.getValue();
    setIsRunning(true);
    setOutput([]);

    // Map language to Piston API format
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      cpp: 'c++',
      java: 'java'
    };

    try {
      const response = await axios.post('http://localhost:5000/api/code/execute', {
        language: languageMap[language],
        source: sourceCode,
        version: '*'
      });

      if (response.data.run) {
        setOutput(response.data.run.output);
      } else {
        setOutput("No output returned");
      }

    } catch (error) {
      console.error(error);
      setOutput("Error executing code: " + (error.response?.data?.error || error.message));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#1e1e1e', color: '#fff', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{currentFileName || 'Untitled Arena'}</span>
          <span style={{ fontSize: '10px', color: '#666' }}>ID: {roomId}</span>
        </div>
        <button onClick={copyRoomId} style={{ background: '#444', border: 'none', color: '#fff', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>Copy</button>

        <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
          {users.map((u, i) => (
            <div key={i} style={{
              background: u.color,
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: u.name === username ? '1px solid #fff' : 'none'
            }} title={u.name}>
              {u.name} {u.name === username ? '(You)' : ''}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}></div>

        <select value={language} onChange={handleLanguageChange} style={{ background: '#333', color: '#fff', padding: '5px' }}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button onClick={saveCode} style={{ background: '#007acc', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer' }}>Save</button>
        <button onClick={downloadCode} style={{ background: '#6c757d', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer' }}>Download</button>
        <button onClick={runCode} style={{ background: '#28a745', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer' }}>Run</button>
      </div>
      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage={language}
        language={language}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default CodeEditor;