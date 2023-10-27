
import React from 'react'
import { FerramentasDaListagem } from '../../ui/components';
import { PaginaBase } from '../../ui/layouts';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const navigate = useNavigate(); 
  return (
  <PaginaBase
    titulo="Usuarios"
    barraDeFerramentas={<FerramentasDaListagem
      mostrarBotaoNovo={true}
      onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
    />}>

  </PaginaBase>
    
  )

}

export default Usuarios;
