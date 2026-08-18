from django.db import models
from django.utils import timezone

class City(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class HeatAnalysis(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    average_risk = models.FloatField()
    maximum_risk = models.FloatField()
    hotspot_area = models.FloatField()
    hotspot_percentage = models.FloatField()

    # Environmental Indices
    average_ndvi = models.FloatField(default=0)
    average_ndbi = models.FloatField(default=0)
    average_ndwi = models.FloatField(default=0)
    average_lst = models.FloatField(default=0)

    analysis_date = models.DateField(auto_now_add=True)

    heat_risk_file = models.CharField(max_length=255, blank=True)
    recommendation_file = models.CharField(max_length=255, blank=True)
    risk_classification_file = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.city.name} ({self.analysis_date})"

class Recommendation(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    tree_plantation = models.FloatField()
    cool_roof = models.FloatField()
    water_body = models.FloatField()
    immediate_action = models.FloatField()

    recommendation_text = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.city.name