import React from 'react';
import { HelpCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const ProblemDescription = ({ problem }) => {
    const { theme } = useTheme();
    const [copied, setCopied] = React.useState(null);

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(null), 2000);
    };

    if (!problem) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.subtext,
                padding: '40px',
                textAlign: 'center',
                background: theme.bg
            }}>
                <HelpCircle size={64} style={{ marginBottom: '24px', opacity: 0.2, color: theme.accent }} />
                <h3 style={{ color: theme.subtext, marginBottom: '10px' }}>No Problem Selected</h3>
                <p style={{ fontSize: '14px' }}>Choose a challenge from the list to begin your coding journey.</p>
            </div>
        );
    }

    const formatDescription = (text) => {
        if (!text) return { __html: '' };

        // Basic Markdown-ish formatting
        let formatted = text
            .replace(/`([^`]+)`/g, `<code style="background: ${theme.accent}22; padding: 2px 6px; border-radius: 4px; color: ${theme.accent}; font-family: 'Fira Code', monospace; font-size: 0.9em;">$1</code>`)
            .replace(/\*\*([^*]+)\*\*/g, `<strong style="color: ${theme.text};">$1</strong>`)
            .replace(/\n\n/g, '<br/><br/>');

        return { __html: formatted };
    };

    return (
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            color: theme.text,
            background: theme.bg,
            fontFamily: "'Inter', sans-serif",
            scrollbarWidth: 'thin',
            scrollbarColor: `${theme.border} transparent`,
            transition: 'all 0.4s ease'
        }}>
            {/* Header section */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: theme.text, letterSpacing: '-0.025em' }}>
                        {problem.title}
                    </h1>
                    <span style={{
                        fontSize: '11px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: problem.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.15)' : problem.difficulty === 'Medium' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: problem.difficulty === 'Easy' ? '#4ade80' : problem.difficulty === 'Medium' ? '#facc15' : '#f87171',
                        border: `1px solid ${problem.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.3)' : problem.difficulty === 'Medium' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                        {problem.difficulty}
                    </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {problem.tags?.map(tag => (
                        <span key={tag} style={{
                            fontSize: '10px',
                            background: theme.card,
                            color: theme.subtext,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            border: `1px solid ${theme.border}`
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '20px' }}>
                {/* Description */}
                <div style={{ marginBottom: '32px' }}>
                    <div
                        style={{ fontSize: '15px', lineHeight: '1.7', color: theme.subtext }}
                        dangerouslySetInnerHTML={formatDescription(problem.description)}
                    />
                </div>

                {/* Input/Output Format */}
                {(problem.inputFormat || problem.outputFormat) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                        {problem.inputFormat && (
                            <div>
                                <h4 style={{ color: theme.text, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '4px', height: '14px', background: theme.accent, borderRadius: '2px' }} />
                                    Input Format
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px', color: theme.subtext }}>{problem.inputFormat}</p>
                            </div>
                        )}
                        {problem.outputFormat && (
                            <div>
                                <h4 style={{ color: theme.text, fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '4px', height: '14px', background: theme.accent, borderRadius: '2px' }} />
                                    Output Format
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px', color: theme.subtext }}>{problem.outputFormat}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Examples */}
                <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ color: theme.text, fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '4px', height: '14px', background: theme.accent, borderRadius: '2px' }} />
                        Examples
                    </h4>

                    {problem.sampleTestCases?.map((tc, idx) => (
                        <div key={idx} style={{
                            background: theme.bg,
                            borderRadius: '12px',
                            marginBottom: '16px',
                            border: `1px solid ${theme.border}`,
                            overflow: 'hidden',
                            boxShadow: theme.shadow
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.card }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: theme.accent }}>Example {idx + 1}</span>
                                <button
                                    onClick={() => handleCopy(tc.input, idx)}
                                    style={{ background: 'transparent', border: 'none', color: theme.subtext, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px' }}
                                    title="Copy Input"
                                >
                                    {copied === idx ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '11px', color: theme.subtext, textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>Input</div>
                                    <code style={{ color: theme.text, fontSize: '13px', fontFamily: "'Fira Code', monospace" }}>{tc.input}</code>
                                </div>
                                <div style={{ marginBottom: tc.explanation ? '12px' : 0 }}>
                                    <div style={{ fontSize: '11px', color: theme.subtext, textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>Output</div>
                                    <code style={{ color: theme.text, fontSize: '13px', fontFamily: "'Fira Code', monospace" }}>{tc.output}</code>
                                </div>
                                {tc.explanation && (
                                    <div style={{ paddingTop: '12px', borderTop: `1px solid ${theme.border}` }}>
                                        <div style={{ fontSize: '11px', color: theme.subtext, textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>Explanation</div>
                                        <p style={{ margin: 0, fontSize: '13px', color: theme.subtext, lineHeight: '1.5' }}>{tc.explanation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Constraints */}
                {problem.constraints && (
                    <div style={{
                        padding: '16px',
                        background: `${theme.accent}05`,
                        borderRadius: '12px',
                        border: `1px solid ${theme.accent}11`
                    }}>
                        <h4 style={{ color: theme.text, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '4px', height: '14px', background: theme.accent, borderRadius: '2px' }} />
                            Constraints
                        </h4>
                        <ul style={{
                            paddingLeft: '18px',
                            margin: 0,
                            fontSize: '13px',
                            color: theme.subtext,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            {problem.constraints.split('\n').filter(c => c.trim()).map((c, i) => (
                                <li key={i} dangerouslySetInnerHTML={formatDescription(c.trim())} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDescription;
