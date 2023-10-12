import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import { useSearchParams } from "react-router-dom";
import { ClientesService } from "../../data/services/api";
import { useDebounce } from "../../data/hooks";

function Clientes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  useEffect(() => {
    debounce(() => {
      ClientesService.getAll(1, busca).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        console.log(result);
      });
    });
  }, [busca]);

  return (
    <PaginaBase
      titulo="Clientes"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto }, { replace: true })
          }
        />
      }
    >
      Clientes
    </PaginaBase>
  );
}

export default Clientes;
