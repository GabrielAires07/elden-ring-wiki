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
  const [sugestoes, setSugestoes] = useState<Boss[]>([]); //Sugestões enquando o usuário digita

  // Busca inicial 
  useEffect(() => {
    buscarChefeExato('Malenia');
  }, []);

  
  useEffect(() => {
    // Se o nome for muito curto, ou for exatamente o nome do chefe atual, não busca sugestões
    if (busca.length < 2 || (boss && boss.name.toLowerCase() === busca.toLowerCase())) {
      setSugestoes([]);
      return;
    }

    //Só faz a busca se o usuário parar de digitar por 300ms
    const delay = setTimeout(() => {
      fetch(`https://eldenring.fanapis.com/api/bosses?name=${busca}`)
        .then(resposta => resposta.json())
        .then(dados => {
          if (dados.data) {
            setSugestoes(dados.data.slice(0, 5)); // 5 Sugestões no máximo
          }
        })
        .catch(() => setSugestoes([]));
    }, 300); //Tempo de ms

    
    return () => clearTimeout(delay);
  }, [busca, boss]);

  const buscarChefeExato = (nome: string) => {
    setLoading(true);
    setSugestoes([]); // Esconde as sugestões

    fetch(`https://eldenring.fanapis.com/api/bosses?name=${nome}`)
    .then(resposta => resposta.json())
    .then(dados => {
      if (dados.data && dados.data.length > 0) { //Se a API retornar os dados, pegamos o primeiro da lista. Se não, deixamos vazio
        setBoss(dados.data[0]);
        setBusca(dados.data[0].name); //Corrige o texto para o nome certo
      } else {
        setBoss(null);
      }
      setLoading(false);
    })
    .catch(() => {
      setBoss(null);
      setLoading(false);
    });
  };

  const pesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim() !== '') {
      buscarChefeExato(busca);
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
        <form onSubmit={pesquisar} className="relative flex gap-2 mb-6">
          <div className="flex-1 relative flex items-center">
            <input 
              type="text" 
              placeholder="Nome do chefe (ex: Radahn, Godrick...)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={(e) => e.target.select()} /*Seleciona o texto ao clicar*/
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-md focus:outline-none focus:border-amber-700 transition-colors"
            />

            {busca && (
              <button
              type="button"
              onClick={() => setBusca('')}
              className="absolute right-3 text-neutral-500 hover:text-amber-500 font-bold transition-colors"
              title="Limpar Busca"            
              >
                ✕
              </button>
            )}
            
            {/* Lista de Sugestões */}
            {sugestoes.length > 0 && (
              <ul className="absolute top-full left-0 w-full mt-1 bg-neutral-950 border border-amber-900/50 rounded-md shadow-2xl z-10 max-h-48 overflow-y-auto text-left">
                {sugestoes.map((sugestao) => (
                  <li 
                    key={sugestao.id}
                    onClick={() => buscarChefeExato(sugestao.name)}
                    className="px-4 py-3 border-b border-neutral-800 last:border-0 hover:bg-neutral-800 cursor-pointer transition-colors text-sm text-neutral-300"
                  >
                    {sugestao.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button 
            type="submit" 
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