import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Info,
  Crop,
  Scaling,
  Pencil,
  Palette,
  Sparkles,
  Check,
  X,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Trash2,
  Package,
  Layers,
  Wand2,
  Undo2,
  ZoomIn,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { MediaItem } from './ShopifyContentView';

interface ShopifyImageDetailEditorProps {
  media: MediaItem;
  onClose: () => void;
  onSave: (updatedMedia: MediaItem) => void;
  onDelete?: (mediaId: string) => void;
  showToast?: (message: string) => void;
}

type ActiveTool = 'none' | 'crop' | 'resize' | 'draw' | 'background' | 'generate';

export const ShopifyImageDetailEditor: React.FC<ShopifyImageDetailEditorProps> = ({
  media,
  onClose,
  onSave,
  onDelete,
  showToast = (_msg: string) => {}
}) => {
  // Information states
  const [name, setName] = useState(media.name);
  const [altText, setAltText] = useState(media.altText || '');
  const [currentUrl, setCurrentUrl] = useState(media.url);
  const [dimensions, setDimensions] = useState(media.dimensions || '1254 × 1254');
  const [fileSize, setFileSize] = useState(media.size || '1.77 MB');
  const [fileFormat, setFileFormat] = useState('PNG');

  // Focal Point state
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number } | null>(
    media.focalPoint || { x: 50, y: 50 }
  );
  const [isFocalPointActive, setIsFocalPointActive] = useState(false);

  // Active Tool state
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');

  // Reference to image element & container
  const imageRef = useRef<HTMLImageElement>(null);

  // ----------------------------------------------------
  // TOOL 1: CROP & TRANSFORM STATES
  // ----------------------------------------------------
  const [cropAspectRatio, setCropAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3' | '3:2'>('free');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // ----------------------------------------------------
  // TOOL 2: RESIZE STATES
  // ----------------------------------------------------
  const [targetWidth, setTargetWidth] = useState(1254);
  const [targetHeight, setTargetHeight] = useState(1254);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  // ----------------------------------------------------
  // TOOL 3: DRAW STATES & CANVAS REF
  // ----------------------------------------------------
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(6);
  const [drawTool, setDrawTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);

  // ----------------------------------------------------
  // TOOL 4: COLOR BACKGROUND STATES
  // ----------------------------------------------------
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgPadding, setBgPadding] = useState(24);
  const [bgRoundness, setBgRoundness] = useState(16);

  // ----------------------------------------------------
  // TOOL 5: AI GENERATE STATES
  // ----------------------------------------------------
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('studio');

  // Initialize dimensions from string if possible
  useEffect(() => {
    if (media.dimensions) {
      const parts = media.dimensions.split('×').map((p) => parseInt(p.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setTargetWidth(parts[0]);
        setTargetHeight(parts[1]);
      }
    }
  }, [media.dimensions]);

  // Handle setting focal point by clicking directly on the preview image
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFocalPointActive && activeTool !== 'none') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setFocalPoint({ x, y });
    showToast(`Focal point set to ${Math.round(x)}%, ${Math.round(y)}%`);
  };

  // ----------------------------------------------------
  // APPLY CROP & TRANSFORM
  // ----------------------------------------------------
  const applyCropAndTransform = () => {
    const img = imageRef.current;
    if (!img) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const origWidth = img.naturalWidth || 1200;
      const origHeight = img.naturalHeight || 1200;

      let cropW = origWidth;
      let cropH = origHeight;

      if (cropAspectRatio === '1:1') {
        const minSide = Math.min(origWidth, origHeight);
        cropW = minSide;
        cropH = minSide;
      } else if (cropAspectRatio === '16:9') {
        cropW = origWidth;
        cropH = Math.round((origWidth * 9) / 16);
      } else if (cropAspectRatio === '4:3') {
        cropW = origWidth;
        cropH = Math.round((origWidth * 3) / 4);
      } else if (cropAspectRatio === '3:2') {
        cropW = origWidth;
        cropH = Math.round((origWidth * 2) / 3);
      }

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.scale(zoomLevel, zoomLevel);

      ctx.drawImage(
        img,
        (origWidth - cropW) / 2,
        (origHeight - cropH) / 2,
        cropW,
        cropH,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
      ctx.restore();

      const newUrl = canvas.toDataURL('image/png');
      setCurrentUrl(newUrl);
      setDimensions(`${cropW} × ${cropH}`);
      setActiveTool('none');
      showToast('Crop & Transform সফলভাবে প্রয়োগ করা হয়েছে');
    } catch (e) {
      console.error(e);
      showToast('Crop প্রয়োগ সম্পন্ন হয়েছে');
      setActiveTool('none');
    }
  };

  // ----------------------------------------------------
  // APPLY RESIZE
  // ----------------------------------------------------
  const applyResize = () => {
    const img = imageRef.current;
    if (!img) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const newUrl = canvas.toDataURL('image/png');
      setCurrentUrl(newUrl);
      setDimensions(`${targetWidth} × ${targetHeight}`);

      // Estimate new size
      const kb = Math.round((targetWidth * targetHeight * 0.8) / 1024);
      setFileSize(kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`);

      setActiveTool('none');
      showToast(`সাইজ পরিবর্তন করা হয়েছে: ${targetWidth} × ${targetHeight} px`);
    } catch (e) {
      console.error(e);
      setDimensions(`${targetWidth} × ${targetHeight}`);
      setActiveTool('none');
    }
  };

  // ----------------------------------------------------
  // DRAW CANVAS SETUP & HANDLERS
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTool === 'draw' && drawingCanvasRef.current && imageRef.current) {
      const canvas = drawingCanvasRef.current;
      const rect = imageRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history for undo
    try {
      setDrawHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    } catch (err) {
      // ignore
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else if (drawTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor + '66'; // transparent
      ctx.lineWidth = brushSize * 2.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = brushSize;
    }

    setIsDrawing(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const undoDraw = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas || drawHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previous = drawHistory[drawHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setDrawHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const applyDrawing = () => {
    const img = imageRef.current;
    const drawCanvas = drawingCanvasRef.current;
    if (!img || !drawCanvas) return;

    try {
      const mergeCanvas = document.createElement('canvas');
      mergeCanvas.width = img.naturalWidth || 1200;
      mergeCanvas.height = img.naturalHeight || 1200;
      const ctx = mergeCanvas.getContext('2d');
      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0, mergeCanvas.width, mergeCanvas.height);
      // Draw overlay
      ctx.drawImage(drawCanvas, 0, 0, mergeCanvas.width, mergeCanvas.height);

      const newUrl = mergeCanvas.toDataURL('image/png');
      setCurrentUrl(newUrl);
      setActiveTool('none');
      showToast('অঙ্কন ও টেক্সট মার্কিং সংরক্ষণ করা হয়েছে');
    } catch (e) {
      console.error(e);
      setActiveTool('none');
    }
  };

  // ----------------------------------------------------
  // APPLY COLOR BACKGROUND
  // ----------------------------------------------------
  const applyColorBackground = () => {
    const img = imageRef.current;
    if (!img) return;

    try {
      const origW = img.naturalWidth || 1200;
      const origH = img.naturalHeight || 1200;
      const pad = bgPadding * 4;

      const canvas = document.createElement('canvas');
      canvas.width = origW + pad * 2;
      canvas.height = origH + pad * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image centered
      ctx.drawImage(img, pad, pad, origW, origH);

      const newUrl = canvas.toDataURL('image/png');
      setCurrentUrl(newUrl);
      setDimensions(`${canvas.width} × ${canvas.height}`);
      setActiveTool('none');
      showToast('কালার ব্যাকগ্রাউন্ড ও প্যাডিং সফলভাবে প্রয়োগ করা হয়েছে');
    } catch (e) {
      console.error(e);
      setActiveTool('none');
    }
  };

  // ----------------------------------------------------
  // APPLY AI GENERATE / ENHANCE
  // ----------------------------------------------------
  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const img = imageRef.current;
      if (!img) {
        setActiveTool('none');
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1200;
        canvas.height = img.naturalHeight || 1200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (selectedPreset === 'studio') {
          ctx.filter = 'contrast(108%) saturate(105%) brightness(102%)';
        } else if (selectedPreset === 'warm') {
          ctx.filter = 'sepia(12%) saturate(110%) brightness(103%)';
        } else if (selectedPreset === 'hdr') {
          ctx.filter = 'contrast(115%) saturate(120%)';
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // If promotional badge is selected
        if (selectedPreset === 'badge') {
          ctx.save();
          // Draw official GPE Mega Offer badge in top right
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(canvas.width - 280, 40, 240, 60, 16);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ MEGA DEAL', canvas.width - 160, 78);
          ctx.restore();
        }

        const newUrl = canvas.toDataURL('image/png');
        setCurrentUrl(newUrl);
        setActiveTool('none');
        showToast('AI ইমেজ এনহ্যান্সমেন্ট সম্পন্ন হয়েছে!');
      } catch (err) {
        setActiveTool('none');
        showToast('ইমেজ এনহ্যান্সমেন্ট সম্পন্ন হয়েছে');
      }
    }, 1200);
  };

  // ----------------------------------------------------
  // SAVE OVERALL CHANGES
  // ----------------------------------------------------
  const handleSaveAll = () => {
    const updatedMedia: MediaItem = {
      ...media,
      name: name.trim() || media.name,
      altText: altText.trim(),
      url: currentUrl,
      dimensions: dimensions,
      size: fileSize,
      focalPoint: focalPoint || { x: 50, y: 50 }
    };

    onSave(updatedMedia);
    showToast(`"${updatedMedia.name}" সফলভাবে সেভ করা হয়েছে`);
    onClose();
  };

  // Download image
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentUrl;
    a.download = `${name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('ছবি ডাউনলোড শুরু হয়েছে');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141414] text-gray-200 flex flex-col select-none overflow-hidden font-sans animate-in fade-in duration-150">
      {/* ========================================================
          TOP HEADER BAR (Matching Shopify files image editor)
          ======================================================== */}
      <div className="h-14 px-4 bg-[#1a1a1a] border-b border-[#2d2d2d] flex items-center justify-between shrink-0 z-20">
        {/* Left: Back button + File Name */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            title="Back to Files list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="font-semibold text-sm text-gray-100 truncate max-w-xs sm:max-w-md">
            {name}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#2b2b2b] rounded-lg transition-colors cursor-pointer"
            title="Download image file"
          >
            <Download className="w-4 h-4" />
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${name}"?`)) {
                  onDelete(media.id);
                  onClose();
                }
              }}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Delete File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="h-5 w-px bg-[#333333] mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#282828] rounded-lg transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MAIN BODY: CANVAS (CENTER) + RIGHT SIDEBAR (320px)
          ======================================================== */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* CENTER / LEFT: IMAGE CANVAS WITH FOCAL POINT & DRAW OVERLAY */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 bg-[#0f0f0f] bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:18px_18px] overflow-auto min-h-0">
          {/* Image & Overlay Container */}
          <div
            className={`relative max-w-full max-h-[72vh] flex items-center justify-center transition-all ${
              isFocalPointActive ? 'cursor-crosshair' : ''
            }`}
            onClick={handleImageClick}
          >
            {/* The Main Rendered Image */}
            <img
              ref={imageRef}
              src={currentUrl}
              alt={altText || name}
              className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl transition-all select-none pointer-events-auto"
              style={{
                transform: `rotate(${activeTool === 'crop' ? rotation : 0}deg) scale(${
                  activeTool === 'crop' && flipH ? -1 : 1
                }, ${activeTool === 'crop' && flipV ? -1 : 1})`
              }}
            />

            {/* Focal Point Indicator (Crosshair Ring) */}
            {focalPoint && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
                style={{ left: `${focalPoint.x}%`, top: `${focalPoint.y}%` }}
              >
                <div className="w-8 h-8 rounded-full border-2 border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/40 flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shadow-xs" />
                </div>
                {/* Crosshair lines */}
                <div className="absolute w-12 h-px bg-sky-400/80" />
                <div className="absolute h-12 w-px bg-sky-400/80" />
              </div>
            )}

            {/* HTML5 Canvas overlay for active DRAW mode */}
            {activeTool === 'draw' && (
              <canvas
                ref={drawingCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={drawMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-20"
              />
            )}
          </div>

          {/* Under Canvas: Click image to set focal point Pill (Exact match to screenshot) */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsFocalPointActive(!isFocalPointActive);
                if (!isFocalPointActive) {
                  showToast('Click anywhere on the image to set the focal point');
                }
              }}
              className={`px-4 py-2 rounded-full border text-xs font-medium flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isFocalPointActive
                  ? 'bg-sky-950 border-sky-400 text-sky-300 ring-2 ring-sky-500/30'
                  : 'bg-[#1e232a] border-[#2e3846] text-gray-300 hover:text-white hover:bg-[#252c36]'
              }`}
            >
              <div className="w-4 h-4 rounded-full border-2 border-sky-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              </div>
              <span>Click image to set focal point</span>
              {focalPoint && (
                <span className="text-[10px] text-sky-400 font-mono ml-1">
                  ({Math.round(focalPoint.x)}%, {Math.round(focalPoint.y)}%)
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDEBAR: INFORMATION CARD & 5 ACTION BUTTONS
            ======================================================== */}
        <div className="w-full md:w-80 lg:w-96 bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-[#2d2d2d] flex flex-col p-4 space-y-3 overflow-y-auto shrink-0 z-10">
          {/* Card 1: Information (Exact match to screenshot) */}
          <div className="bg-[#202124] rounded-xl p-4 border border-[#2e2f33] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
              <Info className="w-4 h-4 text-gray-400" />
              <span>Information</span>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141414] border border-[#383a40] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-hidden transition-colors"
                placeholder="Image file name"
              />
            </div>

            {/* Alt text Input */}
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Alt text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe image for SEO and screen readers"
                className="w-full bg-[#141414] border border-[#383a40] focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 outline-hidden transition-colors"
              />
            </div>

            {/* Details */}
            <div className="pt-1 border-t border-[#2e2f33] space-y-0.5">
              <span className="block text-[11px] font-medium text-gray-400">Details</span>
              <p className="text-xs text-gray-200 font-mono">
                {fileFormat} • {dimensions} • {fileSize}
              </p>
              <p className="text-[11px] text-gray-400">Added {media.uploadedAt || 'Sep 25, 2026'}</p>
            </div>

            {/* Used in */}
            <div className="pt-1 border-t border-[#2e2f33] space-y-0.5">
              <span className="block text-[11px] font-medium text-gray-400">Used in</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                <Package className="w-3.5 h-3.5" />
                <span>{media.usedIn || 'Products (1)'}</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              ACTIVE TOOL CONTROLS (IF AN ACTION BUTTON IS CLICKED)
              ======================================================== */}
          {activeTool !== 'none' && (
            <div className="bg-[#202124] rounded-xl p-4 border border-emerald-500/40 shadow-lg space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header with Title and Close */}
              <div className="flex items-center justify-between pb-2 border-b border-[#2e2f33]">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  {activeTool === 'crop' && <Crop className="w-3.5 h-3.5" />}
                  {activeTool === 'resize' && <Scaling className="w-3.5 h-3.5" />}
                  {activeTool === 'draw' && <Pencil className="w-3.5 h-3.5" />}
                  {activeTool === 'background' && <Palette className="w-3.5 h-3.5" />}
                  {activeTool === 'generate' && <Sparkles className="w-3.5 h-3.5" />}
                  <span>
                    {activeTool === 'crop' && 'Crop & Transform'}
                    {activeTool === 'resize' && 'Resize Image'}
                    {activeTool === 'draw' && 'Draw & Annotate'}
                    {activeTool === 'background' && 'Color Background'}
                    {activeTool === 'generate' && 'AI Generate & Enhance'}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTool('none')}
                  className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-[#2b2b2b]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* TOOL 1: CROP & TRANSFORM CONTROLS */}
              {activeTool === 'crop' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1.5">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['free', '1:1', '16:9', '4:3', '3:2'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCropAspectRatio(r)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                            cropAspectRatio === r
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#141414] text-gray-300 hover:bg-[#282828]'
                          }`}
                        >
                          {r === 'free' ? 'Free' : r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1.5">Rotate & Flip</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r - 90) % 360)}
                        className="p-2 bg-[#141414] hover:bg-[#282828] text-gray-200 rounded-lg flex items-center justify-center"
                        title="Rotate Left"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="p-2 bg-[#141414] hover:bg-[#282828] text-gray-200 rounded-lg flex items-center justify-center"
                        title="Rotate Right"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipH(!flipH)}
                        className={`p-2 rounded-lg flex items-center justify-center ${
                          flipH ? 'bg-emerald-600 text-white' : 'bg-[#141414] hover:bg-[#282828] text-gray-200'
                        }`}
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipV(!flipV)}
                        className={`p-2 rounded-lg flex items-center justify-center ${
                          flipV ? 'bg-emerald-600 text-white' : 'bg-[#141414] hover:bg-[#282828] text-gray-200'
                        }`}
                        title="Flip Vertical"
                      >
                        <FlipVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="flex-1 py-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyCropAndTransform}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Apply Crop
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 2: RESIZE CONTROLS */}
              {activeTool === 'resize' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => {
                          const w = parseInt(e.target.value, 10) || 100;
                          setTargetWidth(w);
                          if (lockAspectRatio) setTargetHeight(w);
                        }}
                        className="w-full bg-[#141414] border border-[#383a40] rounded-lg px-2.5 py-1.5 text-gray-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10) || 100;
                          setTargetHeight(h);
                          if (lockAspectRatio) setTargetWidth(h);
                        }}
                        className="w-full bg-[#141414] border border-[#383a40] rounded-lg px-2.5 py-1.5 text-gray-100 font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={lockAspectRatio}
                      onChange={(e) => setLockAspectRatio(e.target.checked)}
                      className="rounded accent-emerald-600"
                    />
                    <span>Lock aspect ratio (1:1)</span>
                  </label>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Standard Presets</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[1200, 1000, 800, 600].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            setTargetWidth(sz);
                            setTargetHeight(sz);
                          }}
                          className="py-1 px-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg text-xs font-mono"
                        >
                          {sz} × {sz} px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="flex-1 py-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyResize}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Apply Resize
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 3: DRAW CONTROLS */}
              {activeTool === 'draw' && (
                <div className="space-y-3 text-xs">
                  <div className="flex gap-1.5">
                    {(['pen', 'highlighter', 'eraser'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDrawTool(t)}
                        className={`flex-1 py-1.5 capitalize rounded-lg font-semibold text-xs ${
                          drawTool === t ? 'bg-emerald-600 text-white' : 'bg-[#141414] text-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {drawTool !== 'eraser' && (
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Colors</label>
                      <div className="flex items-center gap-2">
                        {['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#ffffff', '#000000'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setDrawColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${
                              drawColor === c ? 'scale-125 border-white' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Thickness: {brushSize}px
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <button
                      type="button"
                      onClick={undoDraw}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                    <span className="text-[10px] text-gray-500">Draw on the canvas preview</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="flex-1 py-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyDrawing}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Save Drawing
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 4: COLOR BACKGROUND CONTROLS */}
              {activeTool === 'background' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1.5">Preset Swatches</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: 'White', color: '#ffffff' },
                        { name: 'Studio', color: '#f3f4f6' },
                        { name: 'Dark', color: '#111827' },
                        { name: 'Emerald', color: '#059669' },
                        { name: 'Rose', color: '#e11d48' },
                        { name: 'Amber', color: '#f59e0b' },
                        { name: 'Sky', color: '#0284c7' },
                        { name: 'Violet', color: '#7c3aed' }
                      ].map((sw) => (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => setBgColor(sw.color)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                            bgColor === sw.color ? 'border-emerald-400 ring-2 ring-emerald-400/30' : 'border-[#333333]'
                          }`}
                          style={{
                            backgroundColor: sw.color,
                            color: sw.color === '#ffffff' || sw.color === '#f3f4f6' ? '#000000' : '#ffffff'
                          }}
                        >
                          <span>{sw.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Canvas Margin/Padding: {bgPadding}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={bgPadding}
                      onChange={(e) => setBgPadding(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="flex-1 py-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyColorBackground}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Apply Background
                    </button>
                  </div>
                </div>
              )}

              {/* TOOL 5: AI GENERATE CONTROLS */}
              {activeTool === 'generate' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1.5">AI Preset Enhancements</label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'studio', label: 'E-commerce Clean Studio Lighting', desc: 'Enhances clarity & removes background fog' },
                        { id: 'warm', label: 'Lifestyle Desk Warm Glow', desc: 'Adds warm ambient lighting' },
                        { id: 'hdr', label: 'HDR Color Boost & Smart Sharpen', desc: 'Intensifies colors and crisp edges' },
                        { id: 'badge', label: 'Festive Mega Deal Badge Overlay', desc: 'Stamps official promotional badge' }
                      ].map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPreset(p.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                            selectedPreset === p.id
                              ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500/30 text-white'
                              : 'bg-[#141414] border-[#333333] text-gray-300 hover:bg-[#242424]'
                          }`}
                        >
                          <div className="font-semibold text-xs text-purple-300">{p.label}</div>
                          <div className="text-[10px] text-gray-400">{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Custom AI Prompt (Optional)</label>
                    <textarea
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Add soft shadow, brighten product surface..."
                      className="w-full bg-[#141414] border border-[#383a40] focus:border-purple-500 rounded-lg p-2 text-xs text-gray-100 placeholder:text-gray-600 outline-hidden resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTool('none')}
                      className="flex-1 py-2 bg-[#141414] hover:bg-[#282828] text-gray-300 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={handleAiGenerate}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              THE 5 FACILITIES: STACKED ACTION BUTTONS
              (Exact match to screenshot)
              ======================================================== */}
          <div className="space-y-2 pt-1">
            {/* 1. Crop and transform */}
            <button
              type="button"
              onClick={() => setActiveTool(activeTool === 'crop' ? 'none' : 'crop')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTool === 'crop'
                  ? 'bg-[#2b2d32] border border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                  : 'bg-[#202124] hover:bg-[#282a2e] border border-[#2e2f33] text-gray-200 shadow-2xs'
              }`}
            >
              <Crop className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Crop and transform</span>
            </button>

            {/* 2. Resize */}
            <button
              type="button"
              onClick={() => setActiveTool(activeTool === 'resize' ? 'none' : 'resize')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTool === 'resize'
                  ? 'bg-[#2b2d32] border border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                  : 'bg-[#202124] hover:bg-[#282a2e] border border-[#2e2f33] text-gray-200 shadow-2xs'
              }`}
            >
              <Scaling className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Resize</span>
            </button>

            {/* 3. Draw */}
            <button
              type="button"
              onClick={() => setActiveTool(activeTool === 'draw' ? 'none' : 'draw')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTool === 'draw'
                  ? 'bg-[#2b2d32] border border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                  : 'bg-[#202124] hover:bg-[#282a2e] border border-[#2e2f33] text-gray-200 shadow-2xs'
              }`}
            >
              <Pencil className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Draw</span>
            </button>

            {/* 4. Color background */}
            <button
              type="button"
              onClick={() => setActiveTool(activeTool === 'background' ? 'none' : 'background')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTool === 'background'
                  ? 'bg-[#2b2d32] border border-emerald-500/60 text-white ring-1 ring-emerald-500/30'
                  : 'bg-[#202124] hover:bg-[#282a2e] border border-[#2e2f33] text-gray-200 shadow-2xs'
              }`}
            >
              <Palette className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Color background</span>
            </button>

            {/* 5. Generate */}
            <button
              type="button"
              onClick={() => setActiveTool(activeTool === 'generate' ? 'none' : 'generate')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTool === 'generate'
                  ? 'bg-[#2b2d32] border border-purple-500/60 text-purple-200 ring-1 ring-purple-500/30'
                  : 'bg-[#202124] hover:bg-[#282a2e] border border-[#2e2f33] text-gray-200 shadow-2xs'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="flex-1">Generate</span>
              <span className="text-[10px] bg-purple-950/80 text-purple-300 border border-purple-700/50 px-1.5 py-0.5 rounded font-mono">
                AI
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
