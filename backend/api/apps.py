from django.apps import AppConfig
from django.db.models.signals import post_migrate


def auto_seed_cities(sender, **kwargs):
    try:
        from api.models import City
        cities_data = [
            {"name": "Ahmedabad", "state": "Gujarat", "latitude": 23.0225, "longitude": 72.5714},
            {"name": "Delhi", "state": "Delhi", "latitude": 28.6139, "longitude": 77.2090},
            {"name": "Mumbai", "state": "Maharashtra", "latitude": 19.0760, "longitude": 72.8777},
            {"name": "Bengaluru", "state": "Karnataka", "latitude": 12.9716, "longitude": 77.5946},
            {"name": "Hyderabad", "state": "Telangana", "latitude": 17.3850, "longitude": 78.4867},
        ]
        for city_info in cities_data:
            City.objects.update_or_create(
                name=city_info["name"],
                defaults={
                    "state": city_info["state"],
                    "latitude": city_info["latitude"],
                    "longitude": city_info["longitude"],
                },
            )
        print(f"[HeatShield AI] Auto-seeded {City.objects.count()} city records.")
    except Exception as e:
        print(f"[HeatShield AI] Auto-seed note: {e}")


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        post_migrate.connect(auto_seed_cities, sender=self)

