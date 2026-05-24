"use client";

import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

interface S3ImageProps {
    path?: string | null;
    alt: string;
    className?: string;
    fallbackIcon?: React.ReactNode;
}

export default function S3Image({ path, alt, className, fallbackIcon }: S3ImageProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (path) {
            if (path.startsWith('http')) {
                setUrl(path);
            } else {
                fetchUrl(path);
            }
        } else {
            setUrl(null);
        }
    }, [path]);

    async function fetchUrl(path: string) {
        try {
            setLoading(true);
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            const result = await getUrl({
                path: cleanPath,
                options: {
                    validateObjectExistence: false,
                    expiresIn: 3600
                }
            });
            setUrl(result.url.toString());
        } catch (error) {
            console.error("Error fetching image URL:", error);
            setUrl(null);
        } finally {
            setLoading(false);
        }
    }

    if (!path || !url) {
        return (
            <div className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}>
                {fallbackIcon}
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`${className} ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity object-cover`}
        />
    );
}
