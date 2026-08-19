import os
from django.core.management.base import BaseCommand
from api.models import City, HeatAnalysis, Recommendation
from api.city_data import CITY_DATA

CITIES_DATA = [
    {
        "name": "Ahmedabad",
        "state": "Gujarat",
        "latitude": 23.0225,
        "longitude": 72.5714,
    },
    {
        "name": "Delhi",
        "state": "Delhi",
        "latitude": 28.6139,
        "longitude": 77.2090,
    },
    {
        "name": "Mumbai",
        "state": "Maharashtra",
        "latitude": 19.0760,
        "longitude": 72.8777,
    },
    {
        "name": "Bengaluru",
        "state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946,
    },
    {
        "name": "Hyderabad",
        "state": "Telangana",
        "latitude": 17.3850,
        "longitude": 78.4867,
    },
]


class Command(BaseCommand):
    help = "Seeds initial City records into the database idempotently."

    def handle(self, *args, **options):
        self.stdout.write("Seeding city records...")
        created_count = 0
        updated_count = 0

        for city_info in CITIES_DATA:
            city, created = City.objects.update_or_create(
                name=city_info["name"],
                defaults={
                    "state": city_info["state"],
                    "latitude": city_info["latitude"],
                    "longitude": city_info["longitude"],
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created city: {city.name}"))
            else:
                updated_count += 1
                self.stdout.write(f"Updated/Verified city: {city.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded cities. Created: {created_count}, Updated/Verified: {updated_count}"
            )
        )
