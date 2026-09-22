import { useState } from 'react';
import Header from './components/Header';

export default function App() {
  const [currentTab, setCurrentTab] = useState('bosses');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisando por:', searchTerm, 'na aba:', currentTab);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
        />
        
        <div className="text-neutral-500 text-sm italic">
          Carregando dados da aba: {currentTab}...
        </div>
      </div>
    </div>
  );
}