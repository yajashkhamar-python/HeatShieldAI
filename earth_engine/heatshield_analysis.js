// Ahmedabad Location
var ahmedabad = ee.Geometry.Point([72.5714, 23.0225]);

Map.centerObject(ahmedabad, 11);

// Load Sentinel-2 Data
var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(ahmedabad)
    .filterDate('2025-01-01', '2025-12-31')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10));

var image = dataset.sort('system:time_start', false).first();

// RGB Image
Map.addLayer(image,
{
  bands:['B4','B3','B2'],
  min:0,
  max:3000
},
'RGB');

// Calculate NDVI
var ndvi = image.normalizedDifference(['B8','B4']).rename('NDVI');

// NDVI Colors
var ndviParams =
{
    min:-1,
    max:1,
    palette:[
        'blue',
        'white',
        'yellow',
        'green',
        'darkgreen'
    ]
};

// Show NDVI
Map.addLayer(ndvi, ndviParams, 'NDVI');
// Calculate NDBI
var ndbi = image.normalizedDifference(['B11', 'B8']).rename('NDBI');

// Display Settings
var ndbiParams = {
  min: -1,
  max: 1,
  palette: [
    'green',
    'yellow',
    'orange',
    'red'
  ]
};

// Add Layer
Map.addLayer(ndbi, ndbiParams, 'NDBI');
// ----------------------------
// Calculate NDWI
// ----------------------------

var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');

var ndwiParams = {
  min: -1,
  max: 1,
  palette: [
    'brown',
    'yellow',
    'cyan',
    'blue'
  ]
};

Map.addLayer(ndwi, ndwiParams, 'NDWI');
// =======================================
// LANDSAT 8 COLLECTION FOR LST
// =======================================

// Load Landsat 8 Collection 2 Level 2
var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterBounds(ahmedabad)
    .filterDate('2025-01-01', '2025-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER',10));

// Select latest image
var lstImage = landsat.sort('system:time_start', false).first();
// =======================================
// LAND SURFACE TEMPERATURE
// =======================================

// Convert ST_B10 to Celsius
var lst = lstImage.select('ST_B10')
    .multiply(0.00341802)
    .add(149.0)
    .subtract(273.15)
    .rename('LST');

var lstParams = {
    min: 20,
    max: 50,
    palette: [
        'blue',
        'cyan',
        'green',
        'yellow',
        'orange',
        'red'
    ]
};

Map.addLayer(lst, lstParams, 'Land Surface Temperature');


// ===============================
// Normalize NDVI
// ===============================
var ndviNorm = ndvi.unitScale(-1, 1);

// Normalize NDBI
var ndbiNorm = ndbi.unitScale(-1, 1);

// Normalize NDWI
var ndwiNorm = ndwi.unitScale(-1, 1);

// Normalize LST
var lstNorm = lst.unitScale(20, 50);


// LST Statistics
var lstStats = lst.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

print('LST Min-Max', lstStats);

// NDVI Statistics
var ndviStats = ndvi.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

print('NDVI Min-Max', ndviStats);

// NDBI Statistics
var ndbiStats = ndbi.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

print('NDBI Min-Max', ndbiStats);

// NDWI Statistics
var ndwiStats = ndwi.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

print('NDWI Min-Max', ndwiStats);

// ===================================
// Urban Heat Risk Index
// ===================================

var rawHeatRisk = lstNorm.multiply(0.40)
    .add(ndbiNorm.multiply(0.25))
    .subtract(ndviNorm.multiply(0.20))
    .subtract(ndwiNorm.multiply(0.15));

// Normalize to 0-1
var heatRisk = rawHeatRisk.unitScale(-0.15,0.25)
                          .clamp(0,1)
                          .rename('Heat_Risk');

var heatRiskParams = {
  min:0,
  max:1,
  palette:[
    '#2ECC71',
    '#F1C40F',
    '#E67E22',
    '#E74C3C',
    '#8E0000'
  ]
};

Map.addLayer(
    heatRisk,
    heatRiskParams,
    'Urban Heat Risk'
);
// ================================
// HIGH RISK HOTSPOTS
// ================================
// Heat Risk Statistics
var stats = heatRisk.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});

print("Heat Risk Min-Max", stats);
// Heat Risk Threshold
var hotspot = heatRisk.gt(0.70);
Map.addLayer(
    hotspot.selfMask(),
    {
      palette:['red']
    },
    'High Risk Hotspots'
);
// ===================================
// RISK CLASSIFICATION
// ===================================

var riskClass = ee.Image(0)

.where(heatRisk.lt(0.25),1)

.where(
heatRisk.gte(0.25).and(heatRisk.lt(0.45)),2)

.where(
heatRisk.gte(0.45).and(heatRisk.lt(0.65)),3)

.where(
heatRisk.gte(0.65).and(heatRisk.lt(0.85)),4)

.where(
heatRisk.gte(0.85),5);

Map.addLayer(
riskClass,
{
min:1,
max:5,
palette:[
'006400',   // Low
'7FFF00',   // Medium
'FFFF00',   // High
'FF8C00',   // Very High
'FF0000'    // Extreme
]
},
'Risk Classification'
);
// =============================
// Average Heat Risk
// =============================

var stats = heatRisk.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad,
  scale: 10,
  maxPixels: 1e9
});

print('Average Heat Risk', stats);
// =====================================
// TOTAL HOTSPOT AREA
// =====================================

var hotspotArea = hotspot.multiply(ee.Image.pixelArea());

var hotspotStats = hotspotArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});

var areaSqKm = ee.Number(hotspotStats.get('Heat_Risk'))
                .divide(1000000);

print('Hotspot Area (sq.km):', areaSqKm);
// =====================================
// TOTAL STUDY AREA
// =====================================

var totalArea = ee.Image.pixelArea().reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});

var totalSqKm = ee.Number(totalArea.get('area'))
                  .divide(1000000);

var hotspotPercent = areaSqKm
                      .divide(totalSqKm)
                      .multiply(100);

print('Total Area (sq.km)', totalSqKm);
print('Hotspot Percentage (%)', hotspotPercent);


// =====================================
// CREATE ANALYSIS SUMMARY
// =====================================

// NDVI Statistics
var ndviStats = ndvi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

// NDBI Statistics
var ndbiStats = ndbi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

// NDWI Statistics
var ndwiStats = ndwi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

// LST Statistics
var lstStats = lst.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

// Heat Risk Statistics
var heatRiskStats = heatRisk.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});

// Analysis Summary
var analysisSummary = ee.Dictionary({
  city: "Ahmedabad",
  average_ndvi: ndviStats.get("NDVI"),
  average_ndbi: ndbiStats.get("NDBI"),
  average_ndwi: ndwiStats.get("NDWI"),
  average_lst: lstStats.get("LST"),
  average_risk: heatRiskStats.get("Heat_Risk"),
  hotspot_area: areaSqKm,
  hotspot_percentage: hotspotPercent
});

print("Analysis Summary", analysisSummary);
// =====================================
// AI RECOMMENDATION ENGINE (Improved)
// =====================================

// 1. Tree Plantation
var treePlantation =
    heatRisk.gt(0.65)
    .and(ndvi.lt(0.30));

Map.addLayer(
    treePlantation.selfMask(),
    {palette:['006400']},
    'Recommendation - Plant Trees'
);


// 2. Cool Roofs
var coolRoof =
    heatRisk.gt(0.70)
    .and(ndbi.gt(0.15));

Map.addLayer(
    coolRoof.selfMask(),
    {palette:['00BFFF']},
    'Recommendation - Cool Roofs'
);


// 3. Water Body Development
var waterBodies =
    heatRisk.gt(0.60)
    .and(ndwi.lt(0));

Map.addLayer(
    waterBodies.selfMask(),
    {palette:['0000FF']},
    'Recommendation - Water Bodies'
);


// 4. Immediate Action
var urgentZone =
    heatRisk.gt(0.85);

Map.addLayer(
    urgentZone.selfMask(),
    {palette:['FF00FF']},
    'Immediate Action Zone'
);

// =====================================
// RECOMMENDATION STATISTICS
// =====================================

function calculateArea(mask, name){

var area = mask.multiply(ee.Image.pixelArea());

var stats = area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: ahmedabad.buffer(25000),
  scale:30,
  maxPixels:1e13
});

var sqkm = ee.Number(stats.values().get(0))
            .divide(1000000);

print(name, sqkm);

}

calculateArea(treePlantation,"Tree Plantation Area (sq.km)");
calculateArea(coolRoof,"Cool Roof Area (sq.km)");
calculateArea(waterBodies,"Water Body Recommendation (sq.km)");
calculateArea(urgentZone,"Immediate Action Area (sq.km)");


// ========================================
// EXPORT - URBAN HEAT RISK MAP
// ========================================

Export.image.toDrive({
  image: heatRisk,
  description: 'Ahmedabad_Heat_Risk',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Ahmedabad_Heat_Risk',
  region: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});

// ========================================
// EXPORT - RISK CLASSIFICATION
// ========================================

Export.image.toDrive({
  image: riskClass,
  description: 'Ahmedabad_Risk_Class',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Ahmedabad_Risk_Class',
  region: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


Export.image.toDrive({
  image: treePlantation,
  description: 'Tree_Plantation',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Tree_Plantation',
  region: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});


Export.image.toDrive({
  image: coolRoof,
  description: 'Cool_Roof',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Cool_Roof',
  region: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});


Export.image.toDrive({
  image: waterBodies,
  description: 'Water_Bodies',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Water_Bodies',
  region: ahmedabad.buffer(25000),
  scale: 30,
  maxPixels: 1e13
});


Export.image.toDrive({
  image: ndvi,
  description: 'Ahmedabad_NDVI',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Ahmedabad_NDVI',
  region: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});


Export.image.toDrive({
  image: ndbi,
  description: 'Ahmedabad_NDBI',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Ahmedabad_NDBI',
  region: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});



Export.image.toDrive({
  image: ndwi,
  description: 'Ahmedabad_NDWI',
  folder: 'HeatShieldAI',
  fileNamePrefix: 'Ahmedabad_NDWI',
  region: ahmedabad.buffer(25000),
  scale: 10,
  maxPixels: 1e13
});


// =========================================
// COMBINED RECOMMENDATION MAP
// =========================================

var recommendation = ee.Image(0)

.where(treePlantation,1)

.where(coolRoof,2)

.where(waterBodies,3)

.where(urgentZone,4)

.rename('Recommendation');


Map.addLayer(
recommendation,
{
min:0,
max:4,
palette:[
'FFFFFF',   // No Recommendation
'228B22',   // Tree Plantation
'1E90FF',   // Cool Roof
'00FFFF',   // Water Body
'FF0000'    // Immediate Action
]
},
'Recommendation Map'
);


// =========================================
// EXPORT RECOMMENDATION MAP
// =========================================

Export.image.toDrive({

image:recommendation,

description:'Ahmedabad_Recommendation_Map',

folder:'HeatShieldAI',

fileNamePrefix:'Recommendation_Map',

region:ahmedabad.buffer(25000),

scale:10,

maxPixels:1e13,

fileFormat:'GeoTIFF'

});