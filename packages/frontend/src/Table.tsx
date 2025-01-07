import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ListedBuildingMinimal } from "./scripts/beSyncListedBuildingSources/listedBuildingFileTypes";

import { useQuery } from "@tanstack/react-query";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
} from "ag-grid-community";
import { getListedBuildingsMinimal } from "./scripts/beSyncListedBuildingSources/getListedBuildingFE";

ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule]);

interface TableProps {
  data: ListedBuildingMinimal[];
  onRowClick: (feature: ListedBuildingMinimal) => void;
}

export const Table = ({ data, onRowClick }: TableProps) => {
  const columnDefs: ColDef<ListedBuildingMinimal>[] = [
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
    { field: "list_entry", headerName: "List Entry", filter: true },
    {
      field: "latitude",
      headerName: "Latitude",
    },
    {
      field: "longitude",
      headerName: "Longitude",
    },
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
          const row = event.data as ListedBuildingMinimal;
          onRowClick(row);
        }}
      />
    </div>
  );
};

export const TableWrapper = ({
  onRowClick,
}: {
  onRowClick: (feature: ListedBuildingMinimal) => void;
}) => {
  const query = useQuery({
    queryKey: ["getListedBuildingMinimal"],
    queryFn: getListedBuildingsMinimal,
  });

  const listedBuildings = query.data ?? [];
  return <Table data={listedBuildings} onRowClick={onRowClick} />;
};
