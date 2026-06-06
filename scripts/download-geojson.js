const fs = require('fs');
const path = require('path');

async function download() {
  const dataDir = path.resolve(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Fetch and filter countries
  console.log('Fetching world countries GeoJSON...');
  const resCountries = await fetch('https://cdn.jsdelivr.net/gh/datasets/geo-countries/data/countries.geojson');
  if (!resCountries.ok) {
    throw new Error(`Failed to fetch countries: ${resCountries.statusText}`);
  }
  const countries = await resCountries.json();
  
  const targetCodes = ['ARG', 'BRA', 'URY', 'CHL', 'PRY', 'BOL'];
  const filteredFeatures = countries.features.filter(f => {
    const props = f.properties || {};
    const code = props['ISO3166-1-Alpha-3'] || props.ISO_A3 || props.iso_a3 || '';
    return targetCodes.includes(code.toUpperCase());
  });
  
  const filteredCountries = {
    type: 'FeatureCollection',
    features: filteredFeatures
  };
  
  const countriesPath = path.join(dataDir, 'south-america-countries.geojson');
  fs.writeFileSync(countriesPath, JSON.stringify(filteredCountries, null, 2));
  console.log(`Saved filtered countries to ${countriesPath} (${filteredFeatures.length} features)`);

  // 2. Fetch Argentina provinces
  console.log('Fetching Argentina provinces GeoJSON...');
  const resProvinces = await fetch('https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson');
  if (!resProvinces.ok) {
    throw new Error(`Failed to fetch provinces: ${resProvinces.statusText}`);
  }
  const provinces = await resProvinces.json();
  
  const provincesPath = path.join(dataDir, 'argentina-provincias.geojson');
  fs.writeFileSync(provincesPath, JSON.stringify(provinces, null, 2));
  console.log(`Saved provinces to ${provincesPath}`);
}

download().catch(err => {
  console.error('Download failed:', err);
  process.exit(1);
});
