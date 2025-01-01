import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ListedBuilding } from "./backendSync/listedBuildingFileTypes";

import { useQuery } from "@tanstack/react-query";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
} from "ag-grid-community";
import { getListedBuildingFileBE } from "./scripts/listedBuildingSources/getListedBuildingFE";

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
      field: "image_url",
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
    { field: "list_entry", headerName: "List Entry", filter: true },
    { field: "wikidata_entry", headerName: "Wikidata Entry" },
    {
      field: "latitude",
      headerName: "Latitude",
    },
    {
      field: "longitude",
      headerName: "Longitude",
    },
    {
      field: "historical_england_text",
      headerName: "Historical England Text",
    },
    { field: "wikipedia_text", headerName: "Wikipedia Text" },
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
            latitude: row.latitude ?? 0,
            longitude: row.longitude ?? 0,
            name: row.title,
            listedEntry: row.list_entry,
            imageUrl: row.image_url ?? undefined,
            wikipediaText: row.wikipedia_text ?? undefined,
            historicalEnglandText: row.historical_england_text ?? undefined,
          });
        }}
      />
    </div>
  );
};

export const TableWrapper = ({
  onRowClick,
}: {
  onRowClick: (params: unknown) => void;
}) => {
  const query = useQuery({
    queryKey: ["getListedBuildingFileBE"],
    queryFn: getListedBuildingFileBE,
  });

  const listedBuildings = query.data ?? [];
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Table data={listedBuildings} onRowClick={onRowClick} />
    </div>
  );
};
