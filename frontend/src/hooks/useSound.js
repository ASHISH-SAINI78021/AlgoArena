import { useCallback, useState, useEffect } from 'react';

export const useSound = () => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const stored = localStorage.getItem('ghostcode_sound_enabled');
        return stored !== 'false';
    });

    const toggleSound = () => {
        setIsSoundEnabled(prev => {
            const next = !prev;
            localStorage.setItem('ghostcode_sound_enabled', next.toString());
            return next;
        });
    };

    const playCompileSuccess = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2190/2190-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio overlap/blocked:', e));
    }, [isSoundEnabled]);

    const playCompileError = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.4;
        audio.play().catch(e => console.log('Audio overlap/blocked:', e));
    }, [isSoundEnabled]);

    const playGhostWhisper = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2635/2635-preview.mp3');
        audio.volume = 0.6;
        audio.play().catch(e => console.log('Audio overlap/blocked:', e));
    }, [isSoundEnabled]);

    const playTestCorrect = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio overlap/blocked:', e));
    }, [isSoundEnabled]);

    const playTestWrong = useCallback(() => {
        if (!isSoundEnabled) return;
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); /* professional flat tone instead of buzzer */
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio overlap/blocked:', e));
    }, [isSoundEnabled]);

    return { playCompileSuccess, playCompileError, playGhostWhisper, playTestCorrect, playTestWrong, isSoundEnabled, toggleSound };
};
