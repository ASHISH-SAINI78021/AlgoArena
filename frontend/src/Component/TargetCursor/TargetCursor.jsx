import React, { useEffect, useRef, useState } from 'react';
import styles from './TargetCursor.module.css';

const TargetCursor = () => {
    const dotTrackerRef = useRef(null);
    const ringTrackerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let animationFrameId;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) setIsVisible(true);

            // Move the dot instantly
            if (dotTrackerRef.current) {
                dotTrackerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        };

        const render = () => {
            // Lerp the ring for smooth follow
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            if (ringTrackerRef.current) {
                ringTrackerRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const onMouseOver = (e) => {
            const target = e.target;
            const computedCursor = window.getComputedStyle(target).cursor;
            const isClickable =
                computedCursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.onclick != null ||
                target.classList.contains('clickable');

            setIsHovering(isClickable);
        };

        const onMouseLeaveBody = () => {
            setIsVisible(false);
        };

        const onMouseEnterBody = () => {
            setIsVisible(true);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        document.body.addEventListener('mouseleave', onMouseLeaveBody);
        document.body.addEventListener('mouseenter', onMouseEnterBody);

        render();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            document.body.removeEventListener('mouseleave', onMouseLeaveBody);
            document.body.removeEventListener('mouseenter', onMouseEnterBody);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isVisible]);

    // Global style injection to hide default cursor
    useEffect(() => {
        document.documentElement.classList.add(styles.globalCursorHide);
        document.body.classList.add(styles.globalCursorHide);
        return () => {
            document.documentElement.classList.remove(styles.globalCursorHide);
            document.body.classList.remove(styles.globalCursorHide);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={styles.cursorContainer}>
            {/* The smoothly following ring wrapper */}
            <div ref={ringTrackerRef} className={styles.ringTracker}>
                <div className={`${styles.ring} ${isHovering ? styles.ringHover : ''}`}>
                    <div className={styles.crosshairV} />
                    <div className={styles.crosshairH} />
                    {/* Corner accents for the target look */}
                    <div className={styles.cornerTL} />
                    <div className={styles.cornerTR} />
                    <div className={styles.cornerBL} />
                    <div className={styles.cornerBR} />
                </div>
            </div>

            {/* The instantly following dot */}
            <div ref={dotTrackerRef} className={styles.dotTracker}>
                <div className={`${styles.dot} ${isHovering ? styles.dotHover : ''}`} />
            </div>
        </div>
    );
};

export default TargetCursor;
