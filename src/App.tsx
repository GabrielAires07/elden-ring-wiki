import { useState, useEffect } from "react";

interface Boss {  //Essa interface avisa ao TS quais dados esperamos da API
  id: string;
  name: string;
  description: string;
  image: string | null;
  healthPoints: string;
  region: string;
}

function App() {

  const [boss, setBoss] = useState<Boss | null>(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('Malenia'); //Boss inicial padrão

  //Função pra buscar o Boss pelo nome
  const buscarBoss = (nome: string) => {
    setLoading(true);
    fetch(`https://eldenring.fanapis.com/api/bosses?name=${nome}`)
    .then(resposta => resposta.json())
    .then(dados => {
      if (dados.data && dados.data.length > 0) { //Se a API retornar os dados, pegamos o primeiro da lista. Se não, deixamos vazio
        setBoss(dados.data[0]);
      } else {
        setBoss(null);
      }
      setLoading(false);
    })
    .catch(erro => {
      console.error("Erro ao carregar dados:", erro);
      setLoading(false);
    });
  };

  //Deixando a Malenia como primeiro boss assim que a tela abre
  useEffect(() => {
    buscarBoss('Malenia');
  }, []);

  //O que acontece assim que clicar no botão de pesquisar
  const pesquisar = (e: React.FormEvent) => {
    e.preventDefault(); //Impedindo a página de recarregar
    if (busca.trim() !== '') {
      buscarBoss(busca);
    }
  };

 
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center justify-center font-serif"> {/** min-h-screen(min-height) = altura minima */}
      <div className="border border-amber-900/50 bg-neutral-900/30 p-12 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center"> {/** borda - cor da borda - cor de fundo - tamanho letra - bordas arredondadas - sombra - alinhamento de texto */}
        <h1 className="text-5xl text-amber-500 mb-4 tracking-widest uppercase dropshadow-md"> {/** tamanho - cor da letra - margin bottom - distanciamento das letras - letras maiusculas */}
          Elden Ring Wiki
        </h1>
        <p className="text-xl text-slate-400 italic mb-4"> {/** tamanho - cor - estilização */}
          De fã para fã!
        </p>

        {/** Barra de Pesquisa */}
        <form onSubmit={pesquisar} className="flex gap-2 mb-6">
          <input 
          type = "text"
          placeholder = "Nome do Boss (ex: Radahn, Godrick, ...)"
          value = {busca}
          onChange = {(e) => setBusca(e.target.value)}
          className = "flex-1 bg-neutral-950 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-md focus:outline-none focus:border-amber-700 transition-colors" 
          />
          <button
          type = "submit"
          className="bg-amber-900 hover:bg-amber-800 text-amber-100 px-4 py-2 rounded-md transition-colors font-bold uppercase text-sm cursor-pointer"
          >
          Buscar  
          </button>
        </form>

        {/* Resultado da Pesquisa */}
        {loading ? (
          <p className="text-xl text-amber-600/70 italic animate-pulse py-10">
            Buscando nos arquivos da Térvore...
          </p>
        ) : boss ? (
          <div className="flex flex-col items-center animate-fade-in text-left">
            {/* Caso não tenha a imagem do Boss nos dados da API */}
            {boss.image ? (
              <img 
                src={boss.image} 
                alt={boss.name} 
                className="w-full h-64 object-cover object-top rounded-md border border-neutral-700 mb-4 shadow-lg" 
              />
            ) : (
              <div className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-md flex items-center justify-center mb-4 text-neutral-600 italic text-sm">
                Nenhuma imagem registrada.
              </div>
            )}
            
            <h2 className="text-3xl text-neutral-100 font-bold mb-1 w-full text-center">{boss.name}</h2>
            
            <div className="flex justify-center gap-4 text-xs font-sans text-amber-500/80 mb-4 uppercase tracking-wider w-full">
              <span>HP: {boss.healthPoints || "Desconhecido"}</span>
              <span>•</span>
              <span>Região: {boss.region || "Desconhecida"}</span>
            </div>

            <p className="text-sm text-neutral-400 text-justify leading-relaxed">
              {boss.description}
            </p>
          </div>
        ) : (
          <p className="text-red-900/80 font-bold py-10">Nenhum inimigo encontrado com este nome.</p>
        )}
      </div>
    </div>
  )
}

export default App;