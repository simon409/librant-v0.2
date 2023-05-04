import React from "react";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
