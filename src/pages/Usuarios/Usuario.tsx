import React, { useEffect, useState } from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes, TTipo } from '../../ui/components'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IUsuario, UsuariosService } from '../../data/services/api/modules/usuario'


const shemaUsuario = z.object({
    email: z.string().min(1,"Preencha o email"),
    senha: z.string().min(6,"Digite pelo menos 6 caracteres"),
    tipoUsuario: z.string(),
    nome: z.string().min(1,"Digite seu nome"),
    cpf:z.string(),
    telefone: z.string(),
   
  });

export const Usuario = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(shemaUsuario),
      });
      const [tipo, setTipo] = React.useState("Serralheiro");

      const handleChange = (event: SelectChangeEvent) => {
        setTipo(event.target.value as string);
      };
    
    
    const [pageState, setPageState] = useState<TTipo>("detalhes");
    const [isEditable, setIsEditable] = useState<boolean>(false);
  
    useEffect(() => {
      if (pageState === "detalhes") {
        setIsEditable(false);
        return;
      }
      if (pageState === "editar" || pageState === "novo") {
        setIsEditable(true);
        return;
      }
    }, [pageState]);
    const {id} = useParams();
    const fetchData = async () => {
      try {
        const data: IUsuario | Error = await UsuariosService.getById(Number(id));
        if (data instanceof Error) {
          return;
        }
        setValue("nome", data.nome);
        setValue("email", data.email);
        setValue("senha", data.senha);
        setValue("cpf", data.cpf);
        setValue("telefone", data.telefone);
        setTipo(data.tipoUsuario.toString());
      
      } catch (error) {}
    };

    const navigate = useNavigate();
    function salvarUsuario(data: any){
      UsuariosService.updateById(Number(id),data).then((result)=>{
        setIsEditable(false);
        setPageState("detalhes")
      }).catch((error)=>{
        console.log(error)
      })
    }

    function salvarUsuarioFechar(data: any){
      console.log("Salvar")
      UsuariosService.updateById(Number(id),data).then((result)=>{
        navigate(-1);
      }).catch((error)=>{
        console.log(error)
      })
    }

    useEffect(()=>{
      fetchData()
    },[])

  return (
    <PaginaBase
      titulo="Editar Usuario"
      barraDeFerramentas={<FerramentasDeDetalhes
        tipo="detalhes"
        pageState={pageState}
        setPaiState={setPageState}
        onClickSalvar={ handleSubmit(salvarUsuario)}
        onClickSalvarEFechar={handleSubmit(salvarUsuarioFechar)}
        onClickCancelar={fetchData}
        
      />}>


    <Box component={"form"}  onSubmit={handleSubmit(salvarUsuario)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined"
        > 
        <Grid container direction="column" padding={2} spacing={3}>
          <Grid container item direction="column" spacing={4}>
             <Grid item>
              <InputLabel id="tipo">Tipo</InputLabel>
                  <Select
                    labelId="tipoUsuario"
                    id="tipoUsuario"
                    disabled={!isEditable}
                    value={tipo}
                    {...register("tipoUsuario")}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Serralheiro"}>Serralheiro</MenuItem>
                    <MenuItem value={"Administrador"}>Administrador</MenuItem>
                    <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
                  </Select>

                {errors.contaTipo && <span>{errors.contaTipo.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <Typography>Nome</Typography>
                <TextField disabled={!isEditable}  {...register("nome")}   />
              </Grid>
              <Grid item>
                <Typography>Email</Typography>
                <TextField type='email'disabled={!isEditable}  {...register("email")}   />
              </Grid>
              <Grid item>
                <Typography>Senha</Typography>
                <TextField type='password'disabled={!isEditable} {...register("senha")} />
              </Grid>
              <Grid item>
                <Typography>CPF</Typography>
                <TextField  disabled={!isEditable} {...register("cpf")}   />
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <TextField  disabled={!isEditable} {...register("telefone")}   />
              </Grid>
            </Grid>
        </Grid>      
        
        
        </Box>
    </Box>

  </PaginaBase>
  )
}
