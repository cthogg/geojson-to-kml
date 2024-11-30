import { BATCH_SIZE } from "../constants";
import { generateListedBuildingsKml } from "./generateListedBuildings";

await generateListedBuildingsKml({ batchSize: BATCH_SIZE });
