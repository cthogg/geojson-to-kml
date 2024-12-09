import { BATCH_SIZE } from "../constants";
import { generateBluePlaquesKml } from "./generateBluePlaques";

await generateBluePlaquesKml({ batchSize: BATCH_SIZE });
