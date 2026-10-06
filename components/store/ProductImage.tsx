"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/no-image.svg";

type Props = Omit<ImageProps, "src" | "onError"> & {
    src: string;
};

export default function ProductImage({ src, alt, ...props }: Props) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const hasFailed = failedSrc === src;

    return (
        <Image
            {...props}
            src={hasFailed ? FALLBACK_IMAGE : src}
            alt={alt}
            unoptimized={hasFailed || src === FALLBACK_IMAGE}
            onError={() => {
                if (!hasFailed) {
                    setFailedSrc(src);
                }
            }}
        />
    );
}
