/**
 * Dan Classic Furniture - Loading Components
 */

export function LoadingSpinner({ size = 'md', color = 'primary' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    const colors = {
        primary: 'text-primary-600',
        white: 'text-white',
        gray: 'text-gray-400',
    };

    return (
        <div className={`${sizes[size]} ${colors[color]} animate-spin`}>
            <i className="fas fa-spinner"></i>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-500">Loading...</p>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden">
            <div className="aspect-square skeleton"></div>
            <div className="p-3 space-y-2">
                <div className="h-3 w-16 skeleton"></div>
                <div className="h-4 w-full skeleton"></div>
                <div className="h-4 w-3/4 skeleton"></div>
                <div className="h-5 w-24 skeleton mt-2"></div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div className="product-grid">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default LoadingSpinner;
