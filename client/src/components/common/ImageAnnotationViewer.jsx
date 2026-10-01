import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Eye, EyeOff, Crosshair } from 'lucide-react';

export const ImageAnnotationViewer = ({
  imageUrl,
  alt = 'Visual Inspection Target',
  annotations = [], // Detections or anomalies with potential coordinates
  isLoading = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBox, setActiveBox] = useState(null);
  const containerRef = useRef(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  // Helper to normalize coordinates:
  // Coordinates can be [ymin, xmin, ymax, xmax] (0-1000 or 0-1) or { x, y, width, height }
  const getNormalizedBox = (box) => {
    if (!box) return null;
    
    // Format: [ymin, xmin, ymax, xmax] (e.g. Gemini 0-1000 format)
    if (Array.isArray(box) && box.length === 4) {
      const is1000 = box.some((v) => v > 1);
      const [ymin, xmin, ymax, xmax] = box;
      return {
        top: `${ymin / (is1000 ? 10 : 1)}%`,
        left: `${xmin / (is1000 ? 10 : 1)}%`,
        width: `${(xmax - xmin) / (is1000 ? 10 : 1)}%`,
        height: `${(ymax - ymin) / (is1000 ? 10 : 1)}%`,
      };
    }

    // Format: { x, y, width, height } in percentage or pixels
    if (box.x !== undefined && box.y !== undefined) {
      const isPct = typeof box.x === 'string' && box.x.includes('%');
      return {
        top: isPct ? box.y : `${box.y}%`,
        left: isPct ? box.x : `${box.x}%`,
        width: isPct ? box.width : `${box.width}%`,
        height: isPct ? box.height : `${box.height}%`,
      };
    }

    return null;
  };

  // Filter only annotations that actually have valid coordinates
  const validAnnotations = (annotations || []).filter((item) => {
    const box = item.box_2d || item.coordinates || item.bbox || item.location_box;
    return getNormalizedBox(box) !== null;
  });

  const getSeverityBorder = (severity) => {
    const s = (severity || '').toUpperCase();
    if (s === 'CRITICAL') return 'border-red-500 bg-red-500/10 text-red-300';
    if (s === 'HIGH') return 'border-orange-500 bg-orange-500/10 text-orange-300';
    if (s === 'MEDIUM') return 'border-amber-500 bg-amber-500/10 text-amber-300';
    return 'border-cyan-400 bg-cyan-500/10 text-cyan-300';
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#0B1220] rounded-lg overflow-hidden border border-[#243247] flex flex-col items-center justify-center select-none group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full min-h-[380px] max-h-[620px]'
      }`}
    >
      {/* Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#111C2E] px-3 py-1.5 rounded-md border border-[#243247] text-xs font-mono text-slate-300 shadow">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">ZOOM:</span>
          <span className="text-cyan-300 font-semibold">{zoom.toFixed(2)}x</span>
          {validAnnotations.length > 0 && (
            <span className="ml-2 pl-2 border-l border-[#243247] text-slate-300">
              {validAnnotations.length} {validAnnotations.length === 1 ? 'Detection' : 'Detections'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#111C2E] p-1 rounded-md border border-[#243247] shadow">
          {validAnnotations.length > 0 && (
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              title={showBoxes ? 'Hide Overlays' : 'Show Overlays'}
              className={`p-1.5 rounded hover:bg-[#1E293B] transition ${
                showBoxes ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {showBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded text-slate-300 hover:text-cyan-400 hover:bg-[#1E293B] transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
        <div
          className="relative inline-block transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt}
              className="max-h-[540px] w-auto object-contain rounded-md shadow-lg block border border-[#243247]"
            />
          ) : (
            <div className="w-96 h-64 bg-[#111C2E] flex items-center justify-center rounded-md border border-dashed border-[#243247] text-slate-500 text-sm">
              No Image Loaded
            </div>
          )}

          {/* Bounding Box Overlays */}
          {showBoxes &&
            validAnnotations.map((item, idx) => {
              const box = item.box_2d || item.coordinates || item.bbox || item.location_box;
              const coords = getNormalizedBox(box);
              if (!coords) return null;

              const label = item.label || item.name || item.title || `Detection #${idx + 1}`;
              const severity = item.severity || item.risk || 'LOW';
              const conf = item.confidence ? `${Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%` : null;
              const isHovered = activeBox === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveBox(idx)}
                  onMouseLeave={() => setActiveBox(null)}
                  style={{
                    top: coords.top,
                    left: coords.left,
                    width: coords.width,
                    height: coords.height,
                  }}
                  className={`absolute border transition-all cursor-pointer ${getSeverityBorder(severity)} ${
                    isHovered ? 'ring-2 ring-cyan-400 z-30' : 'z-10'
                  }`}
                >
                  <div className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#0B1220] border border-[#243247] shadow flex items-center gap-1.5 whitespace-nowrap">
                    <span>{label}</span>
                    {conf && <span className="text-cyan-400 font-mono text-[10px]">{conf}</span>}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

