import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Download, Camera, Ghost } from 'lucide-react';
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
        const tid = toast.loading("Generating your beautiful solution card...");
        try {
            await new Promise(r => setTimeout(r, 150));
            const canvas = await html2canvas(captureRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                logging: false,
                allowTaint: true
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `GhostCode_${problemTitle?.replace(/\s+/g, '_') || 'Solution'}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Solution card downloaded!", { id: tid });
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate image", { id: tid });
        } finally {
            setIsExporting(false);
        }
    };

    const modalContent = (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(5, 5, 10, 0.9)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999999, padding: '20px'
        }}>
            <div style={{
                background: '#11111a', padding: '24px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '1000px',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                maxHeight: '94vh', position: 'relative'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '8px', borderRadius: '10px' }}>
                            <Camera size={20} color="#a855f7" />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>Generate Solution Card</h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8',
                        cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Area Scroll Wrapper */}
                <div style={{
                    overflowY: 'auto', overflowX: 'auto', background: '#05050a', borderRadius: '14px',
                    display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '50px 30px',
                    flex: 1, border: '1px solid rgba(255,255,255,0.05)'
                }}>

                    {/* THE CAPTURE COMPONENT */}
                    <div ref={captureRef} style={{
                        background: 'linear-gradient(135deg, #1e1e2f 0%, #0f0f1b 100%)',
                        padding: '40px',
                        borderRadius: '24px',
                        display: 'inline-block',
                        minWidth: '700px',
                        maxWidth: '90%',
                        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontFamily: "'Inter', sans-serif"
                    }}>

                        {/* Top Gradient Accent */}
                        <div style={{
                            background: 'linear-gradient(to right, #8b5cf6, #ec4899, #3b82f6)',
                            height: '5px',
                            width: '100%',
                            borderRadius: '10px',
                            marginBottom: '30px',
                            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                        }}></div>

                        {/* Window Frame */}
                        <div style={{
                            background: '#1e1e1e',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {/* Window Top Bar (Mac Style) */}
                            <div style={{
                                display: 'flex', alignItems: 'center', padding: '14px 20px',
                                background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 8px rgba(255,95,86,0.4)' }}></div>
                                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 8px rgba(255,189,46,0.4)' }}></div>
                                    <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 8px rgba(39,201,63,0.4)' }}></div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '500', fontFamily: "'Fira Code', monospace", opacity: 0.8 }}>
                                    {problemTitle ? `${problemTitle.replace(/\s+/g, '')}.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}` : `solution.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}`}
                                </div>
                            </div>

                            {/* Code Area */}
                            <div style={{ padding: '0px' }}>
                                <SyntaxHighlighter
                                    language={language === 'c++' || language === 'cpp' ? 'cpp' : language}
                                    style={vscDarkPlus}
                                    customStyle={{ margin: 0, padding: '30px', background: 'transparent', fontSize: '15px', lineHeight: '1.6', fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}
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
                            marginTop: '40px',
                            padding: '0 10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                    borderRadius: '12px', padding: '10px'
                                }}>
                                    <Ghost size={24} color="#fff" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '20px', letterSpacing: '0.5px' }}>GhostCode</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '500' }}>{problemTitle || 'Arena Master'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>@{username || 'Soldier'}</span>
                                <span style={{ color: 'rgba(139, 92, 246, 0.6)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>LeetCode Style Card</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '10px' }}>
                    <button onClick={onClose} style={{
                        padding: '12px 24px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)', color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        Keep Editing
                    </button>
                    <button onClick={handleExport} disabled={isExporting} style={{
                        padding: '12px 28px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff',
                        border: 'none', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: '700',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => { !isExporting && (e.target.style.transform = 'translateY(-2px)'); !isExporting && (e.target.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.6)') }}
                        onMouseLeave={(e) => { !isExporting && (e.target.style.transform = 'translateY(0)'); !isExporting && (e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.4)') }}
                    >
                        {isExporting ? 'Generating...' : <><Download size={20} /> Download Image</>}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ExportModal;
