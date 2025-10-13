# OdontoPRO - Sistema de Gestão Diferenciado por Planos

## 🚀 Dashboards Específicos por Plano

Este sistema implementa dashboards únicos para cada plano de assinatura, oferecendo experiências personalizadas baseadas no nível de serviço contratado.

## 🔐 Contas de Teste

### Plano Básico
- **Email:** `basic@teste.com`
- **Senha:** `123456`
- **Dashboard:** `/dashboard/basic`
- **Usuário:** Dr. Ana Costa

### Plano Profissional ⭐
- **Email:** `pro@teste.com`
- **Senha:** `123456`
- **Dashboard:** `/dashboard/professional`
- **Usuário:** Dr. Carlos Santos

### Plano Premium IA 🤖
- **Email:** `premium@teste.com`
- **Senha:** `123456`
- **Dashboard:** `/dashboard/premium`
- **Usuário:** Dr. Maria Silva

## 📊 Recursos por Plano

### Plano Básico
- Dashboard simples e funcional
- Estatísticas básicas (12 consultas, 48 pacientes, 3 serviços)
- Ações rápidas essenciais
- Prompt para upgrade
- Atividades recentes básicas
- Receita: R$ 2.840/mês

### Plano Profissional ⭐
- Dashboard avançado com métricas detalhadas
- Estatísticas profissionais (28 consultas, 156 pacientes, 50 serviços)
- Recursos avançados:
  - Agenda Multi-Profissional
  - Relatórios Avançados
  - Notificações SMS
  - Backup Automático
- Gráficos de performance
- Estatísticas avançadas (taxa de comparecimento, satisfação)
- Receita: R$ 18.750/mês

### Plano Premium IA 🤖
- Dashboard futurista com gradientes roxos
- IA totalmente integrada
- Estatísticas com IA:
  - 42 consultas com IA
  - 278 diagnósticos IA (98.7% precisão)
  - 156 análises radiológicas automatizadas
  - Receita otimizada: R$ 32.450/mês (+38%)

#### Ferramentas IA Exclusivas:
- 🧠 Assistente de Diagnóstico
- 📸 Análise Radiológica IA
- 💬 Chatbot IA 24/7
- 🎤 Transcrição Automática

#### Insights IA:
- Predição de receita
- Recomendações inteligentes
- Performance IA em tempo real
- Otimização automática

## 🎯 Sistema de Redirecionamento

O sistema automaticamente redireciona os usuários para seus dashboards específicos baseado no plano:

1. **Login** → Sistema detecta o plano do usuário
2. **Dashboard Principal** → Redireciona para `/dashboard/{plano}`
3. **Experiência Personalizada** → Interface única para cada nível

## 🛡️ Segurança e Autenticação

- Sistema NextAuth integrado
- Tipos TypeScript atualizados com informações do plano
- Callbacks personalizados para incluir plano na sessão
- Redirecionamento seguro baseado em autorização

## 🎨 Design Diferenciado

### Plano Básico
- Cores: Azul padrão
- Badge: "Plano Básico"
- Layout: Simples e limpo

### Plano Profissional
- Cores: Verde esmeralda
- Badge: "⭐ Profissional"
- Layout: Avançado com métricas

### Plano Premium IA
- Cores: Gradiente roxo/índigo
- Badge: "✨ Premium IA"
- Header: Gradiente especial
- Layout: Futurista com elementos IA

## 🚀 Como Testar

1. Acesse: `http://localhost:3000/auth/signin`
2. Use uma das credenciais de teste
3. Será automaticamente redirecionado para o dashboard específico
4. Explore os recursos únicos de cada plano

## 💡 Funcionalidades Especiais

### Detecção Automática
- Sistema detecta o plano do usuário logado
- Redireciona automaticamente para dashboard correto
- Previne acesso a dashboards de outros planos

### Experiências Únicas
- Cada dashboard tem métricas realistas do plano
- Widgets e funcionalidades específicas
- Prompts de upgrade contextualizados
- Atividades condizentes com o nível

### Integração com Pagamentos
- Sistema de planos integrado com checkout
- Upgrade seamless entre planos
- Histórico de pagamentos por usuário

---

*Desenvolvido com Next.js, NextAuth, TypeScript e Tailwind CSS*