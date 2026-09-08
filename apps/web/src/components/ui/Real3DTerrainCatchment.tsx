'use client';

/**
 * Real3DTerrainCatchment — WebGL 3D terrain viewer using MapLibre GL JS v4
 *
 * Uses free SRTM Terrarium DEM tiles (elevation-tiles-prod.s3.amazonaws.com)
 * for actual 30-m elevation data. Google Satellite hybrid tiles for imagery.
 * No API key required.
 *
 * Replaces the flat 2D SVG schematic that was previously shown when
 * gisRenderMode === 'SCHEMATIC' in apps/web/src/app/map/page.tsx.
 */

import React, { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { LocationDossier } from '@/data/locations';

interface Props {
  location: LocationDossier;
}

// Location-specific terrain config
function getTerrainConfig(loc: LocationDossier) {
  const isRaini = loc.id === 'loc-uk-chamoli';
  const isKedarnath = loc.id === 'loc-uk-kedarnath';

  const center: [number, number] = [loc.lon, loc.lat];
  const zoom = isRaini ? 13.2 : isKedarnath ? 12.8 : 13.0;
  const pitch = isRaini ? 62 : 58;
  const bearing = isRaini ? -25 : -15;
  const exaggeration = isRaini || isKedarnath ? 1.8 : 1.5;

  const markers = isRaini
    ? [
        { lngLat: [79.6920, 30.4850] as [number, number], label: 'RAINI VILLAGE (2,040m)', color: '#E74C3C', icon: '🏘️' },
        { lngLat: [79.7040, 30.4965] as [number, number], label: 'LATA HIGH GROUND SHELTER (+320m · 2,360m)', color: '#2ECC71', icon: '🏕️' },
        { lngLat: [79.6865, 30.4890] as [number, number], label: 'UPPER RAINI SPUR SHELTER (+140m)', color: '#38BDF8', icon: '🏛️' },
        { lngLat: [79.6932, 30.4848] as [number, number], label: 'RISHIGANGA CONFLUENCE GAUGE', color: '#3498DB', icon: '📡' },
        { lngLat: [79.7210, 30.4680] as [number, number], label: 'RISHIGANGA GORGE HEADWATER', color: '#00BCD4', icon: '🌊' },
        { lngLat: [79.7020, 30.4980] as [number, number], label: 'LATA RIDGE AWS TELEMETRY', color: '#F59E0B', icon: '🌤️' },
      ]
    : isKedarnath
    ? [
        { lngLat: [79.0669, 30.7346] as [number, number], label: 'KEDARNATH TEMPLE (3,584m)', color: '#E74C3C', icon: '⛪' },
        { lngLat: [79.0735, 30.7385] as [number, number], label: 'BHAIRAVNATH HIGH RIDGE REFUGE (+220m)', color: '#2ECC71', icon: '🏕️' },
        { lngLat: [79.0652, 30.7320] as [number, number], label: 'MANDAKINI HEADWATER GAUGE', color: '#3498DB', icon: '📡' },
      ]
    : [
        { lngLat: center, label: loc.name.toUpperCase(), color: '#E74C3C', icon: '📍' },
        { lngLat: [loc.lon + 0.006, loc.lat + 0.008] as [number, number], label: 'DESIGNATED HIGH-GROUND REFUGE', color: '#2ECC71', icon: '🏕️' },
      ];

  return { center, zoom, pitch, bearing, exaggeration, markers };
}

export default function Real3DTerrainCatchment({ location }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [pitch, setPitch] = useState(62);
  const [bearing, setBearing] = useState(-25);
  const [exaggeration, setExaggeration] = useState(1.8);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const config = getTerrainConfig(location);
    setPitch(config.pitch);
    setBearing(config.bearing);
    setExaggeration(config.exaggeration);

    let mapInstance: any = null;

    async function initMap() {
      try {
        const maplibregl = (await import('maplibre-gl')).default;

        const map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: {
            version: 8,
            sources: {
              'google-satellite': {
                type: 'raster',
                tiles: [
                  'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                  'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                  'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                ],
                tileSize: 256,
                attribution: 'Imagery © Google Earth / Google Maps',
                maxzoom: 20,
              },
              'terrarium': {
                type: 'raster-dem',
                tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
                tileSize: 256,
                encoding: 'terrarium',
                maxzoom: 14,
                attribution: 'Elevation: SRTM 30m / Mapzen Terrarium',
              },
            },
            layers: [
              {
                id: 'satellite-tiles',
                type: 'raster',
                source: 'google-satellite',
              },
            ],
          },
          center: config.center,
          zoom: config.zoom,
          pitch: config.pitch,
          bearing: config.bearing,
          maxPitch: 80,
        });

        mapInstance = map;
        mapRef.current = map;

        map.on('load', () => {
          try {
            map.setTerrain({ source: 'terrarium', exaggeration: config.exaggeration });
          } catch (terrainErr) {
            console.warn('[Real3DTerrainCatchment] Terrain init warning:', terrainErr);
          }

          // Add POI markers
          config.markers.forEach((m) => {
            const el = document.createElement('div');
            el.style.cssText = `
              display: flex; flex-direction: column; align-items: center; cursor: pointer;
              filter: drop-shadow(0 2px 6px rgba(0,0,0,0.85));
            `;

            const iconEl = document.createElement('div');
            iconEl.style.cssText = 'font-size: 22px; line-height: 1;';
            iconEl.textContent = m.icon;

            const labelEl = document.createElement('div');
            labelEl.style.cssText = `
              background: rgba(10,20,40,0.94);
              color: ${m.color};
              font-family: monospace;
              font-size: 9px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
              border: 1px solid ${m.color}80;
              white-space: nowrap;
              margin-top: 3px;
              letter-spacing: 0.03em;
            `;
            labelEl.textContent = m.label;

            el.appendChild(iconEl);
            el.appendChild(labelEl);

            new maplibregl.Marker({ element: el })
              .setLngLat(m.lngLat)
              .setPopup(
                new maplibregl.Popup({ offset: 25, closeButton: false })
                  .setHTML(`
                    <div style="font-family:monospace;font-size:11px;color:#e2e8f0;background:#0a1428;padding:8px 10px;border-radius:6px;border:1px solid ${m.color}60;min-width:180px">
                      <div style="color:${m.color};font-weight:700;margin-bottom:4px">${m.icon} ${m.label}</div>
                      <div style="color:#94a3b8;font-size:10px">Lat: ${m.lngLat[1].toFixed(4)}° N</div>
                      <div style="color:#94a3b8;font-size:10px">Lon: ${m.lngLat[0].toFixed(4)}° E</div>
                      <div style="color:#64748b;font-size:9px;margin-top:4px">⛰️ Real 3D terrain · SRTM 30m DEM</div>
                    </div>
                  `)
              )
              .addTo(map);
          });

          setMapLoaded(true);
        });

        // Fallback timer ensures WebGL canvas and 3D controls reveal promptly
        const fallbackTimer = setTimeout(() => {
          setMapLoaded(true);
        }, 1000);

        map.on('pitchend', () => setPitch(Math.round(map.getPitch())));
        map.on('rotateend', () => setBearing(Math.round(map.getBearing())));

        map.on('error', (e: any) => {
          console.warn('[Real3DTerrainCatchment] Map error:', e);
        });

      } catch (err: any) {
        console.error('[Real3DTerrainCatchment] Failed to init map:', err);
        setLoadError(String(err));
      }
    }

    initMap();

    return () => {
      if (mapInstance && typeof mapInstance.remove === 'function') {
        mapInstance.remove();
      }
      mapRef.current = null;
    };
  }, [location.id]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    try {
      map.setTerrain({ source: 'terrarium', exaggeration });
    } catch {
      // ignore
    }
  }, [exaggeration, mapLoaded]);

  function handlePitchChange(val: number) {
    setPitch(val);
    mapRef.current?.setPitch?.(val);
  }

  function handleBearingChange(val: number) {
    setBearing(val);
    mapRef.current?.setBearing?.(val);
  }

  function handleResetView() {
    const config = getTerrainConfig(location);
    mapRef.current?.easeTo?.({
      center: config.center,
      zoom: config.zoom,
      pitch: config.pitch,
      bearing: config.bearing,
      duration: 1200,
    });
    setPitch(config.pitch);
    setBearing(config.bearing);
    setExaggeration(config.exaggeration);
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs p-8 text-center">
        <div>
          <div className="text-amber-400 text-lg mb-2">⚠️ 3D TERRAIN NOT INITIALIZED</div>
          <div className="text-slate-500 mb-1">WebGL / MapLibre initialization failed:</div>
          <div className="text-slate-600 text-[10px] max-w-xs mb-3">{loadError}</div>
          <div className="text-cyan-400 text-[11px]">Use 🛰️ REAL MAP (GIS) for Google Earth satellite overlay.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
      {/* WebGL Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-20 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-cyan-400 font-mono text-xs font-bold animate-pulse">⛰️ LOADING 3D TERRAIN (SRTM 30m DEM)…</div>
            <div className="text-slate-500 font-mono text-[10px]">Streaming elevation tiles &amp; Google Earth imagery</div>
          </div>
        </div>
      )}

      {/* 3D Camera & Elevation HUD (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-auto max-w-[240px]">
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-md shadow-2xl">
          <div className="text-cyan-400 font-mono text-[10px] font-bold mb-2 tracking-widest flex items-center justify-between">
            <span>⛰️ 3D TERRAIN CONTROLS</span>
            <span className="text-[9px] text-slate-400">SRTM DEM</span>
          </div>

          {/* Pitch */}
          <div className="mb-2">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>CAMERA PITCH (TILT)</span>
              <span className="text-cyan-300 font-bold">{pitch}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Bearing */}
          <div className="mb-2">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>BEARING (ROTATION)</span>
              <span className="text-cyan-300 font-bold">{bearing}°</span>
            </div>
            <input
              type="range"
              min={-180}
              max={180}
              value={bearing}
              onChange={(e) => handleBearingChange(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Exaggeration */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>VERTICAL EXAGGERATION</span>
              <span className="text-cyan-300 font-bold">{exaggeration.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={3.0}
              step={0.1}
              value={exaggeration}
              onChange={(e) => setExaggeration(Number(e.target.value))}
              className="w-full h-1.5 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={handleResetView}
            className="w-full py-1.5 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition active:scale-95"
          >
            ↺ RESET CAMERA ANGLE
          </button>
        </div>

        {/* Honest Notice */}
        <div className="bg-amber-950/80 border border-amber-500/40 rounded-lg p-2 text-[9px] font-mono text-amber-200">
          <span className="font-bold text-amber-300">⚠️ ELEVATION FIDELITY:</span> 30m SRTM DEM mesh. For disaster response, cross-reference official CWC / Survey of India benchmarks.
        </div>
      </div>

      {/* Location Badge (Top-Right) */}
      <div className="absolute top-16 right-4 z-10 bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-md text-[10px] font-mono shadow-xl pointer-events-none hidden sm:block">
        <div className="text-cyan-400 font-bold text-xs">{location.name.toUpperCase()}</div>
        <div className="text-slate-300 mt-0.5">{location.state} · {location.elevation}</div>
        <div className="text-emerald-400 mt-1 font-bold">● WEBGL 3D ACTIVE</div>
        <div className="text-slate-500 text-[9px] mt-0.5">Tiles: Google Earth · DEM: Terrarium SRTM</div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 z-10 text-[8px] font-mono text-slate-500 pointer-events-none">
        Imagery © Google Earth · DEM: SRTM 30m Public Domain · MapLibre GL JS v4
      </div>
    </div>
  );
}
