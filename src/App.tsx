import { useState, useEffect, use } from "react";

interface Boss {  //Essa interface avisa ao TS quais dados esperamos da API
  id: string;
  name: string;
  description: string;
  image: string;
}

function App() {

  const [boss, setBoss] = useState<Boss | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://eldenring.fanapis.com/api/bosses?limit=1') //Acessamos a API e buscamos 1 boss
    .then(resposta => resposta.json()) //Transformamos a resposta da API em JSON
    .then(dados => {
      setBoss(dados.data[0]); //Criamos uma variável 'dados' para receber os dados dos bosses - Ela será nossa memória
      setLoading(false); //O loading para de carregar assim que os dados está com as informações que precisamos
    })
    .catch(erro => console.error("Erro ao carregar os dados:", erro));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center justify-center font-serif"> {/** min-h-screen(min-height) = altura minima */}
      <div className="border border-amber-900/50 bg-neutral-900/30 p-12 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center"> {/** borda - cor da borda - cor de fundo - tamanho letra - bordas arredondadas - sombra - alinhamento de texto */}
        <h1 className="text-5xl text-amber-500 mb-4 tracking-widest uppercase dropshadow-md"> {/** tamanho - cor da letra - margin bottom - distanciamento das letras - letras maiusculas */}
          Elden Ring Wiki
        </h1>
        <p className="text-xl text-slate-400 italic"> {/** tamanho - cor - estilização */}
          De fã para fã!
        </p>

        {loading ? (
          
        <p className="text-xl text-slate-400 italic animate-pulse">
          Carregando dados da Térvore...
        </p>
        ) : boss ? (
          <div className="flex flex-col items-center">
            {boss.image && (
              <img 
              src = {boss.image}
              alt = {boss.name}
              className = "w-full h-64 object-cover rounded-md border border-neutral-700 mb-4 shadow-lg"
              />
            )}
            <h2 className="text-3xl text-neutral-100 font-bold mb-3">{boss.name}</h2>
            <p className="text-sm text-neutral-400 text-justify leading-relaxed">
              {boss.description}
            </p>
          </div>
        ) : (
          <p className="text-red-900 font-bold">A fogueira se apagou. Nenhum dado encontrado!</p>
        )}
      </div>
    </div>
  )
}

export default App