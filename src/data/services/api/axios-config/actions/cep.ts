import axios from 'axios'



const getCepData = async ( data : string): Promise<IViacepResponse> => {

 const response =  await axios.get(`https://viacep.com.br/ws/${data}/json/`);
 return response.data;
}

export default getCepData;