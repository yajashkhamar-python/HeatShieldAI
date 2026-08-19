from pathlib import Path
import io
import os
import base64

import numpy as np
import rasterio

from PIL import Image
from rasterio.warp import transform_bounds

from django.http import (
    JsonResponse,
    FileResponse,
    Http404,
    HttpResponse,
)
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import City, HeatAnalysis
from .serializers import (
    CitySerializer,
    HeatAnalysisSerializer,
)

from .recommendation_engine import generate_recommendation
from .city_data import get_city_data


# ============================================================
# GEO-SPATIAL EXPORT FOLDER
# ============================================================

EXPORTS_FOLDER = Path(
    os.getenv(
        "HEATSHIELD_EXPORTS_DIR",
        str(Path(__file__).resolve().parent.parent.parent / "geaspatial" / "exports")
    )
)


# ============================================================
# API STATUS
# ============================================================

def api_status(request):

    return JsonResponse({
        "project": "HeatShield AI",
        "version": "1.0",
        "status": "Running Successfully 🚀"
    })


# ============================================================
# CITY LIST
# ============================================================

@api_view(["GET"])
def city_list(request):

    cities = City.objects.all().order_by("name")

    serializer = CitySerializer(
        cities,
        many=True
    )

    return Response(serializer.data)


# ============================================================
# COMMON CITY RESPONSE
# ============================================================

def build_city_response(city, data):

    return {

        "city": {
            "id": city.id,
            "name": city.name,
            "state": city.state,
            "latitude": float(city.latitude),
            "longitude": float(city.longitude),
        },

        "analysis_date": data.get(
            "analysis_date",
            timezone.now().date().isoformat()
        ),

        "average_risk": data.get(
            "average_risk",
            0
        ),

        "maximum_risk": data.get(
            "maximum_risk",
            0
        ),

        "hotspot_percentage": data.get(
            "hotspot_percentage",
            0
        ),

        "hotspot_area": data.get(
            "hotspot_area",
            0
        ),

        "average_ndvi": data.get(
            "average_ndvi",
            0
        ),

        "average_ndbi": data.get(
            "average_ndbi",
            0
        ),

        "average_ndwi": data.get(
            "average_ndwi",
            0
        ),

        "average_lst": data.get(
            "average_lst",
            0
        ),
    }


# ============================================================
# CITY ANALYSIS
# ============================================================

@api_view(["GET"])
def city_analysis(request, city_name):

    clean_name = city_name.replace("-", " ").strip()

    city = City.objects.filter(
        name__iexact=clean_name
    ).first()

    if not city:
        city = get_object_or_404(
            City,
            name__icontains=clean_name
        )


    analysis = (
        HeatAnalysis.objects
        .filter(city=city)
        .order_by("-analysis_date")
        .first()
    )

    if analysis:

        serializer = HeatAnalysisSerializer(
            analysis
        )

        return Response(
            serializer.data
        )

    data = get_city_data(
        city.name
    )

    if data is None:

        return Response(
            {
                "error": (
                    f"Analysis data is not available "
                    f"for {city.name}."
                )
            },
            status=404
        )

    return Response(
        build_city_response(
            city,
            data
        )
    )


# ============================================================
# AI RECOMMENDATION
# ============================================================

@api_view(["GET"])
def ai_recommendation(request, city_name):

    city = get_object_or_404(
        City,
        name__iexact=city_name
    )

    analysis = (
        HeatAnalysis.objects
        .filter(city=city)
        .order_by("-analysis_date")
        .first()
    )

    if analysis:

        return Response(
            generate_recommendation(
                analysis
            )
        )

    city_data = get_city_data(
        city.name
    )

    if city_data is None:

        return Response(
            {
                "error": (
                    f"Recommendation data is not available "
                    f"for {city.name}."
                )
            },
            status=404
        )

    recommendation = city_data.get(
        "recommendation",
        {}
    )

    return Response({

        "city": {
            "id": city.id,
            "name": city.name,
            "state": city.state,
        },

        "tree_plantation":
            recommendation.get(
                "tree_plantation",
                0
            ),

        "cool_roof":
            recommendation.get(
                "cool_roof",
                0
            ),

        "water_body":
            recommendation.get(
                "water_body",
                0
            ),

        "immediate_action":
            recommendation.get(
                "immediate_action",
                0
            ),

        "summary":
            city_data.get(
                "summary",
                []
            ),
    })


# ============================================================
# RECOMMENDATION DETAIL
# ============================================================

@api_view(["GET"])
def recommendation_detail(request, city_id):

    city = get_object_or_404(
        City,
        id=city_id
    )

    analysis = (
        HeatAnalysis.objects
        .filter(city=city)
        .order_by("-analysis_date")
        .first()
    )

    if analysis:

        recommendation = generate_recommendation(
            analysis
        )

        return Response({

            "city": analysis.city.name,

            "analysis_date":
                analysis.analysis_date,

            "average_risk":
                analysis.average_risk,

            "maximum_risk":
                analysis.maximum_risk,

            "hotspot_percentage":
                analysis.hotspot_percentage,

            "hotspot_area":
                analysis.hotspot_area,

            "recommendations":
                recommendation
        })

    data = get_city_data(
        city.name
    )

    if data is None:

        return Response(
            {
                "error":
                    "Heat analysis not found"
            },
            status=404
        )

    return Response({

        "city": city.name,

        "analysis_date":
            data.get(
                "analysis_date",
                timezone.now().date().isoformat()
            ),

        "average_risk":
            data.get(
                "average_risk",
                0
            ),

        "maximum_risk":
            data.get(
                "maximum_risk",
                0
            ),

        "hotspot_percentage":
            data.get(
                "hotspot_percentage",
                0
            ),

        "hotspot_area":
            data.get(
                "hotspot_area",
                0
            ),

        "recommendations":
            data.get(
                "recommendation",
                {}
            )
    })


# ============================================================
# RASTER FILE MAPPING
# ============================================================

def get_raster_filename(city_name, layer_name):

    city_name = (
        city_name
        .replace("-", " ")
        .strip()
    )

    city = City.objects.filter(
        name__iexact=city_name
    ).first()

    if city:
        city_name = city.name

    layer_files = {

        "heat-risk":
            f"{city_name}_Heat_Risk.tif",

        "risk-class":
            f"{city_name}_Risk_Class.tif",

        "risk-classification":
            f"{city_name}_Risk_Class.tif",

        "ndvi":
            f"{city_name}_NDVI.tif",

        "ndbi":
            f"{city_name}_NDBI.tif",

        "ndwi":
            f"{city_name}_NDWI.tif",

        "tree":
            f"{city_name}_Tree_Plantation.tif",

        "cool-roof":
            f"{city_name}_Cool_Roof.tif",

        "water":
            f"{city_name}_Water_Bodies.tif",
    }

    return layer_files.get(
        layer_name
    )


# ============================================================
# RASTER PREVIEW JSON
# ============================================================
# ============================================================
# RASTER PREVIEW JSON
# ============================================================

@api_view(["GET"])
def raster_preview(
    request,
    city_name,
    layer_name
):

    # --------------------------------------------------------
    # GET CITY
    # --------------------------------------------------------

    city = get_object_or_404(
        City,
        name__iexact=city_name.strip()
    )

    # --------------------------------------------------------
    # NORMALIZE LAYER
    # --------------------------------------------------------

    layer_name = layer_name.strip().lower()

    if layer_name == "heat-risk":
        layer_key = "heat-risk"
    else:
        layer_key = layer_name

    # --------------------------------------------------------
    # GET CITY-SPECIFIC TIFF
    # --------------------------------------------------------

    filename = get_raster_filename(
        city.name,
        layer_key
    )

    if not filename:

        return Response(
            {
                "error": "Invalid GIS layer",
                "city": city.name,
                "layer": layer_name
            },
            status=400
        )

    raster_path = (
        EXPORTS_FOLDER /
        filename
    )

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not raster_path.exists():

        return Response(
            {
                "error":
                    "GIS layer not available",

                "city":
                    city.name,

                "layer":
                    layer_name,

                "expected_file":
                    filename,

                "full_path":
                    str(raster_path),

                "message":
                    f"{filename} has not been generated yet."
            },
            status=404
        )

    try:

        # ----------------------------------------------------
        # OPEN CITY-SPECIFIC RASTER
        # ----------------------------------------------------

        with rasterio.open(
            raster_path
        ) as src:

            # ------------------------------------------------
            # READ DATA
            # ------------------------------------------------

            data = src.read(
                1
            ).astype(
                np.float32
            )

            # ------------------------------------------------
            # HANDLE NODATA
            # ------------------------------------------------

            nodata = src.nodata

            if nodata is not None:

                data[
                    data == nodata
                ] = np.nan

            data[
                ~np.isfinite(data)
            ] = np.nan

            valid = data[
                np.isfinite(data)
            ]

            if valid.size == 0:

                return Response(
                    {
                        "error":
                            "Raster contains no valid data",

                        "city":
                            city.name,

                        "layer":
                            layer_name,

                        "filename":
                            filename
                    },
                    status=404
                )

            # ------------------------------------------------
            # STATISTICS
            # ------------------------------------------------

            minimum = float(
                np.min(valid)
            )

            maximum = float(
                np.max(valid)
            )

            mean = float(
                np.mean(valid)
            )

            # ------------------------------------------------
            # CREATE COLORIZED RGBA PNG FOR HEAT RISK / RASTER PREVIEW
            # ------------------------------------------------
            if layer_key in ["heat-risk", "risk-class", "risk-classification"]:
                heat_file = EXPORTS_FOLDER / f"{city.name}_Heat_Risk.tif"
                risk_class_file = EXPORTS_FOLDER / f"{city.name}_Risk_Class.tif"
                target_file = heat_file if heat_file.exists() else (risk_class_file if risk_class_file.exists() else raster_path)

                with rasterio.open(target_file) as rsrc:
                    raw_data = rsrc.read(1).astype(np.float32)
                    if rsrc.nodata is not None:
                        raw_data[raw_data == rsrc.nodata] = np.nan
                    if rsrc.crs:
                        w_b, s_b, e_b, n_b = transform_bounds(
                            rsrc.crs, "EPSG:4326", *rsrc.bounds, densify_pts=21
                        )
                    else:
                        w_b, s_b, e_b, n_b = 72.32, 22.79, 72.82, 23.25

                h, w = raw_data.shape
                rgba = np.zeros((h, w, 4), dtype=np.uint8)
                valid_mask = np.isfinite(raw_data) & (raw_data > 0)

                # Check if raw_data is discrete class (1,2,3,4) vs continuous float (0.0 - 1.0)
                unique_vals = set(np.unique(raw_data[valid_mask])) if np.any(valid_mask) else set()
                is_discrete = unique_vals.issubset({0, 1, 2, 3, 4, 5}) and len(unique_vals) <= 6

                if is_discrete:
                    rgba[raw_data == 1] = [32, 201, 151, 145]   # Low Green
                    rgba[raw_data == 2] = [255, 193, 7, 145]   # Moderate Yellow
                    rgba[raw_data == 3] = [255, 87, 34, 145]   # High Orange
                    rgba[(raw_data == 4) | (raw_data == 5)] = [213, 0, 0, 145]  # Very High Crimson Red
                elif np.any(valid_mask):
                    v_min = float(np.min(raw_data[valid_mask]))
                    v_max = float(np.max(raw_data[valid_mask]))
                    if v_max == v_min:
                        norm = np.zeros_like(raw_data[valid_mask])
                    else:
                        norm = np.clip((raw_data[valid_mask] - v_min) / (v_max - v_min), 0.0, 1.0)

                    # Continuous 4-stop interpolation matching Legend (Low -> Moderate -> High -> Very High)
                    colors = np.array([
                        [32, 201, 151],   # Low: Cyan-Green (#20C997)
                        [255, 193, 7],   # Moderate: Amber-Yellow (#FFC107)
                        [255, 87, 34],   # High: Deep Orange (#FF5722)
                        [213, 0, 0]      # Very High: Crimson Red (#D50000)
                    ], dtype=float)
                    stops = np.array([0.0, 0.33, 0.66, 1.0])

                    r = np.interp(norm, stops, colors[:, 0])
                    g = np.interp(norm, stops, colors[:, 1])
                    b = np.interp(norm, stops, colors[:, 2])

                    rgba[valid_mask, 0] = r.astype(np.uint8)
                    rgba[valid_mask, 1] = g.astype(np.uint8)
                    rgba[valid_mask, 2] = b.astype(np.uint8)
                    rgba[valid_mask, 3] = 145  # ~57% Opacity

                image = Image.fromarray(rgba, mode="RGBA")
            else:
                if maximum == minimum:
                    normalized = np.zeros(data.shape, dtype=np.uint8)
                else:
                    normalized = ((data - minimum) / (maximum - minimum) * 255.0)
                    normalized = np.nan_to_num(normalized, nan=0, posinf=255, neginf=0)
                    normalized = np.clip(normalized, 0, 255).astype(np.uint8)
                image = Image.fromarray(normalized, mode="L")
                if src.crs:
                    w_b, s_b, e_b, n_b = transform_bounds(
                        src.crs, "EPSG:4326", *src.bounds, densify_pts=21
                    )
                else:
                    w_b, s_b, e_b, n_b = 72.32, 22.79, 72.82, 23.25

            image.thumbnail((1000, 1000), Image.Resampling.NEAREST)
            buffer = io.BytesIO()
            image.save(buffer, format="PNG", optimize=True)
            image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

            # ------------------------------------------------
            # CENTER BOUNDS ON CITY LAT/LON FOR GEOSPATIAL MAP OVERLAY
            # ------------------------------------------------
            center_lat = float(city.latitude)
            center_lon = float(city.longitude)
            half_lat = abs(n_b - s_b) / 2.0
            half_lon = abs(e_b - w_b) / 2.0

            bounds = [
                [float(center_lat - half_lat), float(center_lon - half_lon)],
                [float(center_lat + half_lat), float(center_lon + half_lon)]
            ]

            # ------------------------------------------------
            # RESPONSE
            # ------------------------------------------------
            return Response({
                "city": city.name,
                "layer": layer_name,
                "filename": filename,
                "min": minimum,
                "max": maximum,
                "mean": mean,
                "bounds": bounds,
                "image": "data:image/png;base64," + image_base64
            })

    except Exception as e:

        print(
            f"Raster preview error "
            f"for {city.name}: {e}"
        )

        return Response(
            {
                "error":
                    "Raster processing failed",

                "city":
                    city.name,

                "layer":
                    layer_name,

                "filename":
                    filename,

                "message":
                    str(e)
            },
            status=500
        )

# ============================================================
# RASTER IMAGE
# ============================================================

@api_view(["GET"])
def raster_image(
    request,
    city_name,
    layer_name
):

    city = get_object_or_404(
        City,
        name__iexact=city_name
    )

    filename = get_raster_filename(
        city.name,
        layer_name
    )

    if not filename:

        return Response(
            {
                "error":
                    "Invalid GIS layer",

                "city":
                    city.name,

                "layer":
                    layer_name
            },
            status=404
        )

    raster_path = (
        EXPORTS_FOLDER
        / filename
    )

    if not raster_path.exists():

        return Response(
            {
                "error":
                    "GIS layer not available",

                "city":
                    city.name,

                "layer":
                    layer_name,

                "expected_file":
                    filename
            },
            status=404
        )

    try:

        with rasterio.open(
            raster_path
        ) as src:

            data = src.read(
                1
            ).astype(
                np.float32
            )

            if src.nodata is not None:

                data[
                    data == src.nodata
                ] = np.nan

            data[
                ~np.isfinite(data)
            ] = np.nan

            valid = data[
                np.isfinite(data)
            ]

            if valid.size == 0:

                return Response(
                    {
                        "error":
                            "Raster contains no valid data"
                    },
                    status=500
                )

            vmin = float(
                np.min(valid)
            )

            vmax = float(
                np.max(valid)
            )

            if vmin == vmax:

                normalized = np.zeros(
                    data.shape,
                    dtype=np.uint8
                )

            else:

                normalized = (
                    (data - vmin)
                    /
                    (vmax - vmin)
                    * 255
                )

                normalized = np.nan_to_num(
                    normalized,
                    nan=0,
                    posinf=255,
                    neginf=0
                )

                normalized = np.clip(
                    normalized,
                    0,
                    255
                ).astype(
                    np.uint8
                )

            image = Image.fromarray(
                normalized,
                mode="L"
            )

            buffer = io.BytesIO()

            image.save(
                buffer,
                format="PNG"
            )

            buffer.seek(0)

            response = HttpResponse(
                buffer.getvalue(),
                content_type="image/png"
            )

            response[
                "Cache-Control"
            ] = "no-store"

            response[
                "X-Raster-City"
            ] = city.name

            response[
                "X-Raster-Layer"
            ] = layer_name

            return response

    except Exception as e:

        return Response(
            {
                "error":
                    "Failed to render raster",

                "city":
                    city.name,

                "layer":
                    layer_name,

                "details":
                    str(e)
            },
            status=500
        )


# ============================================================
# DOWNLOAD MAP
# ============================================================

@api_view(["GET"])
def download_map(
    request,
    city_name,
    layer_name
):

    city = get_object_or_404(
        City,
        name__iexact=city_name
    )

    filename = get_raster_filename(
        city.name,
        layer_name
    )

    if not filename:

        return Response(
            {
                "error":
                    "Invalid GIS layer",

                "city":
                    city.name,

                "layer":
                    layer_name
            },
            status=404
        )

    filepath = (
        EXPORTS_FOLDER
        / filename
    )

    if not filepath.exists():

        return Response(
            {
                "error":
                    "GIS layer not available",

                "city":
                    city.name,

                "layer":
                    layer_name,

                "expected_file":
                    filename,

                "message":
                    f"{filename} has not been generated yet."
            },
            status=404
        )

    return FileResponse(
        open(
            filepath,
            "rb"
        ),
        as_attachment=True,
        filename=filename,
        content_type="application/octet-stream"
    )

import math


def safe_float(value, default=None):

    try:

        value = float(value)

        if not math.isfinite(value):
            return default

        return value

    except (TypeError, ValueError):

        return default