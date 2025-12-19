import { useState, useEffect } from 'react';
import { Smartphone, Download, X, Star, ShieldCheck } from 'lucide-react';

export default function AppDownloadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => setIsOpen(true), 1000);

    // Fetch latest release
    const fetchLatestRelease = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/yashasvi9199/MatchFind/releases/latest');
        if (res.ok) {
          const data = await res.json();
          const apkAsset = data.assets?.find((asset: { name: string }) => asset.name.endsWith('.apk'));
          if (apkAsset) {
            setDownloadUrl(apkAsset.browser_download_url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch APK url', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestRelease();

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    } else {
      window.open('https://github.com/yashasvi9199/MatchFind/releases', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden font-sans transform transition-all animate-slide-up">
        
        {/* Background Design Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-rose-500 to-orange-500 opacity-100"></div>
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute top-10 left-[-10px] w-16 h-16 bg-white/20 rounded-full blur-lg"></div>

        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-8 px-6 pb-6">
          {/* Icon/Image */}
          <div className="mx-auto w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 transform -rotate-3 border-4 border-white/50">
            <Smartphone className="w-10 h-10 text-rose-500" />
          </div>

          {/* Content */}
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Get the MatchFind App
            </h3>
            <p className="text-sm text-gray-500 px-2">
              Experience the full potential of MatchFind on your mobile device. Smoother, faster, and built for you.
            </p>
          </div>

          {/* Features / Benefits (Micro) */}
          <div className="flex justify-center gap-4 mb-6 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
               <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
               <span>Top Rated</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span>Secure</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
                <>
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Download APK Now</span>
                </>
            )}
          </button>
          
          <p className="mt-4 text-[10px] text-center text-gray-400">
            Latest version available from GitHub Releases
          </p>
        </div>
      </div>
    </div>
  );
}
