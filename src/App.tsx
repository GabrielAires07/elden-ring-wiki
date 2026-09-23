import { useState, useEffect } from 'react'; // useState = memoria, useEffect = executar efeitos colaterais 
import Header from './components/Header';

interface Boss {
  id: string;
  name: string;
  image: string | null;
  location?: string; // O sinal de "?" torna essa solicitação opcional
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar os bosses na API assim que o site for aberto
  useEffect(() => {
    fetch('https://eldenring.fanapis.com/api/bosses?limit=12') // Buscaar dados da API
      .then((respostaAPI) => respostaAPI.json()) // Transforma os dados da API em JSON, para o JS entender
      .then((dados) => {
        if (dados.data) {
          setBosses(dados.data); // Acessa a gaveta 'data' dentro dos nossos dados
        }
        setLoading(false);
      })
      .catch((erro) => {
        console.error('Erro ao buscar bosses:', erro);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisando boss:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Seção da Galeria de Bosses */}
        <div className="w-full bg-neutral-950/80 border border-amber-900/50 p-6 rounded-xl shadow-lg text-center backdrop-blur-sm">
          <h2 className="text-xl text-amber-500 mb-6 tracking-widest uppercase font-bold">
            Bosses List
          </h2>

          {loading ? (
            <p className="text-neutral-500 italic py-8 animate-pulse">Carregando os chefes da Térvore...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bosses.map((boss) => (
                <div
                  key={boss.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-amber-700/60 rounded-lg p-3 flex flex-col items-center shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  {boss.image ? (
                    <img
                      src={boss.image}
                      alt={boss.name}
                      className="w-full h-28 object-contain rounded-md mb-3 bg-neutral-950 p-1"
                    />
                  ) : (
                    <div className="w-full h-28 bg-neutral-950 rounded-md mb-3 flex items-center justify-center text-xs text-neutral-600 italic">
                      Sem imagem
                    </div>
                  )}
                  <p className="text-xs text-amber-500 font-bold truncate w-full text-px">
                    {boss.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}