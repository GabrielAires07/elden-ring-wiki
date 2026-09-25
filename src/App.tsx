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
  const [modalAberto, setModalAberto] = useState(false);  

  // Boss inicial 
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
    <div className="relative min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center justify-center font-['Cormorant_Garamond'] p-4">
    
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/fundo.png')" }}
      />

      <div className="relative z-10 border border-amber-900/50 bg-neutral-950/70 p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center max-w-lg w-full backdrop-blur-sm"> 
        <h1 className="text-5xl text-amber-500 mb-4 tracking-widest uppercase dropshadow-md font-['Cinzel']"> {/** tamanho - cor da letra - margin bottom - distanciamento das letras - letras maiusculas */}
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
              className="w-full bg-neutral-950 border border-neutral-700 text-neutral-300 px-4 py-2 pr-10 rounded-md focus:outline-none focus:border-amber-700 transition-colors"
            />

            {busca && (
              <button
              type="button"
              onClick={() => setBusca('')}
              className="absolute right-3 text-neutral-500 hover:text-amber-500 font-['Cinzel'] font-bold transition-colors"
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
                    className="px-4 py-3 border-b border-neutral-800 last:border-0 hover:bg-neutral-800 cursor-pointer transition-colors text-sm text-amber-500 hover:text-amber-400"
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
            Buscando dados da Térvore...
          </p>
        ) : boss ? (
          <div className="flex flex-col items-center text-left">
            {boss.image ? (
              <>
                {/* Imagem padrão do card (Agora clicável) */}
                <img 
                  src={boss.image} 
                  alt={boss.name} 
                  onClick={() => setModalAberto(true)}
                  title="Clique para ampliar"
                  className="w-full h-64 object-cover object-top rounded-md border border-neutral-700 mb-4 shadow-lg cursor-pointer hover:opacity-80 transition-opacity" 
                />

                {/* O modal com a imagem expandida */}
                {modalAberto && (
                  <div 
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
                    onClick={() => setModalAberto(false)}
                  >
                    {/* Nome do boss acima da Imagem */}
                    <p className="text-amber-500 mb-6 font-['Cinzel'] tracking-widest uppercase text-3xl md:text-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center">
                      {boss.name}
                    </p>
                    
                    {/* Imagem cbre até 95% da largura e 80% da altura da tela */}
                    <img 
                      src={boss.image} 
                      alt={boss.name} 
                      className="max-w-[95vw] max-h-[80vh] object-contain rounded-md shadow-[0_0_30px_rgba(180,83,9,0.2)] cursor-default"
                      onClick={(e) => e.stopPropagation()} 
                    />
                    
                    {/* Botão pra fechar o modal */}
                    <button 
                      className="mt-8 text-neutral-400 hover:text-amber-500 font-bold uppercase tracking-widest text-sm md:text-base transition-colors font-['Cinzel'] drop-shadow-md"
                      onClick={() => setModalAberto(false)}
                    >
                      [ Retornar ]
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center mb-4 text-neutral-600 italic text-sm">
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