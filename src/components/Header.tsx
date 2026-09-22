interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}: HeaderProps) {
  return (
    <header className="border border-amber-900/50 bg-neutral-950/80 p-6 md:p-8 rounded-xl shadow-lg text-center w-full backdrop-blur-sm">
      <h1 className="text-3xl md:text-4xl text-amber-500 mb-6 tracking-widest uppercase font-bold">
        Elden Ring Wiki
      </h1>

      <div className="flex justify-center mb-6">
        <span className="px-4 py-2 rounded-md font-bold uppercase text-xs tracking-wider bg-amber-900 border border-amber-500 text-amber-100 shadow-md">
          Bosses 
        </span>
      </div>

      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Procurando Boss pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-neutral-900 border border-neutral-700 text-neutral-300 px-4 py-2 rounded-md focus:outline-none focus:border-amber-700"
        />
        <button
          type="submit"
          className="bg-amber-900 hover:bg-amber-800 text-amber-100 px-5 py-2 rounded-md font-bold text-sm uppercase"
        >
          Procurar
        </button>
      </form>
    </header>
  );
}