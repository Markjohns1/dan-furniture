import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Disable browser scroll restoration to prevent jumping
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // 2. Immediate Force Scroll (Modern + Legacy)
        window.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);

        // 3. Micro-task scroll (captures post-render shifts)
        const fastTimer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 0);

        // 4. Heavy-duty fallback for slow mobile rendering
        const slowTimer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }, 150);

        return () => {
            clearTimeout(fastTimer);
            clearTimeout(slowTimer);
        };
    }, [pathname]);

    return null;
}
