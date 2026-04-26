import React, { useState, useEffect } from 'react';
import axios from '../../axios/axiosInstance';
import { Book, ChevronRight, Search, Code2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ProblemSidebar = ({ onSelectProblem, currentSlug }) => {
    const { theme } = useTheme();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulty');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        axios.get('/problems/tags/all').then(res => setAllTags(res.data)).catch(console.error);
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTag, selectedDifficulty]);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 10,
                    search: searchTerm,
                    difficulty: selectedDifficulty,
                    tag: selectedTag
                };
                const res = await axios.get('/problems', { params });
                setProblems(res.data.problems);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error("Failed to fetch problems", err);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(() => fetchProblems(), 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, selectedTag, selectedDifficulty]);

    const filteredProblems = problems;

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
                <div style={{ position: 'relative', marginBottom: '10px' }}>
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

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: 'rgba(0,0,0,0.2)',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            color: theme.text,
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Difficulty" style={{ background: theme.card, color: theme.text }}>All Difficulty</option>
                        <option value="Easy" style={{ background: theme.card, color: '#22c55e' }}>Easy</option>
                        <option value="Medium" style={{ background: theme.card, color: '#eab308' }}>Medium</option>
                        <option value="Hard" style={{ background: theme.card, color: '#ef4444' }}>Hard</option>
                    </select>

                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: 'rgba(0,0,0,0.2)',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '6px',
                            color: theme.text,
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="" style={{ background: theme.card, color: theme.text }}>All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag} style={{ background: theme.card, color: theme.text }}>
                                {tag}
                            </option>
                        ))}
                    </select>
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

                {/* Sidebar Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            style={{
                                padding: '6px 12px',
                                background: currentPage === 1 ? 'transparent' : theme.card,
                                color: currentPage === 1 ? '#666' : theme.text,
                                border: `1px solid ${currentPage === 1 ? 'transparent' : theme.border}`,
                                borderRadius: '6px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Prev
                        </button>
                        <span style={{ fontSize: '12px', color: '#666' }}>{currentPage}/{totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            style={{
                                padding: '6px 12px',
                                background: currentPage === totalPages ? 'transparent' : theme.card,
                                color: currentPage === totalPages ? '#666' : theme.text,
                                border: `1px solid ${currentPage === totalPages ? 'transparent' : theme.border}`,
                                borderRadius: '6px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemSidebar;
