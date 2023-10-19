import axios from 'axios'


export async function getCep( data : any){
 return axios.get(`https://viacep.com.br/ws/${data}/json/`).catch(e => console.log(e));
}