import React from 'react'
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

function Categorias() {
  const navigate = useNavigate();
  return  ( <PaginaBase
  titulo="Categoria"
  barraDeFerramentas={<FerramentasDaListagem  
  onClickBotaoNovo={()=> navigate('/categorias/novo')}
  />}>
  Categoria
</PaginaBase>
);
}

export default Categorias;
