import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, ...props }) => {
  const [imageState, setImageState] = useState('loading');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // ✅ แปลง Google Drive URL เป็น Proxy URL
interface GetProxyUrl {
    (originalSrc?: string): string;
}

interface GoogleDriveMatch extends RegExpMatchArray {
    1: string;
}

const getProxyUrl: GetProxyUrl = (originalSrc) => {
    if (!originalSrc) return '/images/placeholder.jpg';

    // ถ้าเป็น Google Drive File ID
    if (originalSrc.match(/^[a-zA-Z0-9_-]{25,}$/)) {
        return `/api/image-proxy/${originalSrc}`;
    }

    // ถ้าเป็น Google Drive URL แบบเต็ม
    const googleDrivePattern = /(?:googleusercontent\.com\/d\/|drive\.google\.com.*[?&]id=)([a-zA-Z0-9_-]{25,})/;
    const match = originalSrc.match(googleDrivePattern) as GoogleDriveMatch | null;
    
    if (match && match[1]) {
        return `/api/image-proxy/${match[1]}`;
    }

    // ถ้าไม่ใช่ Google Drive ใช้ URL เดิม
    return originalSrc;
};

  const handleImageLoad = () => {
    setImageState('loaded');
  };

  interface ImageErrorEvent extends React.SyntheticEvent<HTMLImageElement, Event> {}

  const handleImageError = (e: ImageErrorEvent): void => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount((prev: number) => prev + 1);
        setImageState('loading');
      }, (retryCount + 1) * 2000);
    } else {
      setImageState('error');
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setImageState('loading');
  };

  const proxyUrl = getProxyUrl(src);

  if (imageState === 'error') {
    return (
      <div className={`${className} bg-gray-200 flex flex-col items-center justify-center`}>
        <div className="text-gray-400 text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm mb-2">Image not available</p>
          <button 
            onClick={handleRetry}
            className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 bg-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageState === 'loading' && (
        <div className={`${className} bg-gray-100 flex items-center justify-center animate-pulse`}>
          <div className="text-gray-400">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        </div>
      )}
      
      <img
        key={`${proxyUrl}-${retryCount}`} // Force re-render on retry
        src={proxyUrl}
        alt={alt}
        className={`${className} ${imageState === 'loading' ? 'opacity-0 absolute' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        {...props}
      />
      
      {retryCount > 0 && imageState === 'loading' && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Retry {retryCount}/{maxRetries}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;