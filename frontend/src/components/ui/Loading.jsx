/**
 * Dan Classic Furniture - Loading Components
 */

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <i className="fas fa-spinner fa-spin text-primary-600"></i>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin text-primary-600 text-2xl"></i>
                </div>
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default LoadingSpinner;
