import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import FormatSelector from '../components/FormatSelector';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const Home = () => {
  const [image, setImage] = useState(null);
  const [format, setFormat] = useState('webp');
  const [optimizedUrl, setOptimizedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploader, setShowUploader] = useState(false); // Welcome screen toggle

  const handleOptimize = async () => {
    if (!image) {
      alert('Please select an image!');
      return;
    }

    setLoading(true);
    setError(null);
    setOptimizedUrl(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('format', format);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to optimize image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const actualFormat = response.headers.get('Content-Type').split('/')[1] || format;
      setOptimizedUrl({ url, size: blob.size, format: actualFormat });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  //  Welcome screen
  if (!showUploader) {
    return (
      <div
        className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 -skew-y-6 origin-top-left" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-white/10 skew-y-6 origin-bottom-right" />
        <div className="flex flex-col items-center justify-center h-[calc(100dvh-60px)] gap-8">
          <h1 className="text-white text-5xl font-extrabold drop-shadow-lg px-4 text-center">
            Welcome to Image Optimizer
          </h1>
          <p className="text-white/90 text-xl text-center max-w-2xl px-6 leading-relaxed">
            Transform your images with our powerful optimizer. Reduce file size while maintaining quality, convert between formats, and optimize for the web in seconds.
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-white text-purple-600 hover:bg-purple-100 hover:scale-105 px-6 py-3 cursor-pointer rounded-full font-semibold transition-all duration-200 transform active:scale-95 hover:shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  //  Main interface
  return (
    <div className="relative p-8 max-w-6xl mx-auto bg-gray-50">

      {/*  Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        
        {/* Upload Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <ImageUpload image={image} onImageSelect={setImage} />
            {image && (
              <p className="text-sm mt-2 text-gray-600">
                Selected: <strong>{image.name}</strong> ({(image.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          
          {/*  Format dropdown */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <FormatSelector format={format} setFormat={setFormat} />
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition duration-200"
          >
            {loading ? 'Optimizing...' : 'Optimize Image'}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">⚠ {error}</p>}

          <button
            onClick={() => setShowUploader(false)}
            className="mt-6 w-full text-gray-600 hover:text-gray-900 underline"
          >
            Go Back
          </button>
        </div>

        {/*  Preview Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center min-h-[400px]">
          {optimizedUrl ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Optimized Image Preview ({formatBytes(optimizedUrl.size)})
              </h2>
              <img
                src={optimizedUrl.url}
                alt="Optimized"
                className="max-w-full max-h-96 rounded-lg border border-gray-200 shadow"
              />
              <a
                href={optimizedUrl.url}
                download={`optimized.${optimizedUrl.format}`}
                className="mt-4 inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Download Optimized Image
              </a>
            </>
          ) : (
            <p className="text-gray-400 text-center">Your optimized image will appear here once ready.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
