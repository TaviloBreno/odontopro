# 🦷 OdontoPro

**Plataforma para profissionais da saúde bucal com foco em agilizar o atendimento de forma simplificada e organizada.**

Uma aplicação moderna construída com Next.js que conecta pacientes a clínicas odontológicas, permitindo agendamentos online e gestão de consultas.

## 🚀 Tecnologias

- **Frontend:** Next.js 15.5.4, React 19, TypeScript
- **Styling:** Tailwind CSS v3.4.18, Shadcn/ui
- **Database:** PostgreSQL com Prisma ORM
- **Authentication:** NextAuth.js v4 (Google, GitHub)
- **UI Components:** Radix UI, Lucide React
- **State Management:** TanStack Query

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (para produção)

### Configuração Local

1. **Clone o repositório:**
```bash
git clone https://github.com/TaviloBreno/odontopro.git
cd odontopro
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# App
NEXT_PUBLIC_URL=http://localhost:3000

# Database (Opcional para desenvolvimento)
DATABASE_URL="postgresql://username:password@localhost:5432/odontopro?schema=public"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# GitHub OAuth (Opcional)
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acesse a aplicação:**
   - Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🗄️ Banco de Dados

### Desenvolvimento (Dados Fictícios)

Por padrão, a aplicação funciona com dados fictícios para desenvolvimento, não requerendo configuração de banco de dados.

### Produção (PostgreSQL)

Para usar dados reais, configure o banco PostgreSQL:

1. **Configure o DATABASE_URL no .env**
2. **Execute as migrations:**
```bash
npx prisma generate
npx prisma db push
```

3. **Visualize os dados (opcional):**
```bash
npx prisma studio
```

### Opções de Banco de Dados em Nuvem

#### Neon (Recomendado)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a string de conexão para DATABASE_URL

#### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String para DATABASE_URL

## 🔐 Autenticação

A aplicação suporta login via:

### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione `http://localhost:3000/api/auth/callback/google` nas URIs autorizadas
6. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env

### GitHub OAuth  
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie uma nova OAuth App
3. Configure:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Configure GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET no .env

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (public)/          # Rotas públicas (landing page)
│   ├── (panel)/           # Painel administrativo (dashboard)
│   ├── api/               # API routes
│   └── globals.css        # Estilos globais
├── components/            # Componentes reutilizáveis
│   └── ui/               # Componentes do Shadcn/ui
├── lib/                  # Utilitários e configurações
└── providers/            # Context providers
```

## 🎨 Componentes UI

O projeto utiliza [Shadcn/ui](https://ui.shadcn.com/) para componentes de interface:

- ✅ Button, Card, Dialog, Form
- ✅ Input, Label, Select, Sheet
- ✅ Textarea, Collapsible
- ✅ Integração completa com Tailwind CSS

## 📱 Funcionalidades

### Para Pacientes
- 🔍 Busca de clínicas próximas
- 📅 Agendamento online de consultas
- 👨‍⚕️ Visualização de perfis de dentistas
- 📱 Interface responsiva

### Para Profissionais
- 🏥 Gestão de perfil da clínica
- 📊 Dashboard administrativo
- 💼 Planos Basic e Professional
- ⏰ Gestão de horários

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linting do código
```

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
- Railway
- Render  
- DigitalOcean App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Tavilo Breno**
- GitHub: [@TaviloBreno](https://github.com/TaviloBreno)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
