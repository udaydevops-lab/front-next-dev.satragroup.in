"use client";
import * as React from "react";
import DataGridComponent, { RowData } from "./DataGridComponent";

const rows: RowData[] = [
  // Data rows...
  { id: 1, name: "Vagram", age: "Willstrop", city: "Colombia", gender: "Male" },
  { id: 2, name: "Bamity", age: "Gowdy", city: "Indonesia", gender: "Female" },
  {
    id: 3,
    name: "Greenlam",
    age: "Razzell",
    city: "Afghanistan",
    gender: "Male",
  },
  { id: 4, name: "Redhold", age: "Levi", city: "China", gender: "Female" },
  { id: 5, name: "Cardify", age: "Vasic", city: "Lebanon", gender: "Female" },
  {
    id: 6,
    name: "Zathin",
    age: "De Beneditti",
    city: "Sweden",
    gender: "Male",
  },
];

const DataGrid: React.FC = () => {
  const handleDelete = (id: number) => {
    // Handle delete logic here
  };

  const handleEdit = (id: number) => {
    // Handle edit logic here
  };

  return (
    <div>
      <h1>Data Table Example</h1>
      <DataGridComponent
        data={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DataGrid;
