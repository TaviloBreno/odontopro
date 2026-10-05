// Teste simples do sistema de autenticação
'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [status, setStatus] = useState('Iniciando teste...');
  const [step, setStep] = useState(0);

  useEffect(() => {
    testAuth();
  }, []);

  const testAuth = async () => {
    try {
      setStep(1);
      setStatus('🔑 Testando login automático...');
      
      // Tentar fazer login
      const result = await signIn('credentials', {
        email: 'dr.joao@teste.com',
        password: '123456',
        redirect: false
      });

      setStep(2);
      if (result?.ok) {
        setStatus('✅ Login realizado com sucesso!');
        setStep(3);
        setStatus('🎉 Redirecionando para dashboard...');
        
        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setStatus('❌ Erro no login: ' + (result?.error || 'Credenciais inválidas'));
      }
    } catch (error) {
      setStatus('❌ Erro durante teste: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Teste de Autenticação
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-700 mb-2">Status:</div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {status}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Progresso:</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Etapa {step} de 3
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Credenciais de teste:</strong><br />
            Email: dr.joao@teste.com<br />
            Senha: 123456
          </div>
        </div>
      </div>
    </div>
  );
}