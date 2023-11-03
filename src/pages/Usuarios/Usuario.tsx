
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
    
    handleSubmit,
    formState: { },
  } = useForm({
    resolver: zodResolver(shemaUsuario),
  });

function criarUsuario(data: any){
    console.log(data)
}
    
  return (
    <PaginaBase
    titulo="Insumos"
    barraDeFerramentas={<FerramentasDeDetalhes
      mostrarBotaoApagar={false}
      onClickSalvar={handleSubmit(criarUsuario)} tipo={'novo'}      
    />}>

      
        
    </PaginaBase>
  )
}

export default Usuario