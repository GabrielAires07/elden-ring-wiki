function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 flex flex-col items-center justify-center font-serif"> {/** min-h-screen(min-height) = altura minima */}
      <div className="border border-amber-900/50 bg-neutral-900/30 p-12 rounded-xl shadow-[0_0_30px_rgba(180,83,9,0.15)] text-center"> {/** borda - cor da borda - cor de fundo - tamanho letra - bordas arredondadas - sombra - alinhamento de texto */}
        <h1 className="text-5xl text-amber-500 mb-4 tracking-widest uppercase dropshadow-md"> {/** tamanho - cor da letra - margin bottom - distanciamento das letras - letras maiusculas */}
          Elden Ring Wiki
        </h1>
        <p className="text-xl text-slate-400 italic"> {/** tamanho - cor - estilização */}
          De fã para fã!
        </p>
      </div>
    </div>
  )
}

export default App