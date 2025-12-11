/**
 * Dan Classic Furniture - WhatsApp Button
 * Floating action button for WhatsApp - MOBILE FIRST
 */
import { useState, useEffect } from 'react';
import { configAPI } from '../../api';

export default function WhatsAppButton({ message, className = '' }) {
    const [waNumber, setWaNumber] = useState('254700000000');

    useEffect(() => {
        configAPI.get().then((res) => {
            setWaNumber(res.data.whatsapp_number);
        }).catch(() => { });
    }, []);

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message || 'Hello! I\'m interested in your furniture.');
        const url = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
            style={{
                bottom: '100px',  /* Above mobile nav */
                right: '16px',
                backgroundColor: '#25D366',
                color: 'white',
            }}
            aria-label="Contact via WhatsApp"
        >
            <i className="fab fa-whatsapp text-3xl"></i>
        </button>
    );
}

export function WhatsAppOrderButton({ message, className = '' }) {
    const [waNumber, setWaNumber] = useState('254700000000');

    useEffect(() => {
        configAPI.get().then((res) => {
            setWaNumber(res.data.whatsapp_number);
        }).catch(() => { });
    }, []);

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors ${className}`}
            style={{
                backgroundColor: '#25D366',
                color: 'white',
            }}
        >
            <i className="fab fa-whatsapp text-2xl"></i>
            Order via WhatsApp
        </button>
    );
}
