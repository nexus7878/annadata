"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, LocateFixed, Navigation, Truck, Package, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// Types
// ============================================================

export interface WarehouseLocation {
  id: string;
  name: string;
  type: "warehouse" | "marketplace";
  lat: number;
  lng: number;
  distance?: string;
  capacity?: string;
  price?: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  distanceKm: number;
}

interface WarehouseMapProps {
  onSelectWarehouse?: (warehouse: WarehouseLocation | null) => void;
  onNearbyResults?: (warehouses: WarehouseLocation[]) => void;
}

// ============================================================
// Fallback dummy data (used when Overpass returns empty)
// ============================================================

const FALLBACK_WAREHOUSES: Omit<WarehouseLocation, "distance">[] = [
  {
    id: "fallback-1",
    name: "Kisan Cold Storage",
    type: "warehouse",
    lat: 0, lng: 0, // Will be offset from user location
    capacity: "450 Tons",
    price: "₹20/qtl/mo",
  },
  {
    id: "fallback-2",
    name: "AgriMart Warehouse",
    type: "warehouse",
    lat: 0, lng: 0,
    capacity: "800 Tons",
    price: "₹15/qtl/mo",
  },
  {
    id: "fallback-3",
    name: "Mandi Bazaar",
    type: "marketplace",
    lat: 0, lng: 0,
    capacity: "Open Market",
    price: "Free Entry",
  },
  {
    id: "fallback-4",
    name: "FreshStore Logistics",
    type: "warehouse",
    lat: 0, lng: 0,
    capacity: "1200 Tons",
    price: "₹25/qtl/mo",
  },
  {
    id: "fallback-5",
    name: "Krishi Mandi",
    type: "marketplace",
    lat: 0, lng: 0,
    capacity: "Open Market",
    price: "Free Entry",
  },
];

/**
 * Generate fallback warehouses positioned around the user location.
 */
function generateFallbackData(userLat: number, userLng: number): WarehouseLocation[] {
  const offsets = [
    { dlat: 0.012, dlng: 0.015 },
    { dlat: -0.018, dlng: 0.008 },
    { dlat: 0.008, dlng: -0.022 },
    { dlat: -0.01, dlng: -0.014 },
    { dlat: 0.02, dlng: -0.005 },
  ];
  return FALLBACK_WAREHOUSES.map((w, i) => ({
    ...w,
    lat: userLat + offsets[i].dlat,
    lng: userLng + offsets[i].dlng,
  }));
}

// ============================================================
// Haversine distance helper
// ============================================================

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================================
// Main Component
// ============================================================

export function WarehouseMap({ onSelectWarehouse, onNearbyResults }: WarehouseMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("Initializing map...");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<string | null>("mini-truck");

  // Import type for L namespace
  type LType = typeof import("leaflet");
  const leafletRef = useRef<LType | null>(null);

  // --------------------------------------------------------
  // Overpass API: fetch nearby warehouses/marketplaces
  // --------------------------------------------------------
  const fetchNearbyPlaces = useCallback(async (lat: number, lng: number): Promise<WarehouseLocation[]> => {
    const radius = 5000; // 5km
    const query = `
      [out:json][timeout:10];
      (
        nwr["building"="warehouse"](around:${radius},${lat},${lng});
        nwr["amenity"="marketplace"](around:${radius},${lat},${lng});
        nwr["shop"="farm"](around:${radius},${lat},${lng});
        nwr["landuse"="industrial"](around:${radius},${lat},${lng});
      );
      out center 20;
    `;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

      const data = await res.json();
      const elements: WarehouseLocation[] = (data.elements || [])
        .filter((el: Record<string, unknown>) => {
          const elLat = (el.lat as number) ?? (el.center as Record<string, number>)?.lat;
          const elLng = (el.lon as number) ?? (el.center as Record<string, number>)?.lon;
          return elLat && elLng;
        })
        .map((el: Record<string, unknown>, i: number) => {
          const elLat = (el.lat as number) ?? (el.center as Record<string, number>)?.lat;
          const elLng = (el.lon as number) ?? (el.center as Record<string, number>)?.lon;
          const tags = (el.tags as Record<string, string>) || {};
          const dist = haversineDistance(lat, lng, elLat, elLng);
          const isWarehouse = tags.building === "warehouse" || tags.landuse === "industrial";

          return {
            id: `osm-${el.id || i}`,
            name: tags.name || (isWarehouse ? "Warehouse" : "Marketplace"),
            type: isWarehouse ? "warehouse" as const : "marketplace" as const,
            lat: elLat,
            lng: elLng,
            distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
            capacity: isWarehouse ? "Contact for details" : "Open Market",
            price: isWarehouse ? "₹15–25/qtl/mo" : "Free Entry",
          };
        });

      return elements;
    } catch (err) {
      console.warn("Overpass API failed, using fallback data:", err);
      return [];
    }
  }, []);

  // --------------------------------------------------------
  // OSRM routing: draw route between two points
  // --------------------------------------------------------
  const drawRoute = useCallback(async (from: [number, number], to: [number, number]) => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    // Remove previous route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setRouteInfo(null);

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM error: ${res.status}`);

      const data = await res.json();
      if (!data.routes || data.routes.length === 0) throw new Error("No route found");

      const route = data.routes[0];
      const coords: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]] as [number, number]
      );

      // Draw polyline
      routeLayerRef.current = L.polyline(coords, {
        color: "#f97316", // orange-500
        weight: 4,
        opacity: 0.85,
        dashArray: "8 4",
        lineCap: "round",
      }).addTo(map);

      // Fit bounds to show entire route
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [40, 40] });

      // Calculate distance and duration
      const distKm = route.distance / 1000;
      const durMin = Math.round(route.duration / 60);
      setRouteInfo({
        distance: distKm < 1 ? `${Math.round(route.distance)} m` : `${distKm.toFixed(1)} km`,
        duration: durMin < 60 ? `${durMin} min` : `${Math.floor(durMin / 60)}h ${durMin % 60}m`,
        distanceKm: distKm,
      });
    } catch (err) {
      console.error("Routing failed:", err);
    }
  }, []);

  // --------------------------------------------------------
  // Create custom marker icons
  // --------------------------------------------------------
  const createIcons = useCallback((L: LType) => {
    const userIcon = L.divIcon({
      className: "custom-marker-user",
      html: `<div style="width:36px;height:36px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:50%;border:3px solid white;box-shadow:0 2px 12px rgba(34,197,94,0.4);display:flex;align-items:center;justify-content:center;">
        <div style="width:8px;height:8px;background:white;border-radius:50%;"></div>
      </div>
      <div style="width:48px;height:48px;background:rgba(34,197,94,0.15);border-radius:50%;position:absolute;top:-6px;left:-6px;animation:pulse 2s infinite;"></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    const warehouseIcon = L.divIcon({
      className: "custom-marker-warehouse",
      html: `<div style="width:32px;height:32px;background:linear-gradient(135deg,#f97316,#ea580c);border-radius:10px;border:2.5px solid white;box-shadow:0 2px 10px rgba(249,115,22,0.35);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
    });

    const marketIcon = L.divIcon({
      className: "custom-marker-market",
      html: `<div style="width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#2563eb);border-radius:10px;border:2.5px solid white;box-shadow:0 2px 10px rgba(59,130,246,0.35);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
    });

    const selectedIcon = L.divIcon({
      className: "custom-marker-selected",
      html: `<div style="width:38px;height:38px;background:linear-gradient(135deg,#f97316,#dc2626);border-radius:12px;border:3px solid white;box-shadow:0 4px 16px rgba(249,115,22,0.5);display:flex;align-items:center;justify-content:center;transform:scale(1.1);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -40],
    });

    return { userIcon, warehouseIcon, marketIcon, selectedIcon };
  }, []);

  // --------------------------------------------------------
  // Initialize map
  // --------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      // Dynamic import to avoid SSR issues
      const L = await import("leaflet");
      if (!mounted || !mapContainerRef.current) return;
      leafletRef.current = L;

      // Fix default marker icon paths (Leaflet quirk with bundlers)
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map (default center: India)
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([20.5937, 78.9629], 5);

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Attribution (small, non-intrusive)
      L.control.attribution({ position: "bottomleft", prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a>')
        .addTo(map);

      // OpenStreetMap tiles with a clean style
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      const icons = createIcons(L);

      // ---- Get user location ----
      setLoadingMsg("Detecting your location...");

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 30000,
          });
        });

        if (!mounted) return;
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos([lat, lng]);

        // Center map on user
        map.setView([lat, lng], 14);

        // User marker
        userMarkerRef.current = L.marker([lat, lng], { icon: icons.userIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center;padding:4px 0;">
              <strong style="font-size:13px;">📍 You are here</strong><br/>
              <span style="font-size:11px;color:#666;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
            </div>`,
            { className: "leaflet-popup-custom" }
          )
          .openPopup();

        // ---- Fetch nearby places ----
        setLoadingMsg("Searching nearby warehouses...");
        let places = await fetchNearbyPlaces(lat, lng);

        // Fallback if no results
        if (places.length === 0) {
          console.log("No Overpass results, using fallback data");
          places = generateFallbackData(lat, lng);
        }

        // Add distance to each
        places = places.map((p) => ({
          ...p,
          distance: p.distance || (() => {
            const d = haversineDistance(lat, lng, p.lat, p.lng);
            return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
          })(),
        }));

        // Sort by distance
        places.sort((a, b) => {
          const da = haversineDistance(lat, lng, a.lat, a.lng);
          const db = haversineDistance(lat, lng, b.lat, b.lng);
          return da - db;
        });

        // Notify parent of results
        onNearbyResults?.(places);

        // ---- Add markers ----
        places.forEach((place) => {
          const icon = place.type === "warehouse" ? icons.warehouseIcon : icons.marketIcon;
          const marker = L.marker([place.lat, place.lng], { icon })
            .addTo(map)
            .bindPopup(
              `<div style="padding:4px 0;min-width:160px;">
                <strong style="font-size:13px;">${place.name}</strong><br/>
                <span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;">${place.type === "warehouse" ? "🏭 Warehouse" : "🏪 Marketplace"}</span><br/>
                <span style="font-size:11px;color:#666;">📏 ${place.distance}</span>
                ${place.capacity ? `<br/><span style="font-size:11px;color:#666;">📦 ${place.capacity}</span>` : ""}
                ${place.price ? `<br/><span style="font-size:11px;color:#666;">💰 ${place.price}</span>` : ""}
                <br/><span style="font-size:10px;color:#f97316;cursor:pointer;font-weight:600;margin-top:4px;display:inline-block;">Click for directions →</span>
              </div>`,
              { className: "leaflet-popup-custom" }
            );

          // Click handler: highlight + route
          marker.on("click", () => {
            // Reset all markers to default icons
            markersRef.current.forEach((m, idx) => {
              const p = places[idx];
              if (p) {
                m.setIcon(p.type === "warehouse" ? icons.warehouseIcon : icons.marketIcon);
              }
            });

            // Highlight selected
            marker.setIcon(icons.selectedIcon);
            onSelectWarehouse?.(place);

            // Draw route
            drawRoute([lat, lng], [place.lat, place.lng]);
          });

          markersRef.current.push(marker);
        });

        setLoading(false);
      } catch (geoErr) {
        console.warn("Geolocation failed:", geoErr);
        if (!mounted) return;

        // Default: New Delhi
        const fallbackLat = 28.6139;
        const fallbackLng = 77.209;
        setUserPos([fallbackLat, fallbackLng]);
        map.setView([fallbackLat, fallbackLng], 12);

        userMarkerRef.current = L.marker([fallbackLat, fallbackLng], { icon: icons.userIcon, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center;padding:4px 0;">
              <strong style="font-size:13px;">📍 Default Location</strong><br/>
              <span style="font-size:11px;color:#666;">New Delhi (location access denied)</span>
            </div>`,
            { className: "leaflet-popup-custom" }
          )
          .openPopup();

        // Use fallback data
        const places = generateFallbackData(fallbackLat, fallbackLng).map((p) => ({
          ...p,
          distance: (() => {
            const d = haversineDistance(fallbackLat, fallbackLng, p.lat, p.lng);
            return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
          })(),
        }));

        onNearbyResults?.(places);

        places.forEach((place) => {
          const icon = place.type === "warehouse" ? icons.warehouseIcon : icons.marketIcon;
          const marker = L.marker([place.lat, place.lng], { icon })
            .addTo(map)
            .bindPopup(
              `<div style="padding:4px 0;min-width:160px;">
                <strong style="font-size:13px;">${place.name}</strong><br/>
                <span style="font-size:11px;color:#888;text-transform:uppercase;">${place.type === "warehouse" ? "🏭 Warehouse" : "🏪 Marketplace"}</span><br/>
                <span style="font-size:11px;color:#666;">📏 ${place.distance}</span>
              </div>`
            );

          marker.on("click", () => {
            markersRef.current.forEach((m, idx) => {
              const p = places[idx];
              if (p) m.setIcon(p.type === "warehouse" ? icons.warehouseIcon : icons.marketIcon);
            });
            marker.setIcon(icons.selectedIcon);
            onSelectWarehouse?.(place);
            drawRoute([fallbackLat, fallbackLng], [place.lat, place.lng]);
          });

          markersRef.current.push(marker);
        });

        setLoading(false);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------
  // Re-center on user location button
  // --------------------------------------------------------
  const handleRecenter = useCallback(() => {
    if (mapRef.current && userPos) {
      mapRef.current.setView(userPos, 14, { animate: true });
    }
  }, [userPos]);

  // --------------------------------------------------------
  // Clear route
  // --------------------------------------------------------
  const handleClearRoute = useCallback(() => {
    if (routeLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setRouteInfo(null);
    setSelectedTransport("mini-truck");
    onSelectWarehouse?.(null);

    // Reset marker icons
    const L = leafletRef.current;
    if (L) {
      const icons = createIcons(L);
      // We don't have direct access to places here, so we reset via a workaround
      markersRef.current.forEach((m) => {
        // Check the current icon class to determine type
        const el = m.getElement();
        if (el?.querySelector(".custom-marker-selected") || el?.classList.contains("custom-marker-selected")) {
          // Default to warehouse icon
          m.setIcon(icons.warehouseIcon);
        }
      });
    }

    if (mapRef.current && userPos) {
      mapRef.current.setView(userPos, 14, { animate: true });
    }
  }, [userPos, onSelectWarehouse, createIcons]);

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-muted-foreground">{loadingMsg}</p>
        </div>
      )}

      {/* Recenter button */}
      {!loading && (
        <button
          onClick={handleRecenter}
          className="absolute top-3 right-3 z-20 h-9 w-9 bg-card/90 backdrop-blur-md border border-border/60 rounded-xl flex items-center justify-center shadow-lg hover:bg-card transition-colors"
          title="Center on your location"
        >
          <LocateFixed className="h-4 w-4 text-primary" />
        </button>
      )}

      {/* Uber-like Transport Options Overlay */}
      <AnimatePresence>
        {routeInfo && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-xl border-t border-border/60 shadow-2xl rounded-t-3xl overflow-hidden flex flex-col max-h-[60vh]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Grab handle & Header */}
            <div className="pt-3 pb-2 px-5 flex flex-col items-center border-b border-border/40 shrink-0">
              <div className="w-12 h-1.5 bg-muted rounded-full mb-3" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Select Transport</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded-md font-medium">
                      <Navigation className="h-3 w-3" /> {routeInfo.distance}
                    </span>
                    <span>•</span>
                    <span>{routeInfo.duration} trip</span>
                  </div>
                </div>
                <button
                  onClick={handleClearRoute}
                  className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Transport Options List */}
            <div className="overflow-y-auto px-3 py-3 space-y-2 pb-6 shrink min-h-0 custom-scrollbar">
              {[
                {
                  id: "pickup",
                  name: "Pickup Truck",
                  desc: "Up to 1.5 Tons • Small loads",
                  time: "5 min away",
                  price: Math.max(150, Math.round(50 + routeInfo.distanceKm * 18)),
                  icon: <Package className="h-6 w-6 text-blue-500" />,
                  bg: "bg-blue-500/10",
                  border: "border-blue-500/20",
                },
                {
                  id: "mini-truck",
                  name: "Mini Truck",
                  desc: "Up to 3 Tons • Medium loads",
                  time: "12 min away",
                  price: Math.max(300, Math.round(100 + routeInfo.distanceKm * 25)),
                  icon: <Truck className="h-6 w-6 text-orange-500" />,
                  bg: "bg-orange-500/10",
                  border: "border-orange-500/30",
                  popular: true,
                },
                {
                  id: "heavy-truck",
                  name: "Heavy Trailer",
                  desc: "Up to 15 Tons • Large bulk",
                  time: "25 min away",
                  price: Math.max(800, Math.round(300 + routeInfo.distanceKm * 40)),
                  icon: <Truck className="h-6 w-6 text-purple-500" />,
                  bg: "bg-purple-500/10",
                  border: "border-purple-500/20",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedTransport(opt.id)}
                  className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedTransport === opt.id
                      ? "border-orange-500 shadow-sm shadow-orange-500/10 bg-orange-500/[0.02]"
                      : "border-border/40 hover:border-border/80 hover:bg-muted/20"
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2.5 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Recommended
                    </span>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${opt.bg} ${opt.border}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{opt.name}</h4>
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">
                          {opt.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-base text-foreground">₹{opt.price}</p>
                    {selectedTransport === opt.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-end mt-1"
                      >
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-border/40 bg-card/50 shrink-0">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                Book Transport <Navigation className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
