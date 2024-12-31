import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ListedBuilding } from "./backendSync/listedBuildingFileTypes";
import { getListedBuildingFileFE } from "./scripts/listedBuildingSources/getListedBuildingFE";

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule]);

interface TableProps {
  data: ListedBuilding[];
  onRowClick: ({
    latitude,
    longitude,
    name,
    listedEntry,
    imageUrl,
    wikipediaText,
    historicalEnglandText,
  }: {
    latitude: number;
    longitude: number;
    name: string;
    listedEntry: string;
    imageUrl?: string;
    wikipediaText?: string;
    historicalEnglandText?: string;
  }) => void;
}

export const Table = ({ data, onRowClick }: TableProps) => {
  const columnDefs: ColDef<ListedBuilding>[] = [
    {
      field: "title",
      headerName: "Title",
      filter: true,
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
    { field: "type", headerName: "Type" },
    { field: "grade", headerName: "Grade" },
    { field: "listEntry", headerName: "List Entry", filter: true },
    { field: "wikidataEntry", headerName: "Wikidata Entry" },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueFormatter: (params) =>
        params.value ? `${params.value[0]}, ${params.value[1]}` : "-",
    },
    {
      field: "historicalEnglandText",
      headerName: "Historical England Text",
    },
    { field: "wikipediaText", headerName: "Wikipedia Text" },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data}
        pagination={true}
        paginationPageSize={20}
        rowHeight={170}
        onRowClicked={(event) => {
          const row = event.data as ListedBuilding;
          onRowClick({
            latitude: row.coordinates?.[0] ?? 0,
            longitude: row.coordinates?.[1] ?? 0,
            name: row.title,
            listedEntry: row.listEntry,
            imageUrl: row.imageUrl ?? undefined,
            wikipediaText: row.wikipediaText ?? undefined,
            historicalEnglandText: row.historicalEnglandText ?? undefined,
          });
        }}
      />
    </div>
  );
};

export const TableWrapper = ({
  onRowClick,
}: {
  onRowClick: (params: any) => void;
}) => {
  const listedBuildings = getListedBuildingFileFE();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Table data={listedBuildings} onRowClick={onRowClick} />
    </div>
  );
};
