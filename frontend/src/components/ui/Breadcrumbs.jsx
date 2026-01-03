/**
 * Daniel Furniture - Breadcrumbs Component
 * Improves SEO and User Navigation
 */
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm font-medium">
                <li>
                    <Link to="/" className="text-gray-400 hover:text-primary-600 transition-colors">
                        <i className="fas fa-home mr-1"></i>
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <i className="fas fa-chevron-right text-[10px] text-gray-300 mx-2"></i>
                        {item.to ? (
                            <Link
                                to={item.to}
                                className="text-gray-400 hover:text-primary-600 transition-colors whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-primary-600 font-semibold truncate max-w-[150px] sm:max-w-none">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
