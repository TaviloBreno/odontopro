export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          OdontoPro - Teste Simples
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Teste de CSS</h2>
            <p className="text-gray-600 mb-4">
              Este é um teste para verificar se o Tailwind CSS está funcionando corretamente.
            </p>
            
            <div className="space-y-4">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                Botão Azul
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                Botão Verde
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">Teste de Imagens</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Imagem do Doutor:</h3>
                <img 
                  src="/doctor-hero.png" 
                  alt="Doutor" 
                  className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Logo:</h3>
                <img 
                  src="/logo-odonto.png" 
                  alt="Logo" 
                  className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Foto1:</h3>
                <img 
                  src="/foto1.png" 
                  alt="Foto 1" 
                  className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Se você está vendo cores, sombras e layout responsivo, o Tailwind está funcionando! ✅
          </p>
          <p className="text-gray-500 mt-2">
            Se você está vendo as imagens acima, elas estão sendo servidas corretamente! 🖼️
          </p>
        </div>
      </div>
    </div>
  )
}