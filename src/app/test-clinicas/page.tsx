import { getProfessionals } from "../(public)/_data-access/get-professionals";
import Link from "next/link"

export default async function HomePage() {
  const professionals = await getProfessionals();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          OdontoPro - Clínicas Disponíveis
        </h1>
        
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Informações de Debug</h2>
          <p className="text-blue-700">Total de clínicas encontradas: <strong>{professionals.length}</strong></p>
          <p className="text-sm text-blue-600 mt-2">
            Confira o console do navegador (F12) para mais detalhes
          </p>
        </div>

        {professionals.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                ⚠️ Nenhuma clínica encontrada
              </h3>
              <p className="text-yellow-700">
                Não há clínicas cadastradas no momento ou houve um problema na conexão com o banco de dados.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <img 
                    src={clinic.image || "/foto1.png"} 
                    alt={`Foto da clínica ${clinic.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {clinic.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {clinic.address || "Endereço não informado"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {clinic.phone || "Telefone não informado"}
                      </p>
                    </div>
                    
                    {clinic.subscription?.plan === "PROFESSIONAL" && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                        PRO
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/clinica/${clinic.id}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Agendar Consulta
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center text-gray-500">
          <p>💡 Esta é uma versão de debug para verificar se os dados estão sendo carregados corretamente</p>
        </div>
      </div>
    </div>
  )
}