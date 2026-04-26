import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Github, Camera, Volume2, VolumeX } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import axios from '../../axios/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useTheme, themes } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportModal from './ExportModal';
import { useSound } from '../../hooks/useSound';

const CodeEditor = ({ roomId, username, setOutput, setIsRunning, setIsAnalyzingComplexity, stdin, yDoc, provider, currentProblem, onRunComplete, disableAI }) => {
  const navigate = useNavigate();
  const { theme, themeName, setThemeName } = useTheme();
  const { playCompileSuccess, playCompileError, playGhostWhisper, playTestCorrect, playTestWrong, isSoundEnabled, toggleSound } = useSound();
  console.log("Current API Base URL:", import.meta.env.VITE_API_BASE_URL);
  const [editorInstance, setEditorInstance] = useState(null);
  const [monacoInstance, setMonacoInstance] = useState(null);
  const sharedDataRef = useRef(null);
  const yTextRef = useRef(null);
  const lastProblemIdRef = useRef(null);
  const currentProblemRef = useRef(null);
  const [language, setLanguage] = useState('cpp');
  const [stdinInput, setStdinInput] = useState(stdin || '');
  const [isExecuting, setIsExecuting] = useState(false);

  // Sync stdin when the prop changes (e.g. new duel problem loaded)
  useEffect(() => {
    if (stdin !== undefined) setStdinInput(stdin);
  }, [stdin]);

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

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  // GitHub State
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [repoName, setRepoName] = useState('algo-arena-solutions');
  const [commitMessage, setCommitMessage] = useState('Added solution from GhostCode');
  const [isPushing, setIsPushing] = useState(false);

  // Ghost Participant State
  const [isGhostActive, setIsGhostActive] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const lastGhostInterventionRef = useRef(0);
  const ghostDecorationRef = useRef([]);

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
    javascript: `// GhostCode JavaScript Env\nfunction solution() {\n    console.log("Hello World");\n}\nsolution();`,
    python: `# GhostCode Python Env\nprint("Hello World")`,
    cpp: `// GhostCode C++ Env\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}`,
    java: `// GhostCode Java Env\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}`
  };

  const getRandomColor = () => {
    const colors = ['#ff5252', '#e040fb', '#448aff', '#69f0ae', '#ffd740', '#ffab40'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);

    if (editor.getModel()) {
      editor.getModel().setEOL(0); // 0 = LF, 1 = CRLF. Forces LF to fix y-monaco off-by-one CRLF bugs.
    }
  };

  // ── Robust Auto-Save ──
  useEffect(() => {
    if (!editorInstance) return;
    const disposable = editorInstance.onDidChangeModelContent(() => {
      const val = editorInstance.getValue();
      const probId = currentProblemRef.current?._id || currentProblemRef.current?.title;
      if (probId && roomId) {
        localStorage.setItem(`duel_persist_code_${roomId}`, val);
        localStorage.setItem(`duel_persist_prob_${roomId}`, String(probId));
      }
    });
    return () => disposable.dispose();
  }, [editorInstance, roomId]);

  useEffect(() => {
    if (!editorInstance || !monacoInstance || !yDoc || !provider) return;

    const editor = editorInstance;
    const type = yDoc.getText('monaco');
    const sharedData = yDoc.getMap('sharedData');
    const ghostMap = yDoc.getMap('ghostState');
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

      // Add Ghost Cursor Styling if active
      if (ghostMap.get('active')) {
        styleContent += `
            .ghost-cursor {
                background-color: #8b5cf6 !important;
                width: 2px !important;
            }
            .ghost-cursor-head {
                border-left: 2px solid #8b5cf6 !important;
            }
            .ghost-cursor-head::after {
                content: "AI Ghost 👻";
                background-color: #8b5cf6;
                color: white;
                padding: 2px 6px;
                font-size: 10px;
                border-radius: 4px;
                position: absolute;
                top: -20px;
                left: -2px;
                white-space: nowrap;
                z-index: 110;
                font-weight: bold;
                box-shadow: 0 0 10px #8b5cf6;
            }
         `;
      }

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

    // Track activity for AI Ghost
    const handleLocalActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      // Also update awareness so the leader knows someone is active
      provider.awareness.setLocalStateField('lastActive', now);
      console.log('👻 [Activity] User activity detected at', new Date(now).toLocaleTimeString());
    };
    editor.onDidChangeModelContent(handleLocalActivity);
    editor.onMouseDown(handleLocalActivity);
    editor.onKeyDown(handleLocalActivity);
    console.log('👻 [Activity] Activity tracking initialized for AI Ghost');

    // Initialize/Observe Shared Ghost Map
    const syncGhost = () => {
      setIsGhostActive(ghostMap.get('active') || false);
      const hint = ghostMap.get('hint');
      const triggerId = ghostMap.get('triggerId');
      if (hint && triggerId !== lastGhostInterventionRef.current) {
        lastGhostInterventionRef.current = triggerId;
        toast(hint, { icon: '👻', duration: 5000, style: { background: '#8b5cf6', color: '#fff' } });
      }
    };
    ghostMap.observe(syncGhost);
    syncGhost();

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

            // ⚠️ RACE GUARD: Re-check after await — another effect may have inserted content while we waited
            if (type.length > 0) return;

            if (res.data && res.data.code && res.data.code.trim() !== '') {
              // Found saved code in DB!
              const savedLang = res.data.language || 'cpp';
              setLanguage(savedLang);
              type.insert(0, res.data.code);
              sharedData.set('language', savedLang);
              if (res.data.fileName) setCurrentFileName(res.data.fileName);
            } else {
              // No saved code from DB — prioritize Local Storage first, then boilerplate
              const currentLang = sharedLang || 'cpp';
              setLanguage(currentLang);
              const pendingProblem = currentProblemRef.current;

              let insertedBackup = false;
              if (pendingProblem) {
                const probId = pendingProblem._id || pendingProblem.title;
                const localBackupCode = localStorage.getItem(`duel_persist_code_${roomId}`);
                const localBackupProbId = localStorage.getItem(`duel_persist_prob_${roomId}`);
                if (localBackupCode && localBackupProbId === String(probId)) {
                  type.insert(0, localBackupCode);
                  insertedBackup = true;
                }
              }

              if (!insertedBackup) {
                if (pendingProblem) {
                  const boilerplate = pendingProblem.boilerplates?.['cpp'] || pendingProblem.boilerplates?.[currentLang] || templates['cpp'] || templates[currentLang];
                  type.insert(0, boilerplate);
                } else {
                  type.insert(0, templates[currentLang]);
                }
              }

              if (pendingProblem) {
                lastProblemIdRef.current = pendingProblem._id || pendingProblem.title;
                if (pendingProblem.title) setCurrentFileName(pendingProblem.title);
              }
              sharedData.set('language', currentLang);
            }
          } catch (error) {
            console.error("Failed to fetch recovery code:", error);
            // ⚠️ RACE GUARD: bail if content appeared during the failed request too
            if (type.length > 0) return;
            const currentLang = sharedLang || 'cpp';
            setLanguage(currentLang);
            const pendingProblem = currentProblemRef.current;

            let insertedBackup = false;
            if (pendingProblem) {
              const probId = pendingProblem._id || pendingProblem.title;
              const localBackupCode = localStorage.getItem(`duel_persist_code_${roomId}`);
              const localBackupProbId = localStorage.getItem(`duel_persist_prob_${roomId}`);
              if (localBackupCode && localBackupProbId === String(probId)) {
                type.insert(0, localBackupCode);
                insertedBackup = true;
              }
            }

            if (!insertedBackup) {
              if (pendingProblem) {
                const boilerplate = pendingProblem.boilerplates?.['cpp'] || pendingProblem.boilerplates?.[currentLang] || templates['cpp'] || templates[currentLang];
                type.insert(0, boilerplate);
              } else {
                type.insert(0, templates[currentLang]);
              }
            }

            if (pendingProblem) {
              lastProblemIdRef.current = pendingProblem._id || pendingProblem.title;
              if (pendingProblem.title) setCurrentFileName(pendingProblem.title);
            }
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

    const handleInsertAICode = (e) => {
      if (editorInstance) {
        editorInstance.setValue(e.detail);
      }
    };
    window.addEventListener('insertAICode', handleInsertAICode);

    return () => {
      binding.destroy();
      provider.off('sync', handleSync);
      provider.awareness.off('change', updateUsers);
      sharedData.unobserve(syncLanguage);

      // Cleanup styles on unmount
      const styleEl = document.getElementById('yjs-cursor-styles');
      if (styleEl) styleEl.innerHTML = '';
      window.removeEventListener('insertAICode', handleInsertAICode);
    };
  }, [yDoc, provider, roomId, username, editorInstance, monacoInstance]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    // Sync language to Yjs shared state
    if (sharedDataRef.current) {
      sharedDataRef.current.set('language', newLang);
    }
  };

  // AI Ghost Loop (Leader only)
  useEffect(() => {
    if (!isGhostActive || !editorInstance || !provider) {
      if (!isGhostActive) {
        console.log('👻 [Ghost] Ghost is NOT active. Click "Summon Ghost" to activate.');
      }
      return;
    }

    console.log('👻 [Ghost] Ghost is ACTIVE! Starting inactivity monitoring loop...');

    const interval = setInterval(async () => {
      // Leader is the user with lowest ClientID
      const states = provider.awareness.getStates();
      const clientIds = Array.from(states.keys()).sort((a, b) => a - b);
      const isLeader = clientIds[0] === provider.awareness.clientID;

      console.log(`👻 [Ghost Loop] Running... My ClientID: ${provider.awareness.clientID}, Leader ID: ${clientIds[0]}, Am I Leader: ${isLeader}`);

      if (!isLeader) {
        console.log('👻 [Ghost Loop] I am not the leader. Skipping this cycle.');
        return;
      }

      // Calculate global inactivity
      let lastGlobalActivity = lastActivityRef.current;
      states.forEach(state => {
        if (state.lastActive && state.lastActive > lastGlobalActivity) {
          lastGlobalActivity = state.lastActive;
        }
      });

      const timeSinceLastActivity = Date.now() - lastGlobalActivity;
      console.log(`👻 [Ghost Loop] ⏱️  Leader check. Inactive for: ${Math.floor(timeSinceLastActivity / 1000)}s / 15s required`);

      // Stop if activity is recent
      if (timeSinceLastActivity < 15000) {
        console.log(`👻 [Ghost Loop] ✋ Still active recently. Waiting...`);
        return;
      }

      console.log(`👻 [Ghost Loop] 🚨 TRIGGERING GHOST REVIEW! Inactivity threshold reached!`);
      toast.loading('Ghost is analyzing your code...', { id: 'ghost-analyzing', icon: '👻' });

      try {
        const code = editorInstance.getValue();
        const userCursors = users.map(u => ({ name: u.name, id: u.id }));

        console.log(`👻 [Ghost] Sending review request to backend...`);
        const res = await axios.post('/ai/ghost-review', {
          code,
          language,
          problemContext: currentProblem,
          userCursors
        });

        toast.dismiss('ghost-analyzing');
        console.log(`👻 [Ghost] Backend response:`, res.data);

        if (res.data.shouldIntervene) {
          console.log(`👻 [Ghost] ✅ Ghost decided to intervene!`);
          playGhostWhisper();
          const ghostMap = yDoc.getMap('ghostState');

          // Leader inserts the code into Yjs text if present
          if (res.data.codeToInsert && res.data.lineNumber) {
            console.log(`👻 [Ghost] 📝 Inserting code at line ${res.data.lineNumber}:`, res.data.codeToInsert);
            try {
              const model = editorInstance.getModel();
              const targetLine = Math.min(res.data.lineNumber, model.getLineCount());
              const offset = model.getOffsetAt({ lineNumber: targetLine, column: model.getLineMaxColumn(targetLine) });

              const textToInsert = `\n${res.data.codeToInsert}`;

              yDoc.transact(() => {
                yTextRef.current.insert(offset, textToInsert);
                ghostMap.set('lineNumber', targetLine + 1);
                ghostMap.set('column', 1);
                ghostMap.set('hint', res.data.comment);
                ghostMap.set('triggerId', Date.now());
              });
              console.log(`👻 [Ghost] ✅ Code inserted successfully!`);
              toast.success('Ghost wrote some code for you!', { icon: '👻' });
            } catch (insertErr) {
              console.error('👻 [Ghost] ❌ Failed to insert code:', insertErr);
              toast.error('Ghost failed to type...', { icon: '👻' });
            }
          } else {
            console.log(`👻 [Ghost] 💬 Showing hint only (no code insertion)`);
            yDoc.transact(() => {
              ghostMap.set('lineNumber', res.data.lineNumber);
              ghostMap.set('column', res.data.column || 1);
              ghostMap.set('hint', res.data.comment);
              ghostMap.set('triggerId', Date.now()); // New trigger for everyone
            });
          }

          // Clear cursor after 10s
          setTimeout(() => {
            ghostMap.set('lineNumber', null);
          }, 10000);
        } else {
          console.log(`👻 [Ghost] ℹ️  Ghost decided NOT to intervene. Code looks good!`);
          toast('Ghost is watching silently...', { icon: '👻', duration: 3000 });
        }
      } catch (err) {
        console.error('👻 [Ghost] ❌ Error during ghost review:', err);
        toast.dismiss('ghost-analyzing');
        toast.error('Ghost encountered an error: ' + (err.response?.data?.error || err.message), { icon: '👻' });
      }
    }, 15000);

    return () => {
      console.log('👻 [Ghost] Cleaning up ghost loop...');
      clearInterval(interval);
    };
  }, [isGhostActive, editorInstance, provider, users, language, currentProblem, yDoc]);

  // AI Ghost Visual Decorations
  useEffect(() => {
    if (!editorInstance || !monacoInstance || !isGhostActive) {
      if (editorInstance) ghostDecorationRef.current = editorInstance.deltaDecorations(ghostDecorationRef.current, []);
      return;
    }

    const ghostMap = yDoc.getMap('ghostState');
    const updateVisuals = () => {
      const line = ghostMap.get('lineNumber');
      const col = ghostMap.get('column') || 1;

      if (line) {
        ghostDecorationRef.current = editorInstance.deltaDecorations(ghostDecorationRef.current, [
          {
            range: new monacoInstance.Range(line, col, line, col + 1),
            options: {
              className: 'ghost-cursor',
              beforeContentClassName: 'ghost-cursor-head',
              isWholeLine: false
            }
          }
        ]);
      } else {
        ghostDecorationRef.current = editorInstance.deltaDecorations(ghostDecorationRef.current, []);
      }
    };

    ghostMap.observe(updateVisuals);
    updateVisuals();

    return () => {
      ghostMap.unobserve(updateVisuals);
      if (editorInstance) ghostDecorationRef.current = editorInstance.deltaDecorations(ghostDecorationRef.current, []);
    };
  }, [isGhostActive, editorInstance, monacoInstance, yDoc]);


  // Keep currentProblemRef always up to date (used by handleSync)
  useEffect(() => {
    currentProblemRef.current = currentProblem;
  }, [currentProblem]);

  // Handle Problem Change: Always insert boilerplate immediately (deduplicated by ID)
  useEffect(() => {
    if (!currentProblem) return;

    // Keep ref current
    currentProblemRef.current = currentProblem;

    // If Yjs not ready yet, handleSync will pick it up from currentProblemRef
    if (!editorInstance) return;

    const problemId = currentProblem._id || currentProblem.title;
    if (problemId && problemId === lastProblemIdRef.current) return;

    // ── RECOVERY LOGIC (Priority 1: Local Backup) ──
    const savedCode = localStorage.getItem(`duel_persist_code_${roomId}`);
    const savedProbId = localStorage.getItem(`duel_persist_prob_${roomId}`);
    const isYjsEmpty = yTextRef.current ? yTextRef.current.length === 0 : false;

    let textToInsert = '';

    if (savedCode && savedProbId === String(problemId)) {
      // If we don't have yDoc OR if yDoc is COMPLETELY empty, it means we are safe to overwrite
      if (!yDoc || isYjsEmpty) {
        textToInsert = savedCode;
      }
    }

    // ── BOILERPLATE LOGIC (Priority 2) ──
    if (!textToInsert) {
      textToInsert = currentProblem.boilerplates?.['cpp'] || currentProblem.boilerplates?.[language] || templates['cpp'] || templates[language];
    }

    const model = editorInstance.getModel();
    if (model) {
      // Execute edit cleanly so Monaco notifies Yjs without causing cursor jump bugs
      editorInstance.executeEdits('problem-change', [{
        range: model.getFullModelRange(),
        text: textToInsert
      }]);
    }

    // Only mark as done AFTER successful replacement
    lastProblemIdRef.current = problemId;
    if (currentProblem.title) setCurrentFileName(currentProblem.title);
  }, [currentProblem, editorInstance, yDoc, language]); // Added language to sync

  const handleResetBoilerplate = () => {
    if (editorInstance) {
      const boilerplate = currentProblem?.boilerplates?.['cpp'] || currentProblem?.boilerplates?.[language] || templates['cpp'] || templates[language];
      // Clear the ID ref so the problem-change effect can cleanly re-apply if needed
      lastProblemIdRef.current = null;

      const model = editorInstance.getModel();
      if (model) {
        editorInstance.executeEdits('reset-boilerplate', [{
          range: model.getFullModelRange(),
          text: boilerplate
        }]);
      }

      // Re-stamp after transact so the problem-change effect doesn't double-fire
      if (currentProblem) {
        lastProblemIdRef.current = currentProblem._id || currentProblem.title;
      }
      toast.success("Boilerplate reset!");
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
    link.download = `ghostcode_code_${roomId}.${extension}`;
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
    if (!editorInstance || isExecuting) return;
    const sourceCode = editorInstance.getValue();
    setIsExecuting(true);
    if (setIsRunning) setIsRunning(true);
    setIsAnalyzingComplexity(false);
    setOutput([]); // Clear output

    // ... (language mapping and test case extraction) ...
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      cpp: 'c++',
      java: 'java'
    };

    let testCaseInput = null;
    let expectedOutput = null;

    if (currentProblem) {
      if (currentProblem.sampleTestCases && currentProblem.sampleTestCases.length > 0) {
        testCaseInput = currentProblem.sampleTestCases[0].input;
        expectedOutput = currentProblem.sampleTestCases[0].output;
      } else if (currentProblem.testCases && currentProblem.testCases.length > 0) {
        testCaseInput = currentProblem.testCases[0].input;
        expectedOutput = currentProblem.testCases[0].output;
      }
    }

    const payloadStdin = (stdinInput && stdinInput.trim()) ? stdinInput : (testCaseInput !== null ? testCaseInput : stdin);

    try {
      const response = await axios.post('/code/execute', {
        language: languageMap[language],
        source: sourceCode,
        stdin: payloadStdin,
        version: '*'
      });

      if (response.data.run) {
        const { stdout, stderr, code } = response.data.run;
        const outputBlocks = [];
        let wasCorrect = true; // Default to true if no test case to fail

        // Distinguish between hard errors (code !== 0) and warnings (stderr with code === 0)
        const hasHardError = typeof code !== 'undefined' && code !== 0;

        if (hasHardError) {
          if (stdout) outputBlocks.push({ type: 'stdout', content: stdout });
          outputBlocks.push({ type: 'stderr', content: stderr || 'Execution failed with code ' + code });
          playCompileError();
          wasCorrect = false;
        } else {
          // It ran successfully (code === 0), even if there are warnings in stderr.
          if (stderr) {
            outputBlocks.push({ type: 'warning', content: stderr }); // Show warnings if they exist
          }

          if (expectedOutput !== null) {
            const actualClean = (stdout || "").trim();
            const expectedClean = expectedOutput.trim();
            wasCorrect = (actualClean === expectedClean);

            if (wasCorrect) {
              playTestCorrect();
              if (stdout) outputBlocks.push({ type: 'stdout', content: stdout });
              outputBlocks.push({ type: 'success', content: `\n✅ Passed Test Case!\nExpected: ${expectedOutput}\nYour Output: ${actualClean}` });
            } else {
              playTestWrong();
              outputBlocks.push({ type: 'stderr', content: `\n❌ Failed Test Case.\n\nInput:\n${testCaseInput}\n\nExpected:\n${expectedOutput}\n\nYour Output:\n${stdout || "(no output)"}` });
            }
          } else {
            playCompileSuccess();
            if (stdout) outputBlocks.push({ type: 'stdout', content: stdout });
          }

          // Shared "No Output" hint logic
          if (!stdout && !stderr) {
            outputBlocks.push({ type: 'info', content: 'Program executed with no output.' });
            const hint = (stdinInput && stdinInput.trim())
              ? "No output! Make sure your code is printing results to the console."
              : "No output! Try writing input in the field just below the console.";
            toast(hint, { icon: '💡', duration: 4000 });
          }
        }

        setOutput(outputBlocks);

        if (onRunComplete) {
          onRunComplete({ stdout, stderr, code, sourceCode });
        }

        // Hide initial "Running..." loader
        setIsExecuting(false);
        if (setIsRunning) setIsRunning(false);

        // Only analyze complexity if the code ran successfully AND (if applicable) the test case passed
        if (!hasHardError && wasCorrect) {
          // Start "Analyzing Complexity..." loader
          setIsAnalyzingComplexity(true);

          try {
            // Analyze complexity
            const res = await axios.post('/ai/analyze-complexity', {
              code: sourceCode,
              language: language
            });

            if (res.data.analysis) {
              setOutput(prev => [...prev, { type: 'info', content: "\n--- Performance Analysis ---\n" + res.data.analysis }]);
            }
          } catch (err) {
            console.error("Complexity Error:", err);
          } finally {
            setIsAnalyzingComplexity(false);
          }
        }

      } else {
        setOutput([{ type: 'stderr', content: "No output returned from server" }]);
        setIsExecuting(false);
        if (setIsRunning) setIsRunning(false);
      }

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message;
      setOutput([{ type: 'stderr', content: "Error executing code: " + errorMsg }]);
      playCompileError();
      setIsExecuting(false);
      if (setIsRunning) setIsRunning(false);
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
      <div style={{
        padding: '8px 12px',
        background: theme.sidebar,
        backdropFilter: `blur(${theme.blur})`,
        color: theme.text,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.border}`,
        transition: 'all 0.3s ease',
        minHeight: '50px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
          <span style={{ fontWeight: 'bold', color: theme.accent, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{currentFileName || 'Untitled Arena'}</span>
          <span style={{ fontSize: '10px', color: theme.subtext }}>ID: {roomId}</span>
        </div>
        <button onClick={copyRoomId} style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Copy Link</button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '6px' }}>
          {/* Connected users label */}
          <span style={{ fontSize: '10px', color: theme.subtext, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
            USERS
          </span>
          {[...users, ...(isGhostActive ? [{ name: 'AI Ghost', color: '#8b5cf6', isGhost: true }] : [])].map((u, i) => {
            const isMe = u.name === username;
            const initial = u.isGhost ? '👻' : u.name?.[0]?.toUpperCase() || '?';
            return (
              <div key={i} title={u.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: `rgba(${u.isGhost ? '139,92,246' : '255,255,255'},0.07)`,
                border: `1.5px solid ${isMe ? '#fff' : u.color}`,
                borderRadius: '100px',
                padding: '3px 10px 3px 4px',
                boxShadow: `0 0 12px ${u.color}55`,
                animation: u.isGhost ? 'pulse-purple 2s infinite' : 'none',
                transition: 'box-shadow 0.2s',
              }}>
                {/* Avatar circle */}
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: u.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: u.isGhost ? '12px' : '11px',
                  fontWeight: '800',
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${u.color}88`,
                }}>
                  {initial}
                </div>

                {/* Name */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isMe ? '#fff' : 'rgba(255,255,255,0.82)',
                  whiteSpace: 'nowrap',
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {u.isGhost ? 'AI Ghost' : u.name}
                </span>

                {/* Online dot */}
                {!u.isGhost && (
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 6px #4ade80',
                    animation: 'pulse-green 2s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                )}

                {/* "You" badge */}
                {isMe && (
                  <span style={{
                    fontSize: '9px', fontWeight: '700',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    color: '#fff',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                  }}>YOU</span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
            style={{ background: 'transparent', border: 'none', color: isSoundEnabled ? theme.accent : theme.subtext, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: theme.card, padding: '3px 8px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
            <Palette size={14} color={theme.accent} />
            <select
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              style={{
                background: 'transparent',
                color: theme.text,
                border: 'none',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Object.entries(themes).map(([key, t]) => (
                <option key={key} value={key} style={{ background: theme.bg }}>{t.name}</option>
              ))}
            </select>
          </div>

          <select value={language} onChange={handleLanguageChange} style={{ background: theme.card, color: theme.text, border: `1px solid ${theme.border}`, padding: '5px 8px', borderRadius: '6px', outline: 'none', fontSize: '12px' }}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button onClick={saveCode} style={{ background: theme.primary, border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', boxShadow: `0 4px 14px ${theme.primary}44`, whiteSpace: 'nowrap' }}>Save</button>
          <button onClick={downloadCode} style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>Download</button>
          <button onClick={() => setIsExportModalOpen(true)} style={{ background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)', whiteSpace: 'nowrap' }}>
            <Camera size={14} color="#fff" /> Share
          </button>

          {!disableAI && (
            <button onClick={() => {
              if (!user) {
                const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
                toast("Please login to use AI features", { icon: '🔐' });
                navigate(`/login?redirect=${redirectPath}`);
                return;
              }
              setIsAIModalOpen(true);
            }} style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)', whiteSpace: 'nowrap' }}>
              <Sparkles size={14} /> AI
            </button>
          )}

          <button onClick={() => {
            if (!user) {
              const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
              toast("Please login to use GitHub features", { icon: '🔐' });
              navigate(`/login?redirect=${redirectPath}`);
              return;
            }
            if (!isGithubConnected) handleConnectGithub();
            else setIsGithubModalOpen(true);
          }} style={{ background: '#24292e', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', whiteSpace: 'nowrap' }}>
            <Github size={14} /> {isGithubConnected ? 'Push' : 'Connect'}
          </button>

          {!disableAI && (
            <button
              onClick={() => {
                if (!user) {
                  const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
                  toast("Please login to summon the Ghost", { icon: '👻' });
                  navigate(`/login?redirect=${redirectPath}`);
                  return;
                }
                const ghostMap = yDoc.getMap('ghostState');
                const currentActive = ghostMap.get('active');
                ghostMap.set('active', !currentActive);
                if (!currentActive) {
                  toast.success("Ghost Participant Summoned!", { icon: '👻' });
                  console.log('👻 [Ghost] Ghost activated by user! Check console for activity logs.');
                } else {
                  toast('Ghost dismissed', { icon: '👻' });
                  console.log('👻 [Ghost] Ghost deactivated by user.');
                }
              }}
              title={isGhostActive ? "Click to dismiss the AI Ghost" : "Activate AI Ghost - will write code hints after 30s of inactivity"}
              style={{
                background: isGhostActive ? 'rgba(139, 92, 246, 0.2)' : theme.card,
                border: `1px solid ${isGhostActive ? '#8b5cf6' : theme.border}`,
                color: isGhostActive ? '#a78bfa' : theme.text,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={14} color={isGhostActive ? '#d8b4fe' : theme.accent} />
              {isGhostActive ? "Release Ghost" : "Summon Ghost"}
            </button>
          )}

          <button onClick={handleResetBoilerplate} style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }} title="Reset boilerplate">Reset</button>
          <button onClick={runCode} disabled={isExecuting} style={{ background: '#22c55e', opacity: isExecuting ? 0.7 : 1, border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: isExecuting ? 'not-allowed' : 'pointer', fontSize: '12px', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {isExecuting && <div className="spinner" style={{ width: '10px', height: '10px', border: `2px solid #fff`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
            {isExecuting ? 'Running...' : 'Run'}
          </button>
        </div>
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
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          theme={theme.monaco}
          defaultLanguage={language}
          language={language}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            automaticLayout: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 20 }
          }}
        />
      </div>

      {/* ── Stdin Terminal Panel ── */}
      <div style={{
        background: '#0a0f1a',
        borderTop: `1px solid ${theme.border}`,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxHeight: '140px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>$ stdin</span>
          <span style={{ fontSize: '9px', color: '#334155', fontStyle: 'italic' }}>Editable — passed to your program on Run</span>
        </div>
        <textarea
          value={stdinInput}
          onChange={e => setStdinInput(e.target.value)}
          placeholder="Type your program input here, one value per line…"
          spellCheck={false}
          style={{
            background: 'transparent',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            color: '#22c55e',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '13px',
            outline: 'none',
            padding: '6px 10px',
            resize: 'none',
            height: '72px',
            width: '100%',
            lineHeight: '1.6',
            boxSizing: 'border-box'
          }}
        />
      </div>
      {/* Modals placed here */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        code={editorInstance ? editorInstance.getValue() : ''}
        language={language}
        username={username}
        problemTitle={currentProblem?.title || 'Arena Setup'}
      />
    </div>
  );
};

export default CodeEditor;