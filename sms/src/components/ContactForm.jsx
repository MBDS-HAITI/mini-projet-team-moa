
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ContactForm() {
    const { isDark } = useTheme ? useTheme() : { isDark: false };
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            const res = await fetch('http://localhost:8010/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, text }),
            });
            if (!res.ok) throw new Error('Error while sending');
            setSuccess('Your message has been sent successfully!');
            setTo(''); setSubject(''); setText('');
            setTimeout(() => {
                window.location.href = '/contact';
            }, 1200);
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: 440,
            width: '100%',
            margin: '2.5rem auto',
            background: '#fff',
            color: isDark ? '#fff' : '#1e293b',
            color: isDark ? '#fff' : '#1e293b',
            borderRadius: 32,
            boxShadow: isDark ? '0 2px 16px #000b' : '0 2px 16px #0001',
            padding: '36px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            border: isDark ? '1.5px solid #2d3748' : '1.5px solid #e5e7eb',
            fontFamily: 'Segoe UI, Arial, sans-serif',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
                <img src="/logoMBDS.png" alt="MBDS Logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8, filter: isDark ? 'brightness(0.85)' : 'none' }} />
            </div>
            <label style={{ fontWeight: 600, marginBottom: 4, color: '#111', letterSpacing: 0.2 }}>Recipient</label>
            <input
                type="email"
                placeholder="e.g. teammoa2025@gmail.com"
                value={to}
                onChange={e => setTo(e.target.value)}
                required
                style={{
                    padding: '11px 13px',
                    border: isDark ? '1.5px solid #374151' : '1.5px solid #cbd5e1',
                    borderRadius: 24,
                    fontSize: 16,
                    marginBottom: 8,
                    outline: 'none',
                    background: isDark ? '#23272f' : '#fff',
                    color: isDark ? '#e5e7eb' : '#1e293b',
                    transition: 'border 0.2s',
                }}
            />
            <label style={{ fontWeight: 600, marginBottom: 4, color: '#111', letterSpacing: 0.2 }}>Subject</label>
            <input
                type="text"
                placeholder="Subject of the message"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                style={{
                    padding: '11px 13px',
                    border: isDark ? '1.5px solid #374151' : '1.5px solid #cbd5e1',
                    borderRadius: 24,
                    fontSize: 16,
                    marginBottom: 8,
                    outline: 'none',
                    background: isDark ? '#23272f' : '#fff',
                    color: isDark ? '#e5e7eb' : '#1e293b',
                    transition: 'border 0.2s',
                }}
            />
            <label style={{ fontWeight: 600, marginBottom: 4, color: '#111', letterSpacing: 0.2 }}>Message</label>
            <textarea
                placeholder="Your message..."
                value={text}
                onChange={e => setText(e.target.value)}
                required
                rows={6}
                style={{
                    padding: '11px 13px',
                    border: isDark ? '1.5px solid #374151' : '1.5px solid #cbd5e1',
                    borderRadius: 24,
                    fontSize: 16,
                    marginBottom: 8,
                    resize: 'vertical',
                    outline: 'none',
                    background: isDark ? '#23272f' : '#fff',
                    color: isDark ? '#e5e7eb' : '#1e293b',
                    transition: 'border 0.2s',
                }}
            />
            <button
                type="submit"
                disabled={loading}
                style={{
                    background: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: 24,
                    padding: '13px 0',
                    fontWeight: 600,
                    fontSize: 16,
                    marginTop: 8,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: isDark ? '0 2px 8px #0008' : '0 2px 8px #0001',
                    transition: 'background 0.2s, box-shadow 0.2s',
                    letterSpacing: 0.3,
                }}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
            {success && <div style={{ color: isDark ? '#22d3ee' : '#059669', background: isDark ? '#1e293b' : '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 24, marginTop: 14, padding: '10px 0', fontWeight: 500, textAlign: 'center', fontSize: 15 }}>{success}</div>}
            {error && <div style={{ color: isDark ? '#f87171' : '#dc2626', background: isDark ? '#1e293b' : '#fef2f2', border: '1px solid #fecaca', borderRadius: 24, marginTop: 14, padding: '10px 0', fontWeight: 500, textAlign: 'center', fontSize: 15 }}>{error}</div>}
        </form>
    );
}

export default ContactForm;
    