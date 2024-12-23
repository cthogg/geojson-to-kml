import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ListedBuilding } from "./backendSync/listedBuildingFileTypes";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const Table = ({ data }: { data: ListedBuilding[] }) => {
  const columnDefs: ColDef<ListedBuilding>[] = [
    {
      field: "title",
      headerName: "Title",
      filter: true,
      filterParams: {},
    },
    {
      field: "imageUrl",
      headerName: "Image",
      /*eslint-disable-next-line*/
      cellRenderer: (params: any) =>
        params.value ? (
          <img
            src={params.value}
            alt="Building"
            style={{ width: "150px", height: "150px" }}
          />
        ) : null,
    },
    { field: "type", headerName: "Type", sortable: true, filter: true },
    { field: "grade", headerName: "Grade", sortable: true, filter: true },
    { field: "listEntry", headerName: "List Entry", sortable: true },
    { field: "wikidataEntry", headerName: "Wikidata Entry", sortable: true },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueFormatter: (params) =>
        params.value ? `${params.value[0]}, ${params.value[1]}` : "-",
    },
    {
      field: "historicalEnglandText",
      headerName: "Historical England Text",
      sortable: true,
    },
    { field: "wikipediaText", headerName: "Wikipedia Text", sortable: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        pagination={true}
        paginationPageSize={20}
        rowHeight={170}
      />
    </div>
  );
};

export const TableWrapper = () => {
  const listedBuildings = getListedBuildingFileFE();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Table data={listedBuildings} />
    </div>
  );
};
