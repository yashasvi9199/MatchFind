import { useState, useEffect } from 'react';
import { Download, X, RefreshCw, ExternalLink } from 'lucide-react';
import { isAndroid } from '../../utils/platform';
import metadata from '../../metadata.json';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: ReleaseAsset[];
}

/**
 * Compare two semver versions (e.g., "1.0.0" vs "1.0.1")
 * Returns: 1 if a > b, -1 if a < b, 0 if equal
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.replace(/^v/, '').split('.').map(Number);
  const partsB = b.replace(/^v/, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  return 0;
}

export default function InAppUpdateChecker() {
  const [showModal, setShowModal] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on Android
    if (!isAndroid()) return;

    const checkForUpdate = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/yashasvi9199/MatchFind/releases/latest');
        if (!res.ok) return;

        const data: GitHubRelease = await res.json();
        const remoteVersion = data.tag_name.replace(/^v/, '');
        const currentVersion = metadata.versionName;

        // Check if remote version is newer
        if (compareVersions(remoteVersion, currentVersion) > 0) {
          const apkAsset = data.assets.find((asset) => asset.name.endsWith('.apk'));
          if (apkAsset) {
            setLatestVersion(remoteVersion);
            setDownloadUrl(apkAsset.browser_download_url);
            setShowModal(true);
          }
        }
      } catch (err) {
        console.error('[UpdateChecker] Failed to check for updates:', err);
      }
    };

    // Check for updates on mount
    checkForUpdate();
  }, []);

  const handleDownload = async () => {
    if (!downloadUrl) return;
    
    setIsDownloading(true);
    setError(null);

    try {
      // For Android, we open the APK URL directly which triggers download + install prompt
      window.open(downloadUrl, '_blank');
      
      // Close the modal after initiating download
      setTimeout(() => {
        setShowModal(false);
        setIsDownloading(false);
      }, 1000);
    } catch (err) {
      console.error('[UpdateChecker] Download failed:', err);
      setError('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  // Don't render anything if not on Android or no update available
  if (!isAndroid() || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-5">
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Update Available</h3>
              <p className="text-sm text-white/80">Version {latestVersion}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">
            A new version of MatchFind is available. Update now to get the latest features and improvements.
          </p>

          <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Current version:</span>
              <span className="font-semibold text-gray-700">{metadata.versionName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>New version:</span>
              <span className="font-semibold text-emerald-600">{latestVersion}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-70"
            >
              {isDownloading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Download from GitHub Releases
          </p>
        </div>
      </div>
    </div>
  );
}
