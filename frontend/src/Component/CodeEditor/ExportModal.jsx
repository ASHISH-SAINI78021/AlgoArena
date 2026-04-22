import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Download, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const ExportModal = ({ isOpen, onClose, code, language, username, problemTitle }) => {
    const { theme } = useTheme();
    const captureRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        if (!captureRef.current) return;
        setIsExporting(true);
        toast.loading("Generating your beautiful solution card...", { id: "export" });
        try {
            // Small timeout to allow DOM to fully render fonts & syntax highlight
            await new Promise(r => setTimeout(r, 100));

            const canvas = await html2canvas(captureRef.current, {
                scale: 2, // High resolution
                backgroundColor: null, // Keep transparency if any
                useCORS: true
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `GhostCode_Solution_${problemTitle ? problemTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'Arena'}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Solution card downloaded!", { id: "export", icon: '🚀' });
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate image", { id: "export" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(10, 10, 18, 0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: theme.card, padding: '20px', borderRadius: '16px',
                border: `1px solid ${theme.border}`, width: '85%', maxWidth: '1000px',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                maxHeight: '90vh' // keep it inside viewport
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                        <Camera size={24} color="#a855f7" /> Generate Solution Card
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Preview Area Scroll Wrapper */}
                <div style={{ overflow: 'auto', background: '#0f172a', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px' }}>

                    {/* THE CAPTURE COMPONENT */}
                    <div ref={captureRef} style={{
                        background: 'linear-gradient(135deg, #1e1e2f 0%, #0f0f1b 100%)', // Standard dark background
                        padding: '40px',
                        borderRadius: '16px',
                        display: 'inline-block',
                        minWidth: '700px',
                        maxWidth: '100%', // Prevent it from stretching infinitely
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontFamily: "'Inter', sans-serif"
                    }}>

                        {/* Gradient Glow */}
                        <div style={{
                            background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                            height: '4px',
                            width: '100%',
                            borderRadius: '2px',
                            marginBottom: '25px',
                            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                        }}></div>

                        {/* macOS Window */}
                        <div style={{
                            background: '#1e1e1e',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* macOS Header */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#252526', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', color: '#858585', fontSize: '13px', fontFamily: 'monospace' }}>
                                    {problemTitle ? `${problemTitle.replace(/\s+/g, '')}.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}` : `solution.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}`}
                                </div>
                            </div>

                            {/* Code Content */}
                            <div style={{ padding: '0px', maxHeight: 'none', overflow: 'hidden' }}>
                                <SyntaxHighlighter
                                    language={language === 'c++' || language === 'cpp' ? 'cpp' : language}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, padding: '25px', background: 'transparent', fontSize: '15px', lineHeight: '1.5', fontFamily: "'Fira Code', 'Consolas', monospace" }}
                                    showLineNumbers={true}
                                    wrapLines={true}
                                >
                                    {code || '// No code written yet...'}
                                </SyntaxHighlighter>
                            </div>
                        </div>

                        {/* Footer / Branding */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '35px',
                            padding: '0 10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                                    borderRadius: '10px', padding: '10px'
                                }}>
                                    <Camera size={22} color="#fff" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '1px' }}>GhostCode</span>
                                    <span style={{ color: '#94a3b8', fontSize: '12px', letterSpacing: '0.5px' }}>{problemTitle || 'Realtime Arena'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '600' }}>Solved by @{username || 'Developer'}</span>
                                <span style={{ color: '#64748b', fontSize: '12px' }}>Created with love on GhostCode</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button onClick={onClose} style={{
                        padding: '10px 20px', borderRadius: '8px',
                        background: 'transparent', color: '#e2e8f0',
                        border: `1px solid rgba(255,255,255,0.2)`, cursor: 'pointer', fontWeight: '600'
                    }}>
                        Cancel
                    </button>
                    <button onClick={handleExport} disabled={isExporting} style={{
                        padding: '10px 20px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', color: '#fff',
                        border: 'none', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <Download size={18} /> {isExporting ? 'Generating...' : 'Download Image'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ExportModal;
