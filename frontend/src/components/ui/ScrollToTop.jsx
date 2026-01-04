import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);

        // Follow-up scroll after a tiny delay for slow mobile renders
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
