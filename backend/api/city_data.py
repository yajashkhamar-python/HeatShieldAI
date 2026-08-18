# backend/api/city_data.py

from datetime import date


CITY_DATA = {

    "Ahmedabad": {
        "analysis_date": "2026-08-17",

        "average_risk": 0.58,
        "maximum_risk": 0.91,
        "hotspot_percentage": 34.2,
        "hotspot_area": 132.4,

        "average_ndvi": 0.31,
        "average_ndbi": 0.47,
        "average_ndwi": 0.18,
        "average_lst": 39.6,

        "recommendation": {
            "tree_plantation": "Increase urban tree plantation in high-risk residential zones.",
            "cool_roof": "Deploy reflective cool roofs in high-temperature built-up areas.",
            "water_body": "Restore and expand nearby water bodies.",
            "immediate_action": "Prioritize heatwave protection in identified hotspots."
        },

        "summary": [
            "High heat concentration detected in dense urban zones.",
            "Vegetation coverage is comparatively low.",
            "Cool roof and tree plantation measures are recommended."
        ]
    },


    "Delhi": {
        "analysis_date": "2026-08-17",

        "average_risk": 0.67,
        "maximum_risk": 0.95,
        "hotspot_percentage": 41.8,
        "hotspot_area": 184.7,

        "average_ndvi": 0.24,
        "average_ndbi": 0.56,
        "average_ndwi": 0.14,
        "average_lst": 41.3,

        "recommendation": {
            "tree_plantation": "Increase green cover along dense residential and commercial corridors.",
            "cool_roof": "Prioritize cool roofs in highly built-up heat hotspots.",
            "water_body": "Protect and restore urban water bodies.",
            "immediate_action": "Issue targeted heat-health alerts for high-risk zones."
        },

        "summary": [
            "Delhi shows elevated urban heat risk.",
            "High built-up density contributes to increased heat.",
            "Green infrastructure should be expanded."
        ]
    },


    "Mumbai": {
        "analysis_date": "2026-08-17",

        "average_risk": 0.49,
        "maximum_risk": 0.82,
        "hotspot_percentage": 27.5,
        "hotspot_area": 91.8,

        "average_ndvi": 0.38,
        "average_ndbi": 0.43,
        "average_ndwi": 0.29,
        "average_lst": 36.8,

        "recommendation": {
            "tree_plantation": "Increase tree cover in dense urban neighborhoods.",
            "cool_roof": "Promote reflective roofs in high-density built-up areas.",
            "water_body": "Preserve coastal and inland water bodies.",
            "immediate_action": "Monitor high-temperature urban hotspots."
        },

        "summary": [
            "Mumbai has moderate urban heat risk.",
            "Water and vegetation provide some heat mitigation.",
            "Dense built-up areas remain important hotspots."
        ]
    },


    "Bengaluru": {
        "analysis_date": "2026-08-17",

        "average_risk": 0.42,
        "maximum_risk": 0.76,
        "hotspot_percentage": 21.4,
        "hotspot_area": 72.6,

        "average_ndvi": 0.44,
        "average_ndbi": 0.39,
        "average_ndwi": 0.23,
        "average_lst": 34.9,

        "recommendation": {
            "tree_plantation": "Protect existing vegetation and expand urban tree corridors.",
            "cool_roof": "Introduce cool roofs in dense built-up areas.",
            "water_body": "Restore urban lakes and water bodies.",
            "immediate_action": "Monitor rapidly developing heat hotspots."
        },

        "summary": [
            "Bengaluru has comparatively moderate heat risk.",
            "Vegetation provides significant cooling benefits.",
            "Urban development remains a key heat-risk driver."
        ]
    },


    "Hyderabad": {
        "analysis_date": "2026-08-17",

        "average_risk": 0.61,
        "maximum_risk": 0.89,
        "hotspot_percentage": 36.7,
        "hotspot_area": 118.3,

        "average_ndvi": 0.29,
        "average_ndbi": 0.51,
        "average_ndwi": 0.17,
        "average_lst": 38.8,

        "recommendation": {
            "tree_plantation": "Increase vegetation in dense urban heat hotspots.",
            "cool_roof": "Promote reflective roofs across high-risk built-up zones.",
            "water_body": "Restore and protect urban water bodies.",
            "immediate_action": "Prioritize heat-risk mitigation in high-temperature areas."
        },

        "summary": [
            "Hyderabad shows elevated urban heat risk.",
            "Built-up density contributes strongly to heat concentration.",
            "Green and blue infrastructure should be expanded."
        ]
    }
}


def get_city_data(city_name):

    if not city_name:
        return None

    city_name = city_name.strip().title()

    return CITY_DATA.get(city_name)