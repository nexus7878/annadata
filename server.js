const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ============================================================
// Mock Data
// ============================================================

const cropImages = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
  soybean: 'https://images.unsplash.com/photo-1515543904413-637be1ee4517?w=400&h=300&fit=crop',
  cotton: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=300&fit=crop',
  sugarcane: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
  mustard: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=400&h=300&fit=crop',
  potato: 'https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=400&h=300&fit=crop',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=300&fit=crop',
  groundnut: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=400&h=300&fit=crop',
};

const mandis = [
  { id: 1, name: 'Azadpur Mandi', city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, distance: 12 },
  { id: 2, name: 'Vashi APMC', city: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, distance: 25 },
  { id: 3, name: 'Karnal Mandi', city: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, distance: 45 },
  { id: 4, name: 'Indore Mandi', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, distance: 850 },
  { id: 5, name: 'Rajkot APMC', city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, distance: 1100 },
  { id: 6, name: 'Narela Mandi', city: 'Delhi', state: 'Delhi', lat: 28.8529, lng: 77.0928, distance: 18 },
  { id: 7, name: 'Unjha APMC', city: 'Unjha', state: 'Gujarat', lat: 23.8041, lng: 72.3979, distance: 950 },
  { id: 8, name: 'Lasalgaon', city: 'Nashik', state: 'Maharashtra', lat: 20.1437, lng: 74.2315, distance: 1300 },
  { id: 9, name: 'Kurnool Mandi', city: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, distance: 1600 },
  { id: 10, name: 'Hubli APMC', city: 'Hubli', state: 'Karnataka', lat: 15.3647, lng: 75.1240, distance: 1450 },
  { id: 11, name: 'Jaipur Mandi', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, distance: 280 },
  { id: 12, name: 'Ludhiana Mandi', city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, distance: 310 },
];

const crops = [
  { id: 1, name: 'Wheat (Lokwan)', category: 'cereals', quality: 'A Grade', price: 2350, change: 8.2, organic: false, demand: 'High', image: cropImages.wheat },
  { id: 2, name: 'Rice (Basmati)', category: 'cereals', quality: 'Premium', price: 4100, change: 2.1, organic: false, demand: 'High', image: cropImages.rice },
  { id: 3, name: 'Maize (Yellow)', category: 'cereals', quality: 'B Grade', price: 1950, change: -1.5, organic: false, demand: 'Medium', image: cropImages.maize },
  { id: 4, name: 'Soybean', category: 'oilseeds', quality: 'A Grade', price: 4800, change: 5.4, organic: true, demand: 'High', image: cropImages.soybean },
  { id: 5, name: 'Cotton (Long Staple)', category: 'fibers', quality: 'Premium', price: 7200, change: -0.8, organic: false, demand: 'Medium', image: cropImages.cotton },
  { id: 6, name: 'Sugarcane', category: 'cash_crops', quality: 'A Grade', price: 350, change: 3.2, organic: false, demand: 'High', image: cropImages.sugarcane },
  { id: 7, name: 'Mustard', category: 'oilseeds', quality: 'B Grade', price: 5200, change: -2.3, organic: true, demand: 'Low', image: cropImages.mustard },
  { id: 8, name: 'Potato (Jyoti)', category: 'vegetables', quality: 'A Grade', price: 1200, change: 12.5, organic: false, demand: 'High', image: cropImages.potato },
  { id: 9, name: 'Onion (Red)', category: 'vegetables', quality: 'A Grade', price: 2800, change: -4.1, organic: false, demand: 'High', image: cropImages.onion },
  { id: 10, name: 'Tomato', category: 'vegetables', quality: 'B Grade', price: 3500, change: 18.2, organic: true, demand: 'High', image: cropImages.tomato },
  { id: 11, name: 'Red Chilli', category: 'spices', quality: 'Premium', price: 12500, change: 6.7, organic: false, demand: 'Medium', image: cropImages.chilli },
  { id: 12, name: 'Groundnut', category: 'oilseeds', quality: 'A Grade', price: 5600, change: 1.9, organic: true, demand: 'Low', image: cropImages.groundnut },
];

// Generate crop-mandi price entries
const cropMandiPrices = [];
crops.forEach(crop => {
  const shuffled = [...mandis].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 4));
  shuffled.forEach(mandi => {
    const priceVariation = crop.price * (0.9 + Math.random() * 0.2);
    cropMandiPrices.push({
      id: `${crop.id}-${mandi.id}`,
      cropId: crop.id,
      cropName: crop.name,
      category: crop.category,
      quality: crop.quality,
      price: Math.round(priceVariation),
      change: +(crop.change + (Math.random() * 4 - 2)).toFixed(1),
      organic: crop.organic,
      demand: crop.demand,
      image: crop.image,
      mandiId: mandi.id,
      mandiName: mandi.name,
      city: mandi.city,
      state: mandi.state,
      lat: mandi.lat,
      lng: mandi.lng,
      distance: mandi.distance,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      reviews: Math.floor(50 + Math.random() * 500),
    });
  });
});

// ============================================================
// API Endpoints
// ============================================================

// GET /api/crops — search & paginated crop price list
app.get('/api/crops', (req, res) => {
  const { search, category, minPrice, maxPrice, organic, sort, page = 1, limit = 12 } = req.query;
  let results = [...cropMandiPrices];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(r => r.cropName.toLowerCase().includes(q) || r.mandiName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q));
  }
  if (category) {
    const cats = category.split(',');
    results = results.filter(r => cats.includes(r.category));
  }
  if (minPrice) results = results.filter(r => r.price >= Number(minPrice));
  if (maxPrice) results = results.filter(r => r.price <= Number(maxPrice));
  if (organic === 'true') results = results.filter(r => r.organic);

  // Sorting
  if (sort === 'price_high') results.sort((a, b) => b.price - a.price);
  else if (sort === 'price_low') results.sort((a, b) => a.price - b.price);
  else if (sort === 'nearest') results.sort((a, b) => a.distance - b.distance);
  else if (sort === 'trending') results.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  const start = (Number(page) - 1) * Number(limit);
  const paginated = results.slice(start, start + Number(limit));

  res.json({
    data: paginated,
    total: results.length,
    page: Number(page),
    totalPages: Math.ceil(results.length / Number(limit)),
  });
});

// GET /api/mandis — list mandis with optional filtering
app.get('/api/mandis', (req, res) => {
  const { maxDistance, state } = req.query;
  let results = [...mandis];

  if (maxDistance) results = results.filter(m => m.distance <= Number(maxDistance));
  if (state) results = results.filter(m => m.state.toLowerCase() === state.toLowerCase());

  res.json({ data: results, total: results.length });
});

// GET /api/recommendations — AI recommendation logic
app.get('/api/recommendations', (req, res) => {
  const { crop } = req.query;
  let results = [...cropMandiPrices];
  if (crop) {
    const q = crop.toLowerCase();
    results = results.filter(r => r.cropName.toLowerCase().includes(q));
  }

  // Score = weighted combination of price, distance, demand
  const demandScore = { High: 30, Medium: 15, Low: 5 };
  const scored = results.map(r => ({
    ...r,
    score: (r.price / 100) + (1000 / (r.distance + 1)) * 10 + (demandScore[r.demand] || 0) + (r.change > 0 ? r.change * 2 : 0),
    reason: r.change > 5 ? 'Rapidly rising prices' : r.distance < 30 ? 'Very close to you' : r.demand === 'High' ? 'High demand in this mandi' : 'Good price-to-distance ratio',
  }));

  scored.sort((a, b) => b.score - a.score);
  res.json({ data: scored.slice(0, 5) });
});

// GET /api/price-history/:crop — 30-day price history
app.get('/api/price-history/:crop', (req, res) => {
  const cropName = req.params.crop.toLowerCase();
  const cropEntry = crops.find(c => c.name.toLowerCase().includes(cropName));
  if (!cropEntry) return res.status(404).json({ error: 'Crop not found' });

  const basePrice = cropEntry.price;
  const history = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variance = basePrice * (0.92 + Math.random() * 0.16);
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(variance),
      predicted: false,
    });
  }

  // Add 7 days of predictions
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const trend = cropEntry.change > 0 ? 1.002 : 0.998;
    const lastPrice = history[history.length - 1].price;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(lastPrice * trend * (0.98 + Math.random() * 0.04)),
      predicted: true,
    });
  }

  res.json({ crop: cropEntry.name, unit: '₹/Quintal', data: history });
});

// GET /api/ticker — live price ticker data
app.get('/api/ticker', (req, res) => {
  const ticker = crops.map(c => ({
    name: c.name.split(' (')[0],
    price: c.price,
    change: c.change,
    unit: '₹/Qtl',
  }));
  res.json({ data: ticker });
});

app.listen(PORT, () => {
  console.log(`🌾 Annadata Market API running at http://localhost:${PORT}`);
});
