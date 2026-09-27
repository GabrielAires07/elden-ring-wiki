import { useState, useEffect } from 'react';

interface ItemAPI {
  id: string;
  name: string;
  description: string;
  image: string | null;
  healthPoints?: string; location?: string; drops?: string[];
  weight?: number; attack?: any[]; defense?: any[]; category?: string;
  affinity?: string; skill?: string;
  stats?: { [key: string]: string };
}

const ABAS = [
  { id: 'bosses', titulo: 'Chefes' },
  { id: 'classes', titulo: 'Classes' },
  { id: 'weapons', titulo: 'Armas' },
  { id: 'armors', titulo: 'Armaduras' },
  { id: 'ashes', titulo: 'Cinzas de Guerra' }
];

function App() {
  const [categoriaAtual, setCategoriaAtual] = useState('bosses');
  const [itemSelecionado, setItemSelecionado] = useState<ItemAPI | null>(null);
  
  const [busca, setBusca] = useState('');
  const [sugestoes, setSugestoes] = useState<ItemAPI[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const [galeria, setGaleria] = useState<ItemAPI[]>([]);
  const [carregandoGaleria, setCarregandoGaleria] = useState(true);

  const [modalVerMaisAberto, setModalVerMaisAberto] = useState(false);
  const [todosItens, setTodosItens] = useState<ItemAPI[]>([]);
  const [carregandoTodos, setCarregandoTodos] = useState(false);

  useEffect(() => {
    setCarregandoGaleria(true);
    setItemSelecionado(null);
    setBusca('');
    setSugestoes([]);

    fetch(`https://eldenring.fanapis.com/api/${categoriaAtual}?limit=12`)
      .then(res => res.json())
      .then(dados => {
        if (dados.data) {
          setGaleria(dados.data);
        }
        setCarregandoGaleria(false);
      })
      .catch(() => setCarregandoGaleria(false));
  }, [categoriaAtual]);

  useEffect(() => {
    if (busca.length < 2 || (itemSelecionado && itemSelecionado.name.toLowerCase() === busca.toLowerCase())) {
      setSugestoes([]);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`https://eldenring.fanapis.com/api/${categoriaAtual}?name=${busca}`)
        .then(res => res.json())
        .then(dados => {
          if (dados.data) {
            setSugestoes(dados.data.slice(0, 5));
          }
        })
        .catch(() => setSugestoes([]));
    }, 300);

    return () => clearTimeout(delay);
  }, [busca, itemSelecionado, categoriaAtual]);

  const buscarItemExato = (nome: string) => {
    setLoading(true);
    setSugestoes([]);
    setBusca('');
    
    fetch(`https://eldenring.fanapis.com/api/${categoriaAtual}?name=${nome}`)
      .then(res => res.json())
      .then(dados => {
        if (dados.data && dados.data.length > 0) {
          setItemSelecionado(dados.data[0]);
        } else {
          setItemSelecionado(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setItemSelecionado(null);
        setLoading(false);
      });
  };

  const pesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim() !== '') buscarItemExato(busca);
  };

  const abrirVerMais = () => {
    setModalVerMaisAberto(true);
    setCarregandoTodos(true);
    
    fetch(`https://eldenring.fanapis.com/api/${categoriaAtual}?limit=100`)
      .then(res => res.json())
      .then(dados => {
        if (dados.data) {
          setTodosItens(dados.data);
        }
        setCarregandoTodos(false);
      })
      .catch(() => setCarregandoTodos(false));
  };

  const renderizarAtributosDinamicos = (item: ItemAPI) => {
    switch (categoriaAtual) {
      case 'bosses':
        return (
          <>
            <div className="flex justify-center gap-4 text-xs font-sans text-amber-500/80 mb-6 uppercase tracking-wider w-full">
              <span>HP: {item.healthPoints || "???"}</span>
              <span>•</span>
              <span>Local: {item.location || "Unknown"}</span>
            </div>
            {item.drops && item.drops.length > 0 && (
              <div className="w-full border-t border-amber-900/30 pt-4 mt-6 text-left">
                <p className="text-amber-600 font-['Cinzel'] font-bold text-xs uppercase tracking-widest mb-1">Espólios (Drops)</p>
                <p className="text-neutral-300 text-sm">{item.drops.join(' • ')}</p>
              </div>
            )}
          </>
        );
      case 'classes':
        return (
          <div className="w-full border-t border-amber-900/30 pt-4 mt-6 text-left">
            <p className="text-amber-600 font-['Cinzel'] font-bold text-xs uppercase tracking-widest mb-3 text-center">Atributos Iniciais</p>
            <div className="grid grid-cols-4 gap-2 text-center text-sm font-sans">
              {item.stats && Object.entries(item.stats).map(([chave, valor]) => (
                <div key={chave} className="bg-neutral-900 border border-neutral-800 p-2 rounded">
                  <p className="text-neutral-500 text-[10px] uppercase tracking-wider">{chave}</p>
                  <p className="text-amber-500 font-bold">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'weapons':
      case 'armors':
        return (
          <div className="flex justify-center gap-4 text-xs font-sans text-amber-500/80 mb-6 uppercase tracking-wider w-full">
            <span>Category: {item.category || "Unknown"}</span>
            <span>•</span>
            <span>Weight: {item.weight || "0.0"}</span>
          </div>
        );
      case 'ashes':
        return (
          <div className="flex justify-center gap-4 text-xs font-sans text-amber-500/80 mb-6 uppercase tracking-wider w-full">
            <span>Affinity: {item.affinity || "Standard"}</span>
            <span>•</span>
            <span>Skill: {item.skill || "Unknown"}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center justify-start font-['Cormorant_Garamond'] p-4 md:p-8">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none" style={{ backgroundImage: "url('/fundo.jpg')" }} />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6">
        
        <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center w-full backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl text-amber-500 mb-4 tracking-widest uppercase drop-shadow-md font-['Cinzel'] font-bold">
            Elden Ring Wiki
          </h1>
          <p className="text-xl text-slate-400 italic mb-4"> {/** tamanho - cor - estilização */}
            De fã para fã!
            </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setCategoriaAtual(aba.id)}
                className={`px-4 py-2 rounded-md font-['Cinzel'] font-bold uppercase text-xs tracking-wider transition-all border ${
                  categoriaAtual === aba.id 
                    ? 'bg-amber-900/80 border-amber-500 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.4)]' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-amber-500 hover:border-amber-900/50'
                }`}
              >
                {aba.titulo}
              </button>
            ))}
          </div>

          <form onSubmit={pesquisar} className="relative flex gap-2">
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                placeholder={`Pesquisar em ${ABAS.find(a => a.id === categoriaAtual)?.titulo}...`}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-300 px-4 py-3 pr-10 rounded-md focus:outline-none focus:border-amber-700 transition-colors"
              />
              {busca && (
                <button type="button" onClick={() => setBusca('')} className="absolute right-3 text-neutral-500 hover:text-amber-500 font-bold transition-colors">✕</button>
              )}
              {sugestoes.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-1 bg-neutral-900 border border-amber-900/50 rounded-md shadow-2xl z-20 max-h-48 overflow-y-auto text-left">
                  {sugestoes.map((sugestao) => (
                    <li key={sugestao.id} onClick={() => buscarItemExato(sugestao.name)} className="px-4 py-3 border-b border-neutral-800 last:border-0 hover:bg-neutral-800 cursor-pointer transition-colors text-sm text-amber-500 hover:text-amber-400">
                      {sugestao.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="bg-amber-900 hover:bg-amber-800 text-amber-100 px-6 py-2 rounded-md transition-colors font-bold uppercase text-sm cursor-pointer font-['Cinzel']">
              Buscar
            </button>
          </form>
        </div>

        {/* PAINEL DE DETALHES */}
        {loading ? (
          <div className="border border-amber-900/50 bg-neutral-950/80 p-8 rounded-xl text-center w-full backdrop-blur-sm"><p className="text-xl text-amber-600/70 italic animate-pulse">Consultando os pergaminhos...</p></div>
        ) : itemSelecionado ? (
          <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center w-full backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center text-left">
              {itemSelecionado.image ? (
                <div className="w-full flex justify-center mb-6">
                  <img src={itemSelecionado.image} alt={itemSelecionado.name} onClick={() => setModalAberto(true)} className="w-48 h-48 object-cover object-top rounded-lg border-2 border-amber-900/60 shadow-lg cursor-pointer hover:scale-105 hover:border-amber-500 transition-all bg-neutral-900" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center mb-6 text-neutral-600 italic text-sm">Sem Imagem</div>
              )}
              <h2 className="text-3xl md:text-4xl text-neutral-100 font-bold mb-4 w-full text-center font-['Cinzel']">{itemSelecionado.name}</h2>
              <p className="text-base md:text-lg text-neutral-400 text-justify leading-relaxed mb-2">{itemSelecionado.description || "No description available."}</p>
              {renderizarAtributosDinamicos(itemSelecionado)}
            </div>
          </div>
        ) : null}

        {/* GALERIA INICIAL */}
        <div className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] w-full backdrop-blur-sm text-center">
          <h3 className="text-xl text-amber-500 mb-6 tracking-widest uppercase font-['Cinzel'] font-bold">
            Catálogo: {ABAS.find(a => a.id === categoriaAtual)?.titulo}
          </h3>

          {carregandoGaleria ? (
            <p className="text-sm text-neutral-500 italic animate-pulse py-4">Buscando itens na Térvore...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galeria.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => { setItemSelecionado(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group bg-neutral-900 border border-neutral-800 hover:border-amber-700/60 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 flex flex-col items-center shadow-md justify-between"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-28 object-contain object-center rounded-md mb-3 filter grayscale group-hover:grayscale-0 transition-all bg-neutral-950/50 p-2" />
                    ) : (
                      <div className="w-full h-28 bg-neutral-950 rounded-md mb-3 flex items-center justify-center text-xs text-neutral-600 italic">Sem imagem</div>
                    )}
                    <p className="text-xs text-amber-500/90 group-hover:text-amber-400 font-['Cinzel'] w-full text-center truncate px-1">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={abrirVerMais}
                className="mt-8 text-amber-700 hover:text-amber-500 font-['Cinzel'] font-bold text-sm tracking-widest uppercase transition-colors"
              >
                [ Ver acervo completo ]
              </button>
            </>
          )}
        </div>
      </div>

      {modalAberto && itemSelecionado && itemSelecionado.image && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out" onClick={() => setModalAberto(false)}>
          <p className="text-amber-500 mb-6 font-['Cinzel'] tracking-widest uppercase text-3xl md:text-4xl drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center">{itemSelecionado.name}</p>
          <img src={itemSelecionado.image} alt={itemSelecionado.name} className="max-w-[95vw] max-h-[80vh] object-contain rounded-md shadow-[0_0_30px_rgba(180,83,9,0.2)] cursor-default" onClick={(e) => e.stopPropagation()} />
          <button className="mt-8 text-neutral-400 hover:text-amber-500 font-bold uppercase tracking-widest text-sm md:text-base transition-colors font-['Cinzel'] drop-shadow-md cursor-pointer" onClick={() => setModalAberto(false)}>[ Retornar ]</button>
        </div>
      )}

      {modalVerMaisAberto && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md p-4 md:p-10 animate-fade-in">
          
          <div className="flex justify-between items-center mb-8 border-b border-amber-900/30 pb-4">
            <h2 className="text-2xl md:text-3xl text-amber-500 font-['Cinzel'] font-bold tracking-widest uppercase drop-shadow-md">
              Acervo Completo: {ABAS.find(a => a.id === categoriaAtual)?.titulo}
            </h2>
            <button 
              className="text-neutral-500 hover:text-amber-500 font-bold text-2xl transition-colors px-4"
              onClick={() => setModalVerMaisAberto(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {carregandoTodos ? (
              <p className="text-xl text-amber-600/70 italic animate-pulse text-center mt-20">Explorando as profundezas da Térvore...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
                {todosItens.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setItemSelecionado(item);
                      setModalVerMaisAberto(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-neutral-900 border border-neutral-800 hover:border-amber-700/60 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 flex flex-col items-center shadow-md justify-between"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-32 object-contain object-center rounded-md mb-3 filter grayscale group-hover:grayscale-0 transition-all bg-neutral-950/50 p-2" />
                    ) : (
                      <div className="w-full h-32 bg-neutral-950 rounded-md mb-3 flex items-center justify-center text-xs text-neutral-600 italic">Sem imagem</div>
                    )}
                    <p className="text-xs text-amber-500/90 group-hover:text-amber-400 font-['Cinzel'] w-full text-center truncate px-1">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default App;