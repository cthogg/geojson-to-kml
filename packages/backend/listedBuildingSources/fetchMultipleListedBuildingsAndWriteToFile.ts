import { fetchListedBuilding } from "./fetchListedBuilding";
import { getListedBuildingFile } from "./listedBuildingFile";
import { ListedBuilding } from "./listedBuildingFileTypes";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchMultipleListedBuildings = async (
  listedBuildingNumbers: string[]
): Promise<ListedBuilding[]> => {
  const listedBuildings = await getListedBuildingFile();
  for (const [i, number] of listedBuildingNumbers.entries()) {
    console.log(
      `Fetching listed building ${i} of ${listedBuildingNumbers.length}`
    );
    const listedBuilding = listedBuildings.find(
      (listedBuilding) => listedBuilding.listEntry === number
    );
    if (listedBuilding) {
      console.log(`Listed building ${number} already exists`);
      continue;
    }
    const building = await fetchListedBuilding(number);
    listedBuildings.push(building);
    await delay(5100); // 5.1 second delay between as per historicengland.org.uk/robots.txt
  }
  return listedBuildings;
};

const writeToFile = (listedBuildings: ListedBuilding[]) => {
  Bun.write("listedBuildings.json", JSON.stringify(listedBuildings, null, 2));
};

const listedBuildingNumbers = [
  "1030163",
  "1030202",
  "1030218",
  "1030224",
  "1055809",
  "1064203",
  "1064225",
  "1064241",
  "1064250",
  "1064369",
  "1064374",
  "1064408",
  "1064414",
  "1064598",
  "1064600",
  "1064601",
  "1064604",
  "1064605",
  "1064609",
  "1064612",
  "1064616",
  "1064620",
  "1064627",
  "1064631",
  "1064632",
  "1064634",
  "1064640",
  "1064643",
  "1064646",
  "1064647",
  "1064648",
  "1064650",
  "1064657",
  "1064663",
  "1064666",
  "1064669",
  "1064671",
  "1064673",
  "1064675",
  "1064676",
  "1064683",
  "1064686",
  "1064696",
  "1064699",
  "1064713",
  "1064732",
  "1064742",
  "1064745",
  "1064976",
  "1065065",
  "1065245",
  "1065317",
  "1065318",
  "1065439",
  "1065440",
  "1065441",
  "1065442",
  "1065444",
  "1065446",
  "1065456",
  "1065672",
  "1065766",
  "1065783",
  "1065827",
  "1065833",
  "1065844",
  "1066044",
  "1066047",
  "1066048",
  "1066099",
  "1066100",
  "1066101",
  "1066102",
  "1066149",
  "1066150",
  "1066164",
  "1066166",
  "1066169",
  "1066214",
  "1066236",
  "1066237",
  "1066255",
  "1066285",
  "1066364",
  "1066370",
  "1066371",
  "1066372",
  "1066373",
  "1066375",
  "1066382",
  "1066392",
  "1066406",
  "1066455",
  "1066456",
  "1066457",
  "1066466",
  "1066487",
  "1066500",
  "1066520",
  "1066521",
  "1066622",
  "1066636",
  "1066641",
  "1066693",
  "1066753",
  "1066881",
  "1066901",
  "1066930",
  "1066947",
  "1067384",
  "1067386",
  "1067798",
  "1078270",
  "1078274",
  "1078287",
  "1078322",
  "1078323",
  "1078328",
  "1078866",
  "1078943",
  "1078956",
  "1078973",
  "1078998",
  "1079013",
  "1079041",
  "1079066",
  "1079115",
  "1079116",
  "1079121",
  "1079134",
  "1079137",
  "1079145",
  "1079146",
  "1079147",
  "1079148",
  "1079155",
  "1079157",
  "1079183",
  "1079233",
  "1079296",
  "1079297",
  "1079319",
  "1079341",
  "1079343",
  "1079350",
  "1079402",
  "1079414",
  "1079568",
  "1079569",
  "1079603",
  "1079607",
  "1079608",
  "1079610",
  "1079611",
  "1079612",
  "1079741",
  "1079742",
  "1079873",
  "1079874",
  "1079981",
  "1080003",
  "1080064",
  "1080066",
  "1080282",
  "1080308",
  "1080309",
  "1080310",
  "1080311",
  "1080318",
  "1080321",
  "1080593",
  "1080675",
  "1080783",
  "1080809",
  "1080810",
  "1080832",
  "1080836",
  "1080871",
  "1080899",
  "1080961",
  "1080970",
  "1081008",
  "1085789",
  "1086029",
  "1112991",
  "1112997",
  "1113038",
  "1113056",
  "1113116",
  "1113163",
  "1116399",
  "1130394",
  "1130404",
  "1180412",
  "1180690",
  "1180700",
  "1180873",
  "1180951",
  "1184436",
  "1188277",
  "1188441",
  "1188676",
  "1188817",
  "1188839",
  "1188846",
  "1188850",
  "1188858",
  "1188898",
  "1188978",
  "1189649",
  "1189780",
  "1190136",
  "1190187",
  "1190948",
  "1190995",
  "1191569",
  "1191603",
  "1192245",
  "1192738",
  "1192945",
  "1193127",
  "1193156",
  "1193173",
  "1193195",
  "1193413",
  "1193477",
  "1193846",
  "1193870",
  "1193901",
  "1194471",
  "1194622",
  "1195443",
  "1195533",
  "1195538",
  "1195700",
  "1208365",
  "1208827",
  "1208840",
  "1209755",
  "1209773",
  "1209780",
  "1209794",
  "1210081",
  "1210140",
  "1210759",
  "1211215",
  "1211337",
  "1211384",
  "1211426",
  "1211481",
  "1211997",
  "1211999",
  "1216787",
  "1217157",
  "1217173",
  "1217629",
  "1217661",
  "1217741",
  "1217742",
  "1218320",
  "1218401",
  "1218593",
  "1218679",
  "1218900",
  "1218925",
  "1219461",
  "1219506",
  "1219607",
  "1219626",
  "1219790",
  "1219812",
  "1220877",
  "1220888",
  "1221320",
  "1221802",
  "1222051",
  "1223553",
  "1223780",
  "1223783",
  "1223861",
  "1224993",
  "1225218",
  "1225301",
  "1225417",
  "1225450",
  "1225471",
  "1225529",
  "1225553",
  "1225611",
  "1225632",
  "1225665",
  "1225841",
  "1225842",
  "1225843",
  "1225956",
  "1225959",
  "1226023",
  "1226284",
  "1226286",
  "1226301",
  "1226477",
  "1226621",
  "1226748",
  "1226772",
  "1226811",
  "1226862",
  "1226873",
  "1227091",
  "1227092",
  "1227105",
  "1227241",
  "1227294",
  "1227295",
  "1227296",
  "1227298",
  "1227299",
  "1227300",
  "1227328",
  "1227329",
  "1227332",
  "1230913",
  "1231315",
  "1231393",
  "1231613",
  "1235288",
  "1235289",
  "1235382",
  "1235638",
  "1235826",
  "1235855",
  "1236250",
  "1236546",
  "1236580",
  "1236753",
  "1237041",
  "1237087",
  "1237099",
  "1237101",
  "1237107",
  "1237472",
  "1237938",
  "1237990",
  "1238911",
  "1238982",
  "1239086",
  "1239087",
  "1239088",
  "1239204",
  "1239205",
  "1239207",
  "1239208",
  "1239209",
  "1239210",
  "1239211",
  "1239244",
  "1239251",
  "1239383",
  "1239534",
  "1239569",
  "1239701",
  "1239703",
  "1239817",
  "1241071",
  "1242026",
  "1242062",
  "1242440",
  "1242449",
  "1242936",
  "1243786",
  "1244162",
  "1244296",
  "1244546",
  "1244548",
  "1244553",
  "1245864",
  "1246100",
  "1246103",
  "1246155",
  "1246157",
  "1246159",
  "1249756",
  "1250041",
  "1250045",
  "1250280",
  "1252877",
  "1253028",
  "1260087",
  "1260258",
  "1261987",
  "1262590",
  "1262593",
  "1262670",
  "1263073",
  "1263074",
  "1263075",
  "1264092",
  "1264252",
  "1264258",
  "1264511",
  "1264768",
  "1264769",
  "1264849",
  "1264851",
  "1264870",
  "1264877",
  "1264890",
  "1264939",
  "1264952",
  "1265031",
  "1265057",
  "1265204",
  "1265430",
  "1265450",
  "1265463",
  "1265499",
  "1265526",
  "1265622",
  "1265623",
  "1265625",
  "1265635",
  "1265658",
  "1265767",
  "1265793",
  "1265915",
  "1265947",
  "1265975",
  "1266119",
  "1266151",
  "1266293",
  "1266310",
  "1267063",
  "1267077",
  "1267114",
  "1267135",
  "1267658",
  "1271885",
  "1271918",
  "1271935",
  "1272304",
  "1272315",
  "1272341",
  "1273605",
  "1273844",
  "1273864",
  "1274511",
  "1276052",
  "1278089",
  "1278092",
  "1278223",
  "1279085",
  "1280100",
  "1281097",
  "1285320",
  "1285673",
  "1285697",
  "1285855",
  "1286024",
  "1286279",
  "1286384",
  "1286458",
  "1286469",
  "1286593",
  "1286688",
  "1286707",
  "1286903",
  "1286940",
  "1289151",
  "1289879",
  "1290044",
  "1290584",
  "1291053",
  "1291494",
  "1291892",
  "1292018",
  "1292022",
  "1293320",
  "1294306",
  "1294388",
  "1294560",
  "1294714",
  "1297993",
  "1298055",
  "1298101",
  "1299044",
  "1319925",
  "1322044",
  "1322054",
  "1322129",
  "1322154",
  "1331701",
  "1342037",
  "1356735",
  "1356971",
  "1356989",
  "1356991",
  "1357178",
  "1357234",
  "1357235",
  "1357276",
  "1357291",
  "1357311",
  "1357331",
  "1357345",
  "1357353",
  "1357354",
  "1357372",
  "1357399",
  "1357401",
  "1357402",
  "1357515",
  "1357518",
  "1357540",
  "1357626",
  "1357668",
  "1357675",
  "1357694",
  "1357713",
  "1357714",
  "1357729",
  "1357730",
  "1357749",
  "1357760",
  "1357779",
  "1357795",
  "1357808",
  "1357964",
  "1358002",
  "1358013",
  "1358066",
  "1358067",
  "1358233",
  "1358308",
  "1358321",
  "1358328",
  "1358340",
  "1358341",
  "1358343",
  "1358437",
  "1358505",
  "1358665",
  "1358666",
  "1358668",
  "1358808",
  "1358811",
  "1358861",
  "1358885",
  "1358904",
  "1358935",
  "1358953",
  "1358958",
  "1358970",
  "1358976",
  "1358993",
  "1359119",
  "1359133",
  "1359143",
  "1359173",
  "1359177",
  "1359180",
  "1359183",
  "1359191",
  "1359193",
  "1359194",
  "1359199",
  "1359200",
  "1359217",
  "1359303",
  "1359324",
  "1359397",
  "1378357",
  "1378460",
  "1378597",
  "1378648",
  "1378872",
  "1378962",
  "1379062",
  "1379069",
  "1379098",
  "1379221",
  "1379242",
  "1379280",
  "1379305",
  "1379311",
  "1379316",
  "1379317",
  "1379318",
  "1379319",
  "1379327",
  "1379333",
  "1385662",
  "1385980",
  "1393844",
  "1405493",
  "1426345",
  "1450124",
  "1451082",
];

const gradeIListedBuildingNumbers = [
  "1066285",
  "1066255",
  "1066364",
  "1066370",
  "1066371",
];
const listedBuildings = await fetchMultipleListedBuildings(
  listedBuildingNumbers.slice(24, 50)
);
writeToFile(listedBuildings);
