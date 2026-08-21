import React, { useState } from 'react';
import axios from '../../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreateProblem = () => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        difficulty: 'Easy',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        tags: '',
        sampleTestCases: [{ input: '', output: '', explanation: '' }],
        testCases: [{ input: '', output: '', isHidden: true }],
        boilerplates: { javascript: '', python: '', cpp: '', java: '' }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, index, field, arrayName) => {
        const { value } = e.target;
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index][field] = value;
            return { ...prev, [arrayName]: newArray };
        });
    };

    const addArrayItem = (arrayName, defaultItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], defaultItem]
        }));
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => {
            const newArray = prev[arrayName].filter((_, i) => i !== index);
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleBoilerplateChange = (e, lang) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            boilerplates: { ...prev.boilerplates, [lang]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim());
            const payload = { ...formData, tags: tagsArray };

            await axios.post('/problems', payload);
            alert('Problem created successfully!');
            navigate('/problems');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create problem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Create New Problem (Admin)</h1>
            {error && <div style={{ color: 'red', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Slug</label>
                        <input name="slug" value={formData.slug} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={handleChange} style={inputStyle}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, height: '100px' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Input Format</label>
                        <textarea name="inputFormat" value={formData.inputFormat} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Output Format</label>
                        <textarea name="outputFormat" value={formData.outputFormat} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} />
                    </div>
                </div>

                <div>
                    <label>Constraints</label>
                    <textarea name="constraints" value={formData.constraints} onChange={handleChange} style={{ ...inputStyle, height: '60px' }} />
                </div>

                <div>
                    <label>Tags (comma separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. Array, DP, String" style={inputStyle} />
                </div>

                <hr style={{ borderColor: '#333', margin: '2rem 0' }} />
                <h3>Sample Test Cases</h3>
                {formData.sampleTestCases.map((tc, index) => (
                    <div key={index} style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}><label>Input</label><textarea value={tc.input} onChange={(e) => handleArrayChange(e, index, 'input', 'sampleTestCases')} required style={inputStyle} /></div>
                            <div style={{ flex: 1 }}><label>Output</label><textarea value={tc.output} onChange={(e) => handleArrayChange(e, index, 'output', 'sampleTestCases')} required style={inputStyle} /></div>
                        </div>
                        <label>Explanation</label>
                        <textarea value={tc.explanation} onChange={(e) => handleArrayChange(e, index, 'explanation', 'sampleTestCases')} style={inputStyle} />
                        {formData.sampleTestCases.length > 1 && (
                            <button type="button" onClick={() => removeArrayItem(index, 'sampleTestCases')} style={deleteBtnStyle}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('sampleTestCases', { input: '', output: '', explanation: '' })} style={addBtnStyle}>+ Add Sample Test Case</button>

                <hr style={{ borderColor: '#333', margin: '2rem 0' }} />
                <h3>Hidden Test Cases</h3>
                {formData.testCases.map((tc, index) => (
                    <div key={index} style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}><label>Input</label><textarea value={tc.input} onChange={(e) => handleArrayChange(e, index, 'input', 'testCases')} required style={{ ...inputStyle, marginBottom: 0 }} /></div>
                        <div style={{ flex: 1 }}><label>Output</label><textarea value={tc.output} onChange={(e) => handleArrayChange(e, index, 'output', 'testCases')} required style={{ ...inputStyle, marginBottom: 0 }} /></div>
                        {formData.testCases.length > 1 && (
                            <button type="button" onClick={() => removeArrayItem(index, 'testCases')} style={{ ...deleteBtnStyle, marginTop: 0 }}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('testCases', { input: '', output: '', isHidden: true })} style={addBtnStyle}>+ Add Hidden Test Case</button>

                <hr style={{ borderColor: '#333', margin: '2rem 0' }} />
                <h3>Boilerplates</h3>
                {['javascript', 'python', 'cpp', 'java'].map(lang => (
                    <div key={lang}>
                        <label style={{ textTransform: 'capitalize' }}>{lang}</label>
                        <textarea value={formData.boilerplates[lang]} onChange={(e) => handleBoilerplateChange(e, lang)} style={{ ...inputStyle, height: '80px', fontFamily: 'monospace' }} />
                    </div>
                ))}

                <button type="submit" disabled={loading} style={{
                    marginTop: '2rem', padding: '1rem', background: '#3b82f6', color: 'white',
                    border: 'none', borderRadius: '6px', fontSize: '1.2rem', cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                    {loading ? 'Creating...' : 'Create Problem'}
                </button>
            </form>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '0.75rem', marginTop: '0.5rem', marginBottom: '1rem',
    background: '#2d2d2d', border: '1px solid #444', color: 'white', borderRadius: '4px'
};

const deleteBtnStyle = {
    background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem',
    borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem'
};

const addBtnStyle = {
    background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem',
    borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start'
};

export default CreateProblem;
