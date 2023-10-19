import React from 'react'
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

function Fornecedores() {
  const navigate = useNavigate();
  return (
    <PaginaBase
    titulo="Fornecedores"
    barraDeFerramentas={<FerramentasDaListagem  
    onClickBotaoNovo={()=> navigate('/fornecedores/novo')}
    />}>
    Fornecedor
  </PaginaBase>
  )
}

export default Fornecedores