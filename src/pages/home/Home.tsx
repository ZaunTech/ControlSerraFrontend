import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";

function Home() {
  return (
    <PaginaBase
      titulo="Home"
      barraDeFerramentas={
        <FerramentasDaListagem mostrarInputBusca mostrarBotaoNovo />
      }
    >
      Home
    </PaginaBase>
  );
}

export default Home;
