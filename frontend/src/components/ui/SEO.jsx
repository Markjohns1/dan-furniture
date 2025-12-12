/**
 * Daniel Furniture - SEO Component
 * Handles dynamic meta tags for each page
 */
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Daniel Furniture';
const SITE_URL = 'https://danielfurniture.co.ke';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    product = null, // For product pages with structured data
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Sofasets & Chairs in Kenya`;
    const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
    const metaDescription = description || 'Shop premium quality sofasets, chairs, dining sets, and office furniture in Kenya. Affordable prices, doorstep delivery via WhatsApp.';
    const metaImage = image || DEFAULT_IMAGE;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Product Structured Data */}
            {product && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description || metaDescription,
                        image: product.images?.[0] ? `${SITE_URL}${product.images[0]}` : metaImage,
                        sku: product.sku || `DCF-${product.id}`,
                        brand: {
                            '@type': 'Brand',
                            name: SITE_NAME,
                        },
                        offers: {
                            '@type': 'Offer',
                            url: fullUrl,
                            priceCurrency: 'KES',
                            price: product.price,
                            availability: product.stock > 0
                                ? 'https://schema.org/InStock'
                                : 'https://schema.org/OutOfStock',
                            seller: {
                                '@type': 'Organization',
                                name: SITE_NAME,
                            },
                        },
                        category: product.category?.name || 'Furniture',
                    })}
                </script>
            )}
        </Helmet>
    );
}
