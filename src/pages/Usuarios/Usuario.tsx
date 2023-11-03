import React from 'react'
import { PaginaBase } from '../../ui/layouts'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { FerramentasDeDetalhes } from '../../ui/components';

const shemaUsuario = z.object({
  email: z.string().min(1,"Preencha o email"),
  senha: z.string().min(6,"Digite pelo menos 6 caracteres"),
});


export const Usuario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shemaUsuario),
  });

function criarUsuario(data: any){
    

}
    
  return (
    <PaginaBase
    titulo="Insumos"
    barraDeFerramentas={<FerramentasDeDetalhes
      mostrarBotaoApagar={false}
      onClickSalvar={handleSubmit(criarUsuario)}
      
    />}>

      
        
    </PaginaBase>
  )
}

export default Usuario