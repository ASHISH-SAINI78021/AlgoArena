import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/axiosInstance';
import { useTheme } from '../../context/ThemeContext';
import { Search, Book, ArrowRight } from 'lucide-react';

export default function Problems() {
    const { theme } = useTheme();
    const navigate = useNavigate();
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
                    limit: 12,
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
        const timer = setTimeout(() => {
            fetchProblems();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, selectedTag, selectedDifficulty]);

    const filteredProblems = problems;

    return (
        <div style={{
            minHeight: 'calc(100vh - 60px)',
            background: theme.background || '#09090b',
            color: theme.text || '#fff',
            padding: '40px 20px',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: theme.accent || '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                        <Book size={40} /> Problem Library
                    </h1>
                    <p style={{ color: theme.subtext || '#A1A1AA', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                        Explore, filter, and practice coding challenges to sharpen your skills.
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '40px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}` }}>
                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 45px',
                                background: 'rgba(0,0,0,0.4)',
                                border: `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '15px',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                        />
                    </div>

                    <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        style={{
                            flex: '1 1 200px',
                            padding: '14px 16px',
                            background: 'rgba(0,0,0,0.4)',
                            border: `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Difficulty" style={{ background: theme.card || '#18181B', color: '#fff' }}>All Difficulty</option>
                        <option value="Easy" style={{ background: theme.card || '#18181B', color: '#22C55E' }}>Easy</option>
                        <option value="Medium" style={{ background: theme.card || '#18181B', color: '#EAB308' }}>Medium</option>
                        <option value="Hard" style={{ background: theme.card || '#18181B', color: '#EF4444' }}>Hard</option>
                    </select>

                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        style={{
                            flex: '1 1 200px',
                            padding: '14px 16px',
                            background: 'rgba(0,0,0,0.4)',
                            border: `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '15px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="" style={{ background: theme.card || '#18181B', color: '#fff' }}>All Tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag} style={{ background: theme.card || '#18181B', color: '#fff' }}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666', fontSize: '20px' }}>Loading Data Sequence...</div>
                ) : filteredProblems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666', fontSize: '20px' }}>No problems match your criteria</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {filteredProblems.map(p => (
                            <div
                                key={p.slug}
                                onClick={() => navigate(`/realtime-coding?problemSlug=${p.slug}`)}
                                style={{
                                    background: theme.card || 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${theme.border || 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = theme.accent || '#8B5CF6';
                                    e.currentTarget.style.boxShadow = `0 10px 30px -10px ${theme.accent || '#8B5CF6'}66`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = theme.border || 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', lineHeight: '1.4' }}>{p.title}</div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: p.difficulty === 'Easy' ? '#22C55E22' : p.difficulty === 'Medium' ? '#EAB30822' : '#EF444422',
                                        color: p.difficulty === 'Easy' ? '#22C55E' : p.difficulty === 'Medium' ? '#EAB308' : '#EF4444',
                                        fontWeight: 'bold',
                                        border: `1px solid ${p.difficulty === 'Easy' ? '#22C55E' : p.difficulty === 'Medium' ? '#EAB308' : '#EF4444'}`
                                    }}>
                                        {p.difficulty}
                                    </span>
                                    {p.tags && p.tags.slice(0, 3).map(tag => (
                                        <span key={tag} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '20px', color: theme.subtext || '#A1A1AA', border: `1px solid ${theme.border || 'rgba(255,255,255,0.1)'}` }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: theme.accent || '#8B5CF6', fontSize: '14px', fontWeight: '600', paddingTop: '10px' }}>
                                    Solve Problem <ArrowRight size={16} style={{ marginLeft: '5px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '15px' }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            style={{
                                padding: '10px 20px',
                                background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : theme.accent || '#8b5cf6',
                                color: currentPage === 1 ? '#666' : '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Previous
                        </button>
                        <span style={{ color: theme.text, fontSize: '14px', fontWeight: '500' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            style={{
                                padding: '10px 20px',
                                background: currentPage === totalPages ? 'rgba(255,255,255,0.05)' : theme.accent || '#8b5cf6',
                                color: currentPage === totalPages ? '#666' : '#fff',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
