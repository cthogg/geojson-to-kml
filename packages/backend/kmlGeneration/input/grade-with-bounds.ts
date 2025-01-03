import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface ListedBuilding {
  reference: string;
  latitude: number;
  longitude: number;
  "listed-building-grade": string;
  // ... other properties
}

// Define bounding box coordinates
const BOUNDS = {
  minLon: -0.14986,
  maxLon: -0.11776,
  minLat: 51.513808,
  maxLat: 51.526821,
};

const isInBounds = (building: ListedBuilding): boolean => {
  return (
    building.longitude >= BOUNDS.minLon &&
    building.longitude <= BOUNDS.maxLon &&
    building.latitude >= BOUNDS.minLat &&
    building.latitude <= BOUNDS.maxLat
  );
};

const main = () => {
  // Read input file
  const inputPath = join(
    import.meta.dir,
    "../input/filtered-listed-buildings.json"
  );
  const buildings = JSON.parse(
    readFileSync(inputPath, "utf-8")
  ) as ListedBuilding[];

  // Create grade maps
  const gradeI = new Set<string>();
  const gradeII = new Set<string>();
  const gradeIIStar = new Set<string>();

  // Filter buildings by grade and location
  buildings.forEach((building) => {
    if (!isInBounds(building)) return;

    const grade = building["listed-building-grade"];
    const ref = building.reference;

    switch (grade) {
      case "I":
        gradeI.add(ref);
        break;
      case "II":
        gradeII.add(ref);
        break;
      case "II*":
        gradeIIStar.add(ref);
        break;
      default:
        console.warn(`Unknown grade: ${grade} for building ${ref}`);
    }
  });

  // Write output files
  const outputDir = join(import.meta.dir, "../output");

  writeFileSync(
    join(outputDir, "bounds-grade-I.json"),
    JSON.stringify([...gradeI], null, 2)
  );

  writeFileSync(
    join(outputDir, "bounds-grade-II.json"),
    JSON.stringify([...gradeII], null, 2)
  );

  writeFileSync(
    join(outputDir, "bounds-grade-II-star.json"),
    JSON.stringify([...gradeIIStar], null, 2)
  );

  // Log results
  console.log(`Found within bounds:
  Grade I: ${gradeI.size} buildings
  Grade II: ${gradeII.size} buildings
  Grade II*: ${gradeIIStar.size} buildings`);
};

main();
