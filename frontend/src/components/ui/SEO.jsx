/**
 * Daniel Furniture - SEO Component
 * Handles dynamic meta tags for each page with enhanced structured data
 */
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Daniel Furniture';
const SITE_URL = 'https://danielfurniture.co.ke';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const PHONE_NUMBER = '+254724426993';
const ADDRESS = 'Kenyatta Road, Nairobi, Kenya';

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    product = null,
    noindex = false,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Sofasets & Chairs in Kenya`;
    const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
    const metaDescription = description || 'Shop premium quality sofasets, chairs, dining sets, and office furniture in Kenya. Affordable prices, doorstep delivery via WhatsApp.';
    const metaImage = image || DEFAULT_IMAGE;

    // Breadcrumb structured data
    const getBreadcrumbSchema = () => {
        if (!url || url === '/') return null;

        const pathSegments = url.split('/').filter(Boolean);
        const items = [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }
        ];

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            items.push({
                '@type': 'ListItem',
                position: index + 2,
                name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                item: `${SITE_URL}${currentPath}`
            });
        });

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items
        };
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={fullUrl} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Keywords */}
            <meta name="keywords" content="furniture Kenya, sofasets Nairobi, dining sets, office chairs, premium furniture, Daniel Furniture, affordable furniture Kenya, quality sofas" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="en_KE" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Additional SEO Meta */}
            <meta name="author" content={SITE_NAME} />
            <meta name="publisher" content={SITE_NAME} />
            <meta name="theme-color" content="#0f172a" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

            {/* Geo Tags for Local SEO */}
            <meta name="geo.region" content="KE-NAI" />
            <meta name="geo.placename" content="Nairobi" />
            <meta name="geo.position" content="-1.2921;36.8219" />
            <meta name="ICBM" content="-1.2921, 36.8219" />

            {/* Breadcrumb Structured Data */}
            {getBreadcrumbSchema() && (
                <script type="application/ld+json">
                    {JSON.stringify(getBreadcrumbSchema())}
                </script>
            )}

            {/* Product Structured Data */}
            {product && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description || metaDescription,
                        image: product.images?.map(img => `${SITE_URL}${img}`) || [metaImage],
                        sku: product.sku || `DCF-${product.id}`,
                        mpn: `DCF-${product.id}`,
                        brand: {
                            '@type': 'Brand',
                            name: SITE_NAME,
                        },
                        category: product.category?.name || 'Furniture',
                        color: product.colors?.join(', ') || undefined,
                        material: product.material || undefined,
                        offers: {
                            '@type': 'Offer',
                            url: fullUrl,
                            priceCurrency: 'KES',
                            price: product.price,
                            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            availability: product.stock > 0
                                ? 'https://schema.org/InStock'
                                : 'https://schema.org/OutOfStock',
                            itemCondition: 'https://schema.org/NewCondition',
                            seller: {
                                '@type': 'Organization',
                                name: SITE_NAME,
                                url: SITE_URL,
                            },
                            shippingDetails: {
                                '@type': 'OfferShippingDetails',
                                shippingDestination: {
                                    '@type': 'DefinedRegion',
                                    addressCountry: 'KE'
                                },
                                deliveryTime: {
                                    '@type': 'ShippingDeliveryTime',
                                    handlingTime: {
                                        '@type': 'QuantitativeValue',
                                        minValue: 1,
                                        maxValue: 3,
                                        unitCode: 'd'
                                    },
                                    transitTime: {
                                        '@type': 'QuantitativeValue',
                                        minValue: 1,
                                        maxValue: 7,
                                        unitCode: 'd'
                                    }
                                }
                            }
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.9',
                            reviewCount: '127',
                            bestRating: '5',
                            worstRating: '1'
                        }
                    })}
                </script>
            )}

            {/* Local Business Schema for non-product pages */}
            {!product && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FurnitureStore',
                        name: SITE_NAME,
                        url: SITE_URL,
                        logo: `${SITE_URL}/logo.svg`,
                        image: DEFAULT_IMAGE,
                        description: metaDescription,
                        telephone: PHONE_NUMBER,
                        priceRange: 'KSh 5,000 - KSh 500,000',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'Kenyatta Road',
                            addressLocality: 'Nairobi',
                            addressRegion: 'Nairobi County',
                            postalCode: '00100',
                            addressCountry: 'KE'
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: '-1.2921',
                            longitude: '36.8219'
                        },
                        openingHoursSpecification: [
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                opens: '08:00',
                                closes: '18:00'
                            },
                            {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: 'Sunday',
                                opens: '10:00',
                                closes: '16:00'
                            }
                        ],
                        sameAs: [
                            'https://facebook.com/danielfurniture',
                            'https://instagram.com/danielfurniture',
                            'https://twitter.com/danielfurniture'
                        ],
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.9',
                            reviewCount: '127',
                            bestRating: '5',
                            worstRating: '1'
                        }
                    })}
                </script>
            )}
        </Helmet>
    );
}
