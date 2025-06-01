import React, { useEffect, useState } from 'react';

interface ImageDisplayProps {
  imageIndex: number;
}

const INDEX_FILE_URL = 'https://raw.githubusercontent.com/ZeidAl-Ruzouq/image-space-1748742137230/main/index_to_image_map.txt';

function formatNumber(num: number): string {
  const formatted = (num + 0).toString();
  return formatted;
}

export const interceptRendering = (key: string): boolean => {
  const pattern = new RegExp('test_(\\d+).png');
  return pattern.test(key);
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageIndex }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(INDEX_FILE_URL);
        if (!response.ok) throw new Error('Failed to fetch image index');

        const text = await response.text();
        const lines = text.split('\n');
        const line = lines.find((l) => l.startsWith(`${imageIndex},`));

        if (line) {
          const [, url] = line.split(',');
          setImageUrl(url);
        } else {
          setError(`No image found for index ${formatNumber(imageIndex)}`);
        }
      } catch {
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [imageIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return <div className="p-4 text-red-600">{error || 'Image not found'}</div>;
  }

  return (
    <div className="relative w-full">
      <img
        src={imageUrl}
        alt={`Image ${formatNumber(imageIndex)}`}
        className="w-full h-auto rounded-lg shadow-lg"
        loading="lazy"
      />
    </div>
  );
};

export const renderBuilder = (key: string): React.ReactNode => {
  const pattern = new RegExp('test_(\\d+).png');
  const match = key.match(pattern);

  if (!match) {
    return <div className="p-4 text-red-600">Invalid image key format. Expected: test_number.png</div>;
  }

  const index = parseInt(match[1], 10) - 0;
  return <ImageDisplay imageIndex={index} />;
};