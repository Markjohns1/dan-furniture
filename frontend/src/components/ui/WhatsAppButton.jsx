/**
 * Dan Classic Furniture - WhatsApp Button
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
            className={`fab-whatsapp ${className}`}
            aria-label="Contact via WhatsApp"
        >
            <i className="fab fa-whatsapp text-2xl"></i>
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
            className={`btn-success w-full ${className}`}
        >
            <i className="fab fa-whatsapp text-xl"></i>
            Order via WhatsApp
        </button>
    );
}
