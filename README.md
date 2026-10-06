# Odonto PRO

Aplicação Next.js com banco de dados PostgreSQL, autenticação Google/GitHub, assinaturas Stripe e upload de imagens via Cloudinary.

Consulte o [checklist do MVP](./MVP-CHECKLIST.md) para requisitos pendentes, prioridades e critérios de lançamento.
Procedimentos de deploy, provisionamento do administrador da plataforma e backup estão em [OPERATIONS.md](./OPERATIONS.md).

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

   O seed é repetível: reexecutá-lo atualiza os mesmos registros sem duplicar os exemplos e preserva os planos comerciais configurados pela plataforma. Ele cria uma clínica e um funcionário para acesso local, um cliente com agendamento de demonstração e uma conta de administrador da plataforma; também cria 20 clínicas fictícias publicadas, cada uma com funcionário e serviço. Os funcionários extras usam e-mails `@example.test`, não têm senha e não são contas de acesso. Em desenvolvimento, os usuários padrão são: administrador da clínica `demo@odontopro.local` / `OdontoPro123!`; funcionário `funcionario@odontopro.local` / `OdontoFuncionario123!`; cliente `cliente@odontopro.local` / `OdontoCliente123!`; administrador da plataforma `plataforma@odontopro.local` / `OdontoPlataforma123!`. Altere os valores `TEST_*` no `.env` antes de compartilhar a máquina. As credenciais demo só são aceitas com `NODE_ENV=development` e `TEST_LOGIN_ENABLED=true`; nunca as habilite em produção. Contas cadastradas pelo formulário usam senha com pelo menos 12 caracteres e autenticação com hash bcrypt.

6. Inicie o servidor:

   ```bash
   npm run dev
   ```

   A aplicação ficará disponível em <http://localhost:3000>.

## Integrações externas

Configure `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` ou `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` para habilitar login OAuth. Em desenvolvimento, se OAuth não estiver configurado ou Google estiver indisponível, use `/login` com as contas seed; contas cadastradas também podem entrar com e-mail e senha em `/auth/signin`. O administrador da clínica gerencia serviços, perfil, equipe e assinatura em `/dashboard`; o funcionário acessa agenda e lembretes em `/dashboard/employee`; o cliente vê as reservas feitas enquanto autenticado em `/dashboard/client`; o administrador da plataforma configura planos comerciais em `/platform/plans`. A conta de plataforma de demonstração é local e fica inativa quando o seed roda com `NODE_ENV=production`. Reservas públicas feitas sem sessão continuam disponíveis pelo link secreto, sem aparecer no painel do cliente. A equipe adicionada pelo administrador pode entrar por OAuth usando exatamente o e-mail previamente cadastrado. As variáveis `STRIPE_*` são necessárias para pagamentos e webhooks; `CLOUDINARY_*` habilita o upload de avatar. Esses serviços não impedem a compilação nem o uso das páginas que não dependem deles.

Uma clínica criada pelo cadastro começa não publicada. Para aparecer na busca e aceitar reservas, o administrador deve cadastrar pelo menos um serviço, configurar os horários e ativar a publicação em `/dashboard/profile`. Os horários atuais se aplicam igualmente a todos os dias da semana; configuração por dia/feriado ainda não está implementada. Preços de serviços são armazenados em centavos, e cada agendamento preserva nome, preço e duração existentes no momento da reserva.

As páginas institucionais estão em `/about` (Sobre) e `/contact` (Contato). A página de contato apresenta o endereço informado — Rua Manoel Idelfonso, 937, Crateús, Ceará — e um mapa incorporado do Google Maps; carregar o mapa pode compartilhar dados técnicos do navegador com o Google.

Após reservar, o paciente recebe na tela um link exclusivo para consultar, reagendar (data e horário) ou cancelar a consulta antes do início. O link é um segredo de acesso: deve ser guardado e compartilhado somente com o paciente; no banco, somente o hash do token é persistido. Ainda não há provedor real de e-mail configurado, então o link não é enviado por e-mail e precisa ser salvo na confirmação.

Para produção, defina as variáveis de ambiente no provedor, use `npm run db:deploy` para aplicar migrations e inicie com `npm run build` seguido de `npm run start`.

## Testes automatizados

Com PostgreSQL local ativo e as variáveis de demonstração do `.env` definidas, execute `npm test`. O comando aplica migrations (duas vezes para verificar idempotência) e roda testes de unidade/integração e smoke tests Chromium, incluindo repetibilidade do seed, pelo menos 20 clínicas/funcionários fictícios, login e autorização de clínica, cliente e administrador da plataforma, clínica pública, páginas institucionais e dashboards separados. Por segurança, testes usam exclusivamente o schema PostgreSQL `odontopro_test`; os dados do schema `public` não são alterados. Para CI ou banco remoto, defina `TEST_DATABASE_URL` para uma base cujo nome contenha `test` e instale o browser uma vez com `npx playwright install chromium`. Não aponte a URL de teste para uma base de produção.
