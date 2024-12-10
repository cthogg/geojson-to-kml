import data from "../../../backend/kmlGeneration/input/filtered-listed-buildings.json";

// {
//     "dataset": "listed-building",
//     "end-date": "",
//     "entity": "31479762",
//     "entry-date": "2023-05-25",
//     "geometry": "",
//     "name": "CRESCENT HOUSE INCLUDING GROUND FLOOR SHOPS AND SHAKESPEARE PUBLIC HOUSE",
//     "organisation-entity": "16",
//     "point": "POINT (-0.097280 51.522372)",
//     "prefix": "listed-building",
//     "reference": "1021941",
//     "start-date": "1997-12-04",
//     "typology": "geography",
//     "documentation-url": "https://historicengland.org.uk/listing/the-list/list-entry/1021941",
//     "listed-building-grade": "II*",
//     "latitude": 51.522372,
//     "longitude": -0.09728
//   },

import { z } from "zod";

const ListedBuildingGeojsonSchema = z.object({
  "listed-building-grade": z.string(),
  reference: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type ListedBuildingGeojson = z.infer<typeof ListedBuildingGeojsonSchema>;

export const getListedBuildingGeojson = (): ListedBuildingGeojson[] => {
  const geo = z.array(ListedBuildingGeojsonSchema).parse(data);
  return geo;
};
