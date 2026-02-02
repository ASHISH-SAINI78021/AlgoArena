import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Github } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import axios from '../../axios/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CodeEditor = ({ roomId, username, setOutput, setIsRunning, yDoc, provider }) => {
  const navigate = useNavigate();
  console.log("Current API Base URL:", import.meta.env.VITE_API_BASE_URL);
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const sharedDataRef = useRef(null);
  const yTextRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedCodePreview, setGeneratedCodePreview] = useState(null);

  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');


  // GitHub State
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [repoName, setRepoName] = useState('algo-arena-solutions');
  const [commitMessage, setCommitMessage] = useState('Added solution from AlgoArena');
  const [isPushing, setIsPushing] = useState(false);

  // Check GitHub Status on Mount
  useEffect(() => {
    const checkGithubStatus = async () => {
      try {
        const res = await axios.get('/github/status');
        if (res.data.connected) {
          setIsGithubConnected(true);
          setGithubUsername(res.data.username);
        }
      } catch (err) {
        console.error("Failed to check GitHub status");
      }
    };
    checkGithubStatus();

    // Listen for popup success message
    const handleMessage = (event) => {
      if (event.data.type === 'GITHUB_CONNECTED') {
        setIsGithubConnected(true);
        toast.success("GitHub Connected!");
        checkGithubStatus(); // Get username
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGithub = async () => {
    try {
      const res = await axios.get('/github/auth');
      window.open(res.data.url, 'GitHub Auth', 'width=600,height=700');
    } catch (err) {
      toast.error("Failed to start GitHub connection");
    }
  };

  const handlePushToGithub = async () => {
    if (!repoName || !commitMessage) {
      toast.error("Please fill in repository name and commit message");
      return;
    }

    setIsPushing(true);
    try {
      const content = editorInstance.getValue();
      // Determine filename based on room/problem name or timestamp
      // For now using timestamp-based name or currentFileName if set
      const extMap = { javascript: 'js', python: 'py', cpp: 'cpp', java: 'java' };
      const ext = extMap[language] || 'txt';
      const fileName = currentFileName ? `${currentFileName}.${ext}` : `solution_${Date.now()}.${ext}`;

      const res = await axios.post('/github/push', {
        repoName,
        fileName,
        content,
        message: commitMessage
      });

      toast.success(
        <span>
          Pushed successfully!
          <a href={res.data.htmlUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px', color: '#fff', textDecoration: 'underline' }}>View on GitHub</a>
        </span>
      );
      setIsGithubModalOpen(false);
    } catch (error) {
      toast.error("Failed to push: " + (error.response?.data?.error || error.message));
    } finally {
      setIsPushing(false);
    }
  };

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
    const type = yDoc.getText('monaco');
    const sharedData = yDoc.getMap('sharedData');
    sharedDataRef.current = sharedData;
    yTextRef.current = type;

    const binding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);

    // Check for cached code from unauthenticated session
    const cachedCode = sessionStorage.getItem(`guest_code_${roomId}`);
    if (cachedCode && type.length === 0) {
      type.insert(0, cachedCode);
      sessionStorage.removeItem(`guest_code_${roomId}`);
      toast.success("Restored your work! Click Save again to finish.", { icon: '💾' });
    }

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
            const res = await axios.get(`/code/${roomId}`);
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
          axios.get(`/code/${roomId}`)
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
    const inviteLink = `${window.location.origin}/realtime-coding?roomId=${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  const { user } = useAuth();

  const saveCode = async () => {
    if (!editorInstance) return;

    if (!user) {
      // Guest trying to save -> Cache and Redirect
      const sourceCode = editorInstance.getValue();
      sessionStorage.setItem(`guest_code_${roomId}`, sourceCode);
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?redirect=${redirectPath}`);
      return;
    }

    // Open Custom Modal
    setNewFileName(currentFileName || '');
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!newFileName.trim()) {
      toast.error("File name cannot be empty");
      return;
    }

    const sourceCode = editorInstance.getValue();
    try {
      const res = await axios.post('/code/save', {
        roomId,
        code: sourceCode,
        language,
        userId: user?.id,
        fileName: newFileName.trim()
      });
      setCurrentFileName(newFileName.trim());
      setIsSaveModalOpen(false);
      toast.success("Code Saved Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save code");
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
      const response = await axios.post('/code/execute', {
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

  // Extract code blocks from markdown-style response
  const extractCodeBlocks = (text) => {
    if (!text) return [];

    // Try to extract markdown code blocks (```language\ncode\n```)
    // Improved regex to allow optional whitespace after backticks
    const codeBlockRegex = /```[ \w]*\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }

    // If markdown blocks found, return them
    if (blocks.length > 0) {
      return blocks;
    }

    // Fallback: If no markdown blocks, check if entire response looks like code
    // (no explanatory text like "Here's", "The issue", etc.)
    const hasExplanation = /\b(here'?s|the issue|the problem|you should|explanation|mistake|error is|wrong with)\b/i.test(text);

    if (!hasExplanation) {
      // Looks like pure code, return as single block
      return [text.trim()];
    }

    // If it has explanation but no code blocks, return empty
    return [];
  };

  // Remove code blocks from text to get explanations only
  const getExplanationText = (text) => {
    if (!text) return '';

    // Remove markdown code blocks
    let explanation = text.replace(/```[ \w]*\n[\s\S]*?```/g, '[CODE BLOCK]').trim();

    // Check if it's pure code (same logic as extractCodeBlocks)
    const hasExplanation = /\b(here'?s|the issue|the problem|you should|explanation|mistake|error is|wrong with)\b/i.test(text);
    if (!hasExplanation && !text.includes('```')) {
      return ''; // No explanation for pure code
    }

    // If nothing left after removing code blocks, return empty
    if (explanation.length === 0 || explanation === '[CODE BLOCK]') {
      return '';
    }

    return explanation;
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const currentCode = editorInstance.getValue();
      const res = await axios.post('/ai/generate', {
        prompt: aiPrompt,
        currentCode,
        language
      });

      const generatedCode = res.data.generatedCode;
      if (generatedCode) {
        // Show preview instead of auto-inserting
        setGeneratedCodePreview(generatedCode);
        toast.success("Code generated! Review it before inserting.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "AI failed to generate code";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAcceptCode = () => {
    if (generatedCodePreview && yDoc && yTextRef.current) {
      // Extract only code blocks, not explanations
      const codeBlocks = extractCodeBlocks(generatedCodePreview);
      const codeToInsert = codeBlocks.length > 0 ? codeBlocks.join('\n\n') : generatedCodePreview;

      yDoc.transact(() => {
        yTextRef.current.delete(0, yTextRef.current.length);
        yTextRef.current.insert(0, codeToInsert);
      });
      toast.success("Code inserted! (Explanations excluded)");
      setGeneratedCodePreview(null);
      setIsAIModalOpen(false);
      setAiPrompt('');
    }
  };

  const handleRejectCode = () => {
    setGeneratedCodePreview(null);
    toast('Response rejected. Try a different prompt.', { icon: '❌' });
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#1e1e1e', color: '#fff', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{currentFileName || 'Untitled Arena'}</span>
          <span style={{ fontSize: '10px', color: '#666' }}>ID: {roomId}</span>
        </div>
        <button onClick={copyRoomId} style={{ background: '#444', border: 'none', color: '#fff', padding: '5px 8px', cursor: 'pointer', fontSize: '12px' }}>Copy Link</button>

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
        <button onClick={() => setIsAIModalOpen(true)} style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={14} /> AI
        </button>
        <button onClick={() => {
          if (!isGithubConnected) handleConnectGithub();
          else setIsGithubModalOpen(true);
        }} style={{ background: '#24292e', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Github size={14} /> {isGithubConnected ? 'Push' : 'Connect'}
        </button>
        <button onClick={runCode} style={{ background: '#28a745', border: 'none', color: '#fff', padding: '5px 10px', cursor: 'pointer' }}>Run</button>
      </div>

      {/* AI Prompt Modal */}
      {isAIModalOpen && !generatedCodePreview && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1e293b',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #8b5cf6',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 2000,
          width: '500px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#8b5cf6" /> AI Coding Assistant
          </h3>
          <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '12px' }}>
            💡 Ask for code help only. Non-coding requests will be rejected.
          </p>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Write a function to find binary search in Python..."
            style={{
              width: '100%',
              height: '100px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff',
              padding: '10px',
              fontSize: '14px',
              marginBottom: '15px',
              resize: 'none',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { setIsAIModalOpen(false); setAiPrompt(''); }}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAIGenerate}
              disabled={isAiGenerating || !aiPrompt.trim()}
              style={{
                background: '#8b5cf6',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: (isAiGenerating || !aiPrompt.trim()) ? 0.5 : 1
              }}
            >
              {isAiGenerating ? 'Generating...' : 'Generate Code'}
            </button>
          </div>
        </div>
      )}

      {/* Save File Modal */}
      {isSaveModalOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1e293b',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #3b82f6',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 2000,
          width: '400px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💾 Save Code
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>File Name</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g. MySolution"
              style={{
                width: '100%',
                padding: '10px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff',
                outline: 'none'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleConfirmSave()}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsSaveModalOpen(false)}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSave}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Save to Database
            </button>
          </div>
        </div>
      )}

      {/* GitHub Push Modal */}
      {isGithubModalOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1e293b',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #24292e',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 2000,
          width: '400px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Github size={18} color="#fff" /> Push to GitHub
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Repository Name"
              style={{
                width: '100%',
                padding: '8px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>Commit Message</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message"
              style={{
                width: '100%',
                padding: '8px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsGithubModalOpen(false)}
              style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handlePushToGithub}
              disabled={isPushing}
              style={{
                background: '#24292e',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: isPushing ? 0.7 : 1
              }}
            >
              {isPushing ? 'Pushing...' : 'Push Code'}
            </button>
          </div>
        </div>
      )}

      {/* AI Preview Modal - ChatGPT Style */}
      {generatedCodePreview && (() => {
        const codeBlocks = extractCodeBlocks(generatedCodePreview);
        const explanationText = getExplanationText(generatedCodePreview);
        const hasExplanation = explanationText && explanationText !== '[CODE BLOCK]' && explanationText.length > 10;

        return (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#1e293b',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #8b5cf6',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            zIndex: 2000,
            width: '800px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#8b5cf6" /> AI Response
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '12px' }}>
              💡 Only code blocks will be inserted into your editor. Explanations are for reference.
            </p>

            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Explanation Section */}
              {hasExplanation && (
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>📝 Explanation</div>
                  <div style={{
                    color: '#e2e8f0',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {explanationText.replace(/\[CODE BLOCK\]/g, '').trim()}
                  </div>
                </div>
              )}

              {/* Code Blocks Section */}
              {codeBlocks.map((code, index) => (
                <div key={index} style={{
                  background: '#0f172a',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '6px 12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    💻 Code Block {codeBlocks.length > 1 ? `${index + 1}/${codeBlocks.length}` : ''}
                  </div>
                  <pre style={{
                    margin: 0,
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    padding: '15px',
                    background: '#0a0f1a'
                  }}>
                    {code}
                  </pre>
                </div>
              ))}

              {/* Fallback if no code blocks detected */}
              {codeBlocks.length === 0 && (
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '15px'
                }}>
                  <pre style={{
                    margin: 0,
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {generatedCodePreview}
                  </pre>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button
                onClick={handleRejectCode}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ❌ Reject
              </button>
              <button
                onClick={handleAcceptCode}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✅ Accept Code {codeBlocks.length > 0 ? `(${codeBlocks.length} block${codeBlocks.length > 1 ? 's' : ''})` : ''}
              </button>
            </div>
          </div>
        );
      })()}
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