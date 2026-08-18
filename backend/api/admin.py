from django.contrib import admin

from .models import City
from .models import HeatAnalysis
from .models import Recommendation


admin.site.register(City)
admin.site.register(HeatAnalysis)
admin.site.register(Recommendation)