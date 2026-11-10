import { list } from "../api/PruebaApi.js";

export function ListarCharlasButton() {
  async function listarCharlas() {
    console.log("Listar charlas");
    const charlas = await list();
    console.log("Charlas listadas");
    console.log(charlas);
  }
  return (
    <>
      <button onClick={listarCharlas}>Listar Charlas</button>
    </>
  );
}
