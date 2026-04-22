import React, { useState, useEffect } from 'react';
import axios from '../../axios/axiosInstance';
import { Book, ChevronRight, Search, Code2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProblemSidebar = ({ onSelectProblem, currentSlug }) => {
    const { theme } = useTheme();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('/problems');
                setProblems(res.data);
            } catch (err) {
                console.error("Failed to fetch problems", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{
            width: '100%', // Changed to 100% because it's inside a box of 350px
            height: '100%',
            background: 'transparent', // Let the parent drawer handle background
            display: 'flex',
            flexDirection: 'column',
            color: theme.text,
            transition: 'all 0.3s ease'
        }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent }}>
                    <Book size={20} color={theme.accent} /> Problems
                </h3>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 35px',
                            background: 'rgba(0,0,0,0.2)',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '13px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading...</div>
                ) : filteredProblems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No problems found</div>
                ) : (
                    filteredProblems.map(p => (
                        <div
                            key={p.slug}
                            onClick={() => onSelectProblem(p)}
                            style={{
                                padding: '14px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                marginBottom: '10px',
                                background: currentSlug === p.slug ? `${theme.accent}22` : 'transparent',
                                border: `1px solid ${currentSlug === p.slug ? theme.accent : 'transparent'}`,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: currentSlug === p.slug ? `0 4px 12px ${theme.accent}22` : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (currentSlug !== p.slug) {
                                    e.currentTarget.style.background = theme.card;
                                    e.currentTarget.style.borderColor = theme.border;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentSlug !== p.slug) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{p.title}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    fontSize: '10px',
                                    color: p.difficulty === 'Easy' ? '#22c55e' : p.difficulty === 'Medium' ? '#eab308' : '#ef4444',
                                    fontWeight: 'bold'
                                }}>
                                    {p.difficulty}
                                </span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {p.tags.slice(0, 2).map(tag => (
                                        <span key={tag} style={{ fontSize: '9px', background: theme.card, padding: '2px 6px', borderRadius: '4px', color: theme.subtext, border: `1px solid ${theme.border}` }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProblemSidebar;
