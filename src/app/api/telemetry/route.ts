import { NextResponse } from "next/server";

// Simulated base values that drift slightly each call
let baseTemp = 29.2;
let baseMoisture = 44;
let baseHumidity = 67;
let baseWind = 11;
let baseEC = 1.24;
let baseN = 46;
let baseP = 24;
let baseK = 182;

function drift(value: number, range: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * range;
  return Math.max(min, Math.min(max, value + delta));
}

export async function GET() {
  // Apply realistic drift
  baseTemp = drift(baseTemp, 0.6, 22, 42);
  baseMoisture = drift(baseMoisture, 1.5, 20, 75);
  baseHumidity = drift(baseHumidity, 2, 30, 95);
  baseWind = drift(baseWind, 1.2, 0, 35);
  baseEC = drift(baseEC, 0.05, 0.2, 3.0);
  baseN = drift(baseN, 1.5, 15, 80);
  baseP = drift(baseP, 1, 8, 50);
  baseK = drift(baseK, 3, 80, 280);

  const now = new Date();

  // Generate 24h sparkline data
  const tempHistory: number[] = [];
  const moistureHistory: number[] = [];
  const humidityHistory: number[] = [];
  let t = baseTemp - 4;
  let m = baseMoisture + 8;
  let h = baseHumidity - 5;
  for (let i = 0; i < 24; i++) {
    t = drift(t, 1.4, 20, 44);
    m = drift(m, 2.5, 18, 78);
    h = drift(h, 3, 28, 98);
    tempHistory.push(parseFloat(t.toFixed(1)));
    moistureHistory.push(parseFloat(m.toFixed(1)));
    humidityHistory.push(parseFloat(h.toFixed(1)));
  }

  // Weekly crop health trend
  const cropHealth = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    ndvi: parseFloat((0.62 + Math.random() * 0.18).toFixed(2)),
    stress: parseFloat((0.08 + Math.random() * 0.15).toFixed(2)),
  }));

  // Live sensor nodes
  const nodeNames = [
    "Field A - North", "Field A - South", "Field B - East", "Field B - West",
    "Greenhouse 1", "Greenhouse 2", "Nursery Block", "Orchard Zone",
    "Field C - Central", "Water Tank Area", "Compost Bay", "Storage Yard",
  ];
  const sensorNodes = nodeNames.map((name, i) => ({
    id: `node-${i + 1}`,
    name,
    status: Math.random() > 0.1 ? "online" : "offline",
    battery: Math.floor(55 + Math.random() * 45),
    temp: parseFloat(drift(baseTemp, 2, 20, 44).toFixed(1)),
    moisture: parseFloat(drift(baseMoisture, 5, 18, 78).toFixed(1)),
    signal: Math.floor(60 + Math.random() * 40),
    lastSeen: new Date(now.getTime() - Math.floor(Math.random() * 300000)).toISOString(),
  }));

  const onlineNodes = sensorNodes.filter(n => n.status === "online").length;

  const systemNotices = [
    { id: "n1", type: "warning", title: "High Temperature Alert", message: `Field A sensors report ${baseTemp.toFixed(1)}°C — exceeds optimal growing threshold. Consider irrigation schedule adjustment.` },
    { id: "n2", type: "info", title: "Firmware Update Available", message: "IoT Node firmware v3.2.1 is ready for 4 nodes. Schedule update during off-peak hours." },
    { id: "n3", type: "info", title: "Weekly Soil Report", message: `Nitrogen levels at ${baseN.toFixed(0)} mg/kg. Phosphorus needs attention at ${baseP.toFixed(0)} mg/kg.` },
  ];

  const activityTimes = [
    "Just now", "2 min ago", "8 min ago", "15 min ago", "32 min ago",
    "1 hr ago", "2 hrs ago", "3 hrs ago",
  ];
  const recentActivities = [
    { id: "a1", type: "water", label: "Drip irrigation activated — Field A North", time: activityTimes[0] },
    { id: "a2", type: "nutrient", label: `Soil NPK reading updated: N=${baseN.toFixed(0)}, P=${baseP.toFixed(0)}, K=${baseK.toFixed(0)}`, time: activityTimes[1] },
    { id: "a3", type: "calendar", label: "Harvest window for Wheat estimated: April 12–18", time: activityTimes[2] },
    { id: "a4", type: "market", label: "Wheat price up ₹48/Qtl at Azadpur Mandi", time: activityTimes[3] },
    { id: "a5", type: "water", label: "Reservoir level at 78% — auto-refill triggered", time: activityTimes[4] },
    { id: "a6", type: "nutrient", label: "Fertigation cycle completed — Greenhouse 1", time: activityTimes[5] },
  ];

  // Weather forecast
  const weatherForecast = [
    { day: "Today", icon: "partly_cloudy", high: Math.round(baseTemp + 3), low: Math.round(baseTemp - 6), precip: Math.floor(Math.random() * 20) },
    { day: "Tomorrow", icon: "sunny", high: Math.round(baseTemp + 4), low: Math.round(baseTemp - 5), precip: Math.floor(Math.random() * 10) },
    { day: "Wed", icon: "rainy", high: Math.round(baseTemp + 1), low: Math.round(baseTemp - 7), precip: 40 + Math.floor(Math.random() * 30) },
    { day: "Thu", icon: "partly_cloudy", high: Math.round(baseTemp + 2), low: Math.round(baseTemp - 6), precip: Math.floor(Math.random() * 25) },
    { day: "Fri", icon: "sunny", high: Math.round(baseTemp + 5), low: Math.round(baseTemp - 4), precip: Math.floor(Math.random() * 5) },
  ];

  return NextResponse.json({
    timestamp: now.toISOString(),
    kpis: {
      temperature: parseFloat(baseTemp.toFixed(1)),
      soilMoisture: parseFloat(baseMoisture.toFixed(1)),
      humidity: parseFloat(baseHumidity.toFixed(1)),
      windSpeed: parseFloat(baseWind.toFixed(1)),
    },
    trends: {
      tempDelta: parseFloat((Math.random() * 2 - 0.8).toFixed(1)),
      moistureDelta: parseFloat((Math.random() * 4 - 2).toFixed(1)),
      humidityDelta: parseFloat((Math.random() * 6 - 2).toFixed(1)),
      windDelta: parseFloat((Math.random() * 3 - 1.5).toFixed(1)),
    },
    sparklines: {
      temperature: tempHistory,
      moisture: moistureHistory,
      humidity: humidityHistory,
    },
    soilChemistry: {
      Nitrogen: baseN.toFixed(0),
      Phosphorus: baseP.toFixed(0),
      Potassium: baseK.toFixed(0),
      EC: baseEC.toFixed(2),
    },
    cropHealth,
    sensorNodes,
    nodeStats: {
      total: sensorNodes.length,
      online: onlineNodes,
      avgBattery: Math.round(sensorNodes.reduce((a, n) => a + n.battery, 0) / sensorNodes.length),
    },
    weatherForecast,
    systemNotices,
    recentActivities,
  });
}
