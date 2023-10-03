import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <h1>Titulo da pagina</h1>
      <h2>Sidebar</h2>
      <Outlet />
      <h2>Footer</h2>
    </>
  );
}

export default App;
