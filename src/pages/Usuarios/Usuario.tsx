import React from 'react'
import { PaginaBase } from '../../ui/layouts'

function Usuario() {

    
  return (
    <PaginaBase
      titulo={`Lista de insumos do produto ${produtoName}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          mostrarBotaoVoltar
        />
      }
    >
        
    </PaginaBase>
  )
}

export default Usuario