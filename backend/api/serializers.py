from rest_framework import serializers
from .models import City, HeatAnalysis, Recommendation


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class HeatAnalysisSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = HeatAnalysis
        fields = "__all__"


class RecommendationSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Recommendation
        fields = "__all__"