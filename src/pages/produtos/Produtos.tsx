import React from 'react'
import { PaginaBase } from '../../ui/layouts';
import { FerramentasDaListagem } from '../../ui/components';
import { useNavigate } from 'react-router-dom';
function Produtos() {
  
    const navigate = useNavigate();
    return (
      <PaginaBase
      titulo="Produtos"
      barraDeFerramentas={<FerramentasDaListagem  
      onClickBotaoNovo={()=> navigate('/produtos/novo')}
      />}>
      Produtos
    </PaginaBase>
    )
  
}

export default Produtos