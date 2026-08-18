def generate_recommendation(analysis):

    recommendations = []

    tree = 0
    cool = 0
    water = 0
    emergency = 0

    # NDVI
    if analysis.average_ndvi < 0.30:
        tree = 40
        recommendations.append(
            "Vegetation cover is low. Increase urban tree plantation."
        )
    elif analysis.average_ndvi < 0.45:
        tree = 25
        recommendations.append(
            "Increase green corridors and roadside plantation."
        )
    else:
        tree = 10

    # NDBI
    if analysis.average_ndbi > 0.20:
        cool = 35
        recommendations.append(
            "High built-up density detected. Promote cool roofs."
        )
    elif analysis.average_ndbi > 0:
        cool = 20
        recommendations.append(
            "Encourage reflective roofing materials."
        )
    else:
        cool = 5

    # NDWI
    if analysis.average_ndwi < -0.20:
        water = 25
        recommendations.append(
            "Very low water availability. Restore lakes and ponds."
        )
    elif analysis.average_ndwi < 0:
        water = 15
        recommendations.append(
            "Protect existing water bodies."
        )
    else:
        water = 5

    # LST
    if analysis.average_lst > 35:
        emergency = 20
        recommendations.append(
            "Extreme surface temperature. Activate Heat Action Plan."
        )
    elif analysis.average_lst > 30:
        emergency = 10
        recommendations.append(
            "Increase cooling shelters and public awareness."
        )
    else:
        emergency = 5

    return {
        "tree_plantation": tree,
        "cool_roof": cool,
        "water_body": water,
        "immediate_action": emergency,
        "recommendation_text": recommendations,
    }