import React, { useEffect, useState } from 'react';
import { getUrl } from 'aws-amplify/storage';

interface S3ImageProps {
    s3Key?: string | null;
    alt: string;
    className?: string;
    fallbackSrc?: string;
    style?: React.CSSProperties;
}

/**
 * S3Image Component
 * Automatically fetches and displays images from S3 storage
 * Shows a fallback image if the S3 key is not available or fails to load
 */
export default function S3Image({ s3Key, alt, className = '', fallbackSrc, style }: S3ImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchImage() {
            if (!s3Key) {
                setLoading(false);
                setError(true);
                return;
            }

            // If it's already an HTTP URL, use it directly
            if (s3Key.startsWith('http')) {
                setImageUrl(s3Key);
                setLoading(false);
                return;
            }

            try {
                const cleanPath = s3Key.startsWith('/') ? s3Key.slice(1) : s3Key;
                const result = await getUrl({
                    path: cleanPath,
                    options: {
                        validateObjectExistence: false,
                        expiresIn: 3600, // 1 hour
                    },
                });
                setImageUrl(result.url.toString());
                setLoading(false);
            } catch (err) {
                console.error('Error fetching S3 image:', err);
                setError(true);
                setLoading(false);
            }
        }

        fetchImage();
    }, [s3Key]);

    if (loading) {
        return (
            <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`} style={style}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className={`${className} bg-gray-100 flex items-center justify-center`} style={style}>
                {fallbackSrc ? (
                    <img src={fallbackSrc} alt={alt} className={className} style={style} />
                ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        );
    }

    return <img src={imageUrl} alt={alt} className={className} style={style} onError={() => setError(true)} />;
}
