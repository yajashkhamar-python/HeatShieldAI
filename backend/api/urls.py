from django.urls import path
from . import views


urlpatterns = [

    path(
        "",
        views.api_status
    ),

    path(
        "cities/",
        views.city_list,
        name="city-list"
    ),

    path(
        "analysis/<str:city_name>/",
        views.city_analysis,
        name="city-analysis"
    ),

    path(
        "ai-recommendation/<str:city_name>/",
        views.ai_recommendation,
        name="ai-recommendation"
    ),

    path(
        "raster-image/<str:city_name>/<str:layer_name>/",
        views.raster_image,
        name="raster-image"
    ),

    path(
        "raster-preview/<str:city_name>/<str:layer_name>/",
        views.raster_preview,
        name="raster-preview"
    ),

]