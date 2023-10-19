import React from 'react'
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

function Insumo() {
  const navigate = useNavigate();
  return (

    <PaginaBase
    titulo="Insumos"
    barraDeFerramentas={<FerramentasDaListagem  
    onClickBotaoNovo={()=> navigate('/insumos/novo')}
    />}>
    Insumos
  </PaginaBase>
  )
  
}

export default Insumo