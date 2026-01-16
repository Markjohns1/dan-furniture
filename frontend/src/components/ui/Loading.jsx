/**
 * Dan Classic Furniture - Loading Components
 * Premium loading states with smooth animations
 */

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <div className="w-full h-full animate-spin">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center animate-fade-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl animate-pulse shadow-xl shadow-primary-600/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-couch text-white text-2xl"></i>
                    </div>
                </div>
                <p className="text-gray-600 font-semibold text-lg">Loading...</p>
                <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-fade-in">
            <div className="aspect-[4/5] skeleton"></div>
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="h-3 w-16 skeleton"></div>
                    <div className="h-3 w-12 skeleton"></div>
                </div>
                <div className="h-5 w-full skeleton"></div>
                <div className="h-5 w-3/4 skeleton"></div>
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-24 skeleton"></div>
                    <div className="flex gap-1">
                        <div className="w-5 h-5 rounded-full skeleton"></div>
                        <div className="w-5 h-5 rounded-full skeleton"></div>
                        <div className="w-5 h-5 rounded-full skeleton"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
                    <ProductCardSkeleton />
                </div>
            ))}
        </div>
    );
}

export function CategorySkeleton() {
    return (
        <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-28 rounded-full skeleton flex-shrink-0"></div>
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="relative px-4 py-32 bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="h-6 w-48 mx-auto skeleton rounded-full"></div>
                <div className="h-16 w-full max-w-xl mx-auto skeleton rounded-2xl"></div>
                <div className="h-6 w-full max-w-md mx-auto skeleton rounded-xl"></div>
                <div className="flex justify-center gap-4 pt-4">
                    <div className="h-14 w-44 skeleton rounded-xl"></div>
                    <div className="h-14 w-44 skeleton rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingSpinner;
