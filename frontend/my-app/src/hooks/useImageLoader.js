import { useState, useEffect } from 'react';

export const useImageLoader = (imageSrc) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    
    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc]);

  return { imageLoaded, imageError };
};

export const useImagePreloader = (imageSrcs) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (!imageSrcs || imageSrcs.length === 0) {
      setAllLoaded(true);
      return;
    }

    const loadPromises = imageSrcs.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    Promise.all(loadPromises)
      .then(() => setAllLoaded(true))
      .catch((error) => {
        console.error('이미지 로딩 실패:', error);
        setAllLoaded(true); // 에러가 있어도 계속 진행
      });
  }, [imageSrcs]);

  return { loadedImages, allLoaded };
}; 