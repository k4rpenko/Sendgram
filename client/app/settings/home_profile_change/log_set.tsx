import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../styles/Home_logu_settings.module.css';
import Cookies from 'js-cookie';

interface ProfileEditorProps {
    onClose: () => void;
}

export default function LogSet({ onClose }: ProfileEditorProps) {
    const [isVisible, setIsVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsVisible(true);

        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const Log = () => {
        Cookies.remove('auth_token', { path: '/' });
        window.location.href = '/';
    }

    const settings = () => {
        window.location.href = '/settings/account';
    }

    return (
        <div className={styles.box}>
            <div className={`${styles.Page} ${isVisible ? styles.visible : ''}`} ref={popupRef}>
                <div className={styles.PopupContent}>
                    <button className={styles.Button} onClick={settings}>settings account</button>
                    <button className={styles.Button} onClick={Log}>Log out</button>
                </div>
            </div>
        </div>
    );
}
