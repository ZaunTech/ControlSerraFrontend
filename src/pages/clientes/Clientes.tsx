import React from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes } from "../../ui/components";

function Clientes() {
  return (
    <PaginaBase
      titulo="Clientes"
      barraDeFerramentas={<FerramentasDeDetalhes />}
    >
      Clientes
    </PaginaBase>
  );
}

export default Clientes;
