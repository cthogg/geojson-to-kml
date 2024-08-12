console.log("Hello via Bun!");

// Get the whole blue plaques file
// Get what data I need to have it on (i.e. the KML).
// convert the geojson to KML using probably https://gdal.org/programs/ogr2ogr.html
// and https://bun.sh/guides/runtime/shell

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-0.29049, 51.48904],
        is_accurate: true,
      },
      properties: {
        id: "9850",
        inscription:
          "Kew Bridge Pumping Station Unique in its approach to the preservation of water pumping equipment, in particular the original installations of five famous Cornish beam engines.",
        title: "Kew Bridge Pumping Station grey plaque",
        uri: "https://openplaques.org/plaques/9850",
        type: "open-plaque",
      },
    },
  ],
};
