import { generateBluePlaquesKml } from "./bluePlaques/generateBluePlaques";
import { generateListedBuildingsKml } from "./generateListedBuildings";

await generateBluePlaquesKml();
await generateListedBuildingsKml();
