import React from 'react'
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

function Insumos() {
  const navigate = useNavigate();
  return (

    <PaginaBase
    titulo="Insumos"
    barraDeFerramentas={<FerramentasDaListagem  
    onClickBotaoNovo={()=> navigate('/insumos/novo')}
    />}>
    Insumo
  </PaginaBase>
  )
}

export default Insumos