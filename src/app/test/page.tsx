export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Teste de Estilização</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teste de CSS</h2>
        <p className="text-gray-600 mb-4">Se você está vendo este texto com estilização, o Tailwind está funcionando.</p>
        
        <div className="mb-6">
          <img 
            src="/doctor-hero.png" 
            alt="Teste de imagem" 
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <img 
            src="/logo-odonto.png" 
            alt="Teste logo" 
            className="w-32 h-16 object-contain"
          />
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Botão Teste
        </button>
      </div>
    </div>
  )
}