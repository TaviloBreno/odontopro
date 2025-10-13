export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          OdontoPro - Diagnóstico
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1rem' }}>
            Teste 1: CSS Inline (deve funcionar)
          </h2>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#dbeafe', 
            border: '2px solid #3b82f6',
            borderRadius: '4px'
          }}>
            ✅ Se você está vendo esta caixa azul com bordas, o CSS inline está funcionando.
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1rem' }}>
            Teste 2: Classes Tailwind
          </h2>
          <div className="p-4 bg-green-100 border-2 border-green-500 rounded">
            ✅ Se você está vendo esta caixa verde, o Tailwind CSS está funcionando.
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#374151', marginBottom: '1rem' }}>
            Teste 3: Imagens da pasta public
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Doctor Hero:</h3>
              <img 
                src="/doctor-hero.png" 
                alt="Doctor Hero" 
                style={{ 
                  width: '100%', 
                  maxWidth: '150px', 
                  height: 'auto',
                  border: '2px solid #e5e7eb',
                  borderRadius: '4px'
                }}
                onLoad={() => console.log('✅ doctor-hero.png carregou')}
                onError={() => console.log('❌ Erro ao carregar doctor-hero.png')}
              />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Logo:</h3>
              <img 
                src="/logo-odonto.png" 
                alt="Logo" 
                style={{ 
                  width: '100%', 
                  maxWidth: '150px', 
                  height: 'auto',
                  border: '2px solid #e5e7eb',
                  borderRadius: '4px'
                }}
                onLoad={() => console.log('✅ logo-odonto.png carregou')}
                onError={() => console.log('❌ Erro ao carregar logo-odonto.png')}
              />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Foto1:</h3>
              <img 
                src="/foto1.png" 
                alt="Foto 1" 
                style={{ 
                  width: '100%', 
                  maxWidth: '150px', 
                  height: 'auto',
                  border: '2px solid #e5e7eb',
                  borderRadius: '4px'
                }}
                onLoad={() => console.log('✅ foto1.png carregou')}
                onError={() => console.log('❌ Erro ao carregar foto1.png')}
              />
            </div>
          </div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p><strong>Instruções:</strong></p>
          <p>1. Abra o console do navegador (F12)</p>
          <p>2. Verifique se há mensagens de carregamento das imagens</p>
          <p>3. Se as imagens não aparecerem, verifique se os arquivos existem na pasta public/</p>
        </div>
      </div>
    </div>
  )
}