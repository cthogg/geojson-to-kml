import { generateBluePlaquesKml } from "./bluePlaques/generateBluePlaques";
import { BATCH_SIZE } from "./constants";
import { generateListedBuildingsKml } from "./listedBuildings/generateListedBuildings";

await generateBluePlaquesKml({ batchSize: BATCH_SIZE });
await generateListedBuildingsKml({ batchSize: BATCH_SIZE });
