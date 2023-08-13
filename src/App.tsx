import React, { ReactElement } from "react";
import { styled } from "@mui/material";
import PhotosTable from "./PhotosTable";

export default function App(): ReactElement {
  return (
    <Container>
      <PhotosTable />
    </Container>
  );
}

const Container = styled("div")({
  backgroundColor: "#292D3E",
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
