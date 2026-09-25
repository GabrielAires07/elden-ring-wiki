import { useState, useEffect } from "react";

interface Boss {  //Essa interface avisa ao TS quais dados esperamos da API
  id: string;
  name: string;
  description: string;
  image: string | null;
  healthPoints: string;
  location: string;
  drops: string[];
}

function App() {

  const [boss, setBoss] = useState<Boss | null>(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('Malenia'); //Boss inicial padrão
  const [sugestoes, setSugestoes] = useState<Boss[]>([]); //Sugestões enquando o usuário digita
  const [modalAberto, setModalAberto] = useState(false);  

  // Galeria inicial
  const [galeriaChefes, setGaleriaChefes] = useState<Boss[]>([]);
  const [carregandoGaleria, setCarregandoGaleria] = useState(true);

  // Ao carregar a página, busca os 10 primeiros chefes para montar a galeria
  useEffect(() => {
    setCarregandoGaleria(true);
    fetch('https://eldenring.fanapis.com/api/bosses?limit=10')
      .then(res => res.json())
      .then(dados => {
        if (dados.data) {
          setGaleriaChefes(dados.data);
          // Deixa a Malenia (ou o primeiro da lista) selecionada por padrão se existir
          const chefeInicial = dados.data.find((b: Boss) => b.name.toLowerCase().includes('malenia')) || dados.data[0];
          setBoss(chefeInicial);
        }
        setCarregandoGaleria(false);
      })
      .catch(() => setCarregandoGaleria(false));
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
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center w-full backdrop-blur-sm">        
          <h1 className="text-5xl text-amber-500 mb-4 tracking-widest uppercase dropshadow-md font-['Cinzel']"> {/** tamanho - cor da letra - margin bottom - distanciamento das letras - letras maiusculas */}
            Elden Ring Wiki
          </h1>
          <p className="text-xl text-slate-400 italic mb-4"> {/** tamanho - cor - estilização */}
            De fã para fã!
          </p>

          {/** Barra de Pesquisa */}
          <form onSubmit={pesquisar} className="flex gap-2 mb-6">
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
        </div>

        {/* Card do Boss selecionado */}
        {loading ? (
          <div className="border border-amber-900/50 bg-neutral-950/80 p-12 rounded-xl text-center w-full backdrop-blur-sm">
            <p className="text-xl text-amber-600/70 italic animate-pulse">
              Buscando dados da Térvore...
            </p>
          </div>
        ) : boss ? (
          <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center w-full backdrop-blur-sm">
            <div className="flex flex-col items-center text-left">
              {boss.image ? (
                <>
                  <img 
                    src={boss.image} 
                    alt={boss.name} 
                    onClick={() => setModalAberto(true)}
                    title="Clique para ampliar"
                    className="w-full h-80 object-cover object-top rounded-md border border-neutral-700 mb-6 shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
                  />

                  {modalAberto && (
                    <div 
                      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
                      onClick={() => setModalAberto(false)}
                    >
                      <p className="text-amber-500 mb-6 font-['Cinzel'] tracking-widest uppercase text-3xl md:text-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center">
                        {boss.name}
                      </p>
                      
                      <img 
                        src={boss.image} 
                        alt={boss.name} 
                        className="max-w-[95vw] max-h-[80vh] object-contain rounded-md shadow-[0_0_30px_rgba(180,83,9,0.2)] cursor-default"
                        onClick={(e) => e.stopPropagation()} 
                      />
                      
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
                <div className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center mb-6 text-neutral-600 italic text-sm">
                  Nenhuma imagem registrada
                </div>
              )}
              
              <h2 className="text-4xl text-neutral-100 font-bold mb-2 w-full text-center font-['Cinzel']">{boss.name}</h2>
              
              <div className="flex justify-center gap-4 text-xs font-sans text-amber-500/80 mb-6 uppercase tracking-wider w-full">
                <span>HP: {boss.healthPoints || "Desconhecido"}</span>
                <span>•</span>
                <span>Local: {boss.location || "Desconhecido"}</span>
              </div>

              <p className="text-base md:text-lg text-neutral-400 text-justify leading-relaxed mb-6">
                {boss.description}
              </p>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-amber-900/30 pt-6 text-left">
                
                <div className="col-span-1 md:col-span-2 mt-2">
                  <p className="text-amber-600 font-['Cinzel'] font-bold text-xs uppercase tracking-widest mb-1">
                    Espólios (Drops)
                  </p>
                  <p className="text-neutral-300 text-sm leading-tight">
                    {boss.drops && boss.drops.length > 0 ? boss.drops.join(' • ') : "Nenhum espólio relatado"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : null}

        {/* Galeria Inicial */}
        <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] w-full backdrop-blur-sm text-center">
          <h3 className="text-xl text-amber-500 mb-6 tracking-widest uppercase font-['Cinzel'] font-bold">
            Monstros da Térvore
          </h3>

          {carregandoGaleria ? (
            <p className="text-sm text-neutral-500 italic animate-pulse py-4">Carregando manuscritos...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {galeriaChefes.map((chefe) => (
                <div 
                  key={chefe.id}
                  onClick={() => {
                    setBoss(chefe);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela suavemente para ver os detalhes
                  }}
                  className="group bg-neutral-900 border border-neutral-800 hover:border-amber-700/60 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 flex flex-col items-center"
                >
                  {chefe.image ? (
                    <img 
                      src={chefe.image} 
                      alt={chefe.name} 
                      className="w-full h-24 object-cover object-top rounded-md mb-2 filter grayscale group-hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="w-full h-24 bg-neutral-950 rounded-md mb-2 flex items-center justify-center text-xs text-neutral-600 italic">
                      Sem imagem
                    </div>
                  )}
                  <p className="text-xs text-amber-500/90 group-hover:text-amber-400 font-['Cinzel'] truncate w-full text-center">
                    {chefe.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App;