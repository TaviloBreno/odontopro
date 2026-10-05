# Odonto PRO

Aplicação Next.js com banco de dados PostgreSQL, autenticação Google/GitHub, assinaturas Stripe e upload de imagens via Cloudinary.

Consulte o [checklist do MVP](./MVP-CHECKLIST.md) para requisitos pendentes, prioridades e critérios de lançamento.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Docker Desktop (para iniciar o PostgreSQL local) ou PostgreSQL acessível pela máquina

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.example.env` para `.env`, gere um segredo com `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` e informe o resultado em `AUTH_SECRET`. Mantenha `NEXT_PUBLIC_URL` como `http://localhost:3000` no desenvolvimento.

3. Inicie o PostgreSQL local (os valores padrão são apenas para desenvolvimento):

   ```bash
   docker compose up -d db
   ```

   Se usar outro PostgreSQL, ajuste `DATABASE_URL` no `.env`.

4. Gere o Prisma Client e aplique as migrations:

   ```bash
   npx prisma generate
   npm run db:migrate
   ```

5. Crie o usuário e os dados de demonstração:

   ```bash
   npm run db:seed
   ```

   O seed é repetível: reexecutá-lo atualiza os mesmos registros sem duplicar os exemplos. Ele cria uma clínica-administradora e um funcionário vinculado a ela. Em desenvolvimento, o administrador padrão é `demo@odontopro.local` / `OdontoPro123!`; o funcionário é `funcionario@odontopro.local` / `OdontoFuncionario123!`. Altere esses valores no `.env` antes de compartilhar a máquina. O acesso por credenciais é habilitado somente quando `NODE_ENV=development` e `TEST_LOGIN_ENABLED=true`; nunca o habilite em produção.

6. Inicie o servidor:

   ```bash
   npm run dev
   ```

   A aplicação ficará disponível em <http://localhost:3000>.

## Integrações externas

Configure `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` ou `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` para habilitar login OAuth. Em desenvolvimento, se OAuth não estiver configurado ou Google estiver indisponível, use `/login` com uma das duas contas seed. O administrador gerencia serviços, perfil, planos e equipe em `/dashboard`; o funcionário acessa agenda e lembretes em `/dashboard/employee`. Pacientes agendam sem conta pela página pública da clínica. A equipe adicionada pelo administrador entra com Google usando exatamente o e-mail previamente cadastrado. As variáveis `STRIPE_*` são necessárias para pagamentos e webhooks; `CLOUDINARY_*` habilita o upload de avatar. Esses serviços não impedem a compilação nem o uso das páginas que não dependem deles.

Para produção, defina as variáveis de ambiente no provedor, use `npm run db:deploy` para aplicar migrations e inicie com `npm run build` seguido de `npm run start`.
