import React from "react";
import { useParams } from "react-router-dom";

function Cliente() {
  const { id } = useParams();
  return <div>Cliente: {id}</div>;
}

export default Cliente;
