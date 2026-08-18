import rasterio
import numpy as np


def read_raster_statistics(file_path):

    with rasterio.open(file_path) as src:

        band = src.read(1).astype(np.float32)

        nodata = src.nodata

        # Remove NoData pixels
        if nodata is not None:
            band = band[band != nodata]

        # Remove NaN values
        band = band[~np.isnan(band)]

        # Remove infinite values
        band = band[np.isfinite(band)]

        if band.size == 0:
            return {
                "width": src.width,
                "height": src.height,
                "crs": str(src.crs),
                "min": None,
                "max": None,
                "mean": None,
            }

        return {
            "width": src.width,
            "height": src.height,
            "crs": str(src.crs),
            "min": float(np.min(band)),
            "max": float(np.max(band)),
            "mean": float(np.mean(band)),
        }