import { generateBluePlaquesKml } from "./bluePlaques/generateBluePlaques";
import { generateListedBuildingsKml } from "./listedBuildings/generateListedBuildings";

await generateBluePlaquesKml();
await generateListedBuildingsKml();
