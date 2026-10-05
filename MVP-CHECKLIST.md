# Checklist do MVP Odonto PRO

**Escopo:** auditoria do código, schema/migrations, seed e configuração local em 05/10/2026.  
**Legenda:** `[x]` existe ou foi verificado; `[ ]` continua pendente. Um recurso existente ainda pode exigir testes de aceitação antes de ser considerado pronto para usuários reais.

## Estado atual

- [x] Aplicação Next.js compila com `npm run build`.
- [x] `npm run typecheck` passa.
- [x] Schema Prisma válido e PostgreSQL local acessível.
- [x] As cinco migrations existentes foram aplicadas ao banco local.
- [x] `npm run db:seed` é repetível e cria a clínica demo, funcionário vinculado, serviços, agendamentos e lembretes sem duplicar registros.
- [x] Login local de teste foi validado no navegador e abriu o dashboard com dados.
- [x] Papéis de administrador e funcionário persistidos no banco, com painéis/menus separados; rotas de funcionário ficam restritas ao painel de agenda/lembretes e o paciente reserva pela página pública sem conta.
- [x] Login de teste do funcionário validado no navegador; acesso direto às rotas administrativas redireciona para o dashboard permitido.
- [x] Cadastro e login com senha bcrypt validados ponta a ponta; dados da conta descartável de smoke test foram removidos depois da validação.
- [x] Administrador pode cadastrar e reativar funcionários por e-mail; o funcionário pode autenticar com Google no e-mail pré-cadastrado ou com credenciais locais de demonstração em development.
- [x] Validação de agendamento foi exercitada contra PostgreSQL: conflito sobreposto recusado e, em duas tentativas concorrentes para a mesma vaga, somente uma reserva foi criada; registros temporários do teste foram removidos.
- [x] Upload de avatar sem sessão responde 401; API pública retorna os slots ocupados pela duração e rejeita datas inválidas.
- [ ] Login Google real não foi validado; requer credenciais OAuth e configuração do callback no Google Cloud.
- [ ] Integrações pagas (Stripe e Cloudinary) não foram validadas com credenciais reais.
- [ ] Ainda não existe uma suíte de testes automatizados do produto.

## P0 — Bloqueadores antes de expor o MVP a usuários externos

### Segurança e isolamento entre clínicas

- [x] **Proteger exclusão de lembretes.** `src/app/(panel)/dashboard/_actions/delete-reminder.ts` exige sessão e exclui com o par `id`/`userId` da sessão; retorna erro se o registro não pertence ao usuário.
- [x] **Proteger upload de avatar.** `src/app/api/image/upload/route.ts` exige sessão, deriva a identidade da sessão, limita arquivo a 5 MB, valida assinatura PNG/JPEG e impede a escolha de `public_id` pelo cliente. Requer credenciais Cloudinary para completar o armazenamento.
- [x] **Validar agendamentos no servidor.** `src/app/(public)/clinica/[id]/_actions/create-appointment.ts` valida clínica ativa, propriedade/estado do serviço, data, fuso, horário configurado e sequência de slots correspondente à duração.
- [x] **Impedir conflitos de horário.** A disponibilidade é consultada e a reserva criada em transação PostgreSQL `Serializable`; intervalos sobrepostos são rejeitados e conflitos de serialização retornam mensagem de horário ocupado.
- [x] **Validar dados públicos contra adulteração.** A action obtém clínica, status, agenda, serviço, propriedade e duração do banco; valida data e horário no servidor e não recebe preço/duração do browser.
- [ ] **Aplicar limites de plano no servidor.** `src/app/(panel)/dashboard/services/_actions/create-service.ts` autentica, mas não chama `canPermission`; o limite de serviços é aplicado na apresentação e pode ser contornado chamando a server action diretamente. Validar também o limite antes de criar.
- [ ] **Conferir todas as ações por proprietário.** Revisar create/update/delete de serviços, lembretes, perfil e agendamentos para garantir que toda leitura e mutação use o `userId` autenticado. Repetir essa verificação em novas ações e APIs.
- [ ] **Revisar proteção de sessão em todas as rotas privadas.** Confirmar respostas 401/redirect sem sessão e negar acesso a usuário desativado; manter os dados de uma clínica inacessíveis a outra mesmo manipulando IDs.
- [x] Middleware e layout exigem sessão para as rotas do dashboard e redirecionam funcionários para o painel permitido; funcionário não acessa páginas administrativas/avançadas por URL direta.
- [ ] **Remover credenciais compartilhadas antes de publicar.** O usuário seed `demo@odontopro.local` e a senha local são previsíveis e documentados. Não copiar esse acesso para produção; criar uma conta de demonstração isolada ou desabilitá-la.
- [ ] **Restringir páginas de demonstração/depuração antes de publicar.** O `main` remoto contém rotas `/test*`, `/debug`, `/demo` e `/checkout/test`; revisar e desabilitar ou proteger as que não forem parte do produto público.

### Agendamento e experiência essencial

- [ ] **Corrigir CTA principal da home.** O botão “Encontre uma clínica” em `src/app/(public)/_components/hero.tsx` não navega nem rola para a lista de profissionais.
- [ ] **Concluir o caminho feliz de reserva:** encontrar clínica ativa → ver serviços e horários → reservar → receber confirmação clara, sem depender de sessão do profissional.
- [ ] **Dar feedback confiável ao paciente.** Exibir erros de validação, horário que acabou de ser ocupado e falha temporária; não mostrar confirmação quando a gravação falhar.
- [ ] **Definir a regra de cancelamento e alteração.** Hoje a clínica pode excluir um agendamento; falta definir se o paciente pode cancelar/reagendar, até quando, e como a clínica/paciente recebe a confirmação.
- [ ] **Evitar abuso da reserva pública.** Adicionar limite de requisições e proteção contra spam/bots apropriada ao risco; estabelecer limites de payload e validação de telefone/e-mail.

## P1 — Necessário para um MVP utilizável e verificável

### Funcionalidade do profissional

- [ ] **Entregar relatórios reais.** `src/app/(panel)/dashboard/reports/page.tsx` atualmente mostra somente título/permissão; implementar os indicadores prometidos ou retirar a funcionalidade do escopo e dos planos.
- [ ] **Completar gestão de horários.** Validar intervalos, duplicidade, formato, fuso horário, dias sem atendimento, feriados/ausências e mudança de horário de verão.
- [ ] **Conectar os módulos avançados preservados ao banco e a serviços reais.** Algumas telas remotas, como calendário, novo agendamento e análises, usam dados mock ou comportamento demonstrativo; não tratá-las como funcionalidades entregues até persistir e testar os fluxos.
- [ ] **Completar gestão de serviços.** Testar criação/edição/arquivamento, valor em centavos, duração mínima e serviço já usado por agendamentos. Aplicar os limites BASIC/PROFESSIONAL no backend.
- [ ] **Definir estado do agendamento.** Avaliar estados como confirmado, cancelado e concluído em vez de apagar definitivamente; preservar histórico e evitar que “cancelar” remova dados necessários.
- [ ] **Aprimorar agenda diária.** Confirmar filtros por data, fuso, slots consecutivos para atendimentos longos, estados vazios/erro e comportamento após cancelar.
- [ ] **Completar notificações.** Definir envio de confirmação e lembrete para paciente e clínica (e-mail/SMS/WhatsApp, conforme o produto); se isso ficar fora do MVP, informar claramente que a clínica precisa contatar o paciente manualmente.
- [ ] **Completar ciclo de lembretes internos.** Confirmar edição/conclusão, ordenação e feedback. Atualmente há criar/listar/excluir, mas excluir não é seguro até cumprir o P0.
- [ ] **Melhorar descoberta de clínicas.** Definir ordenação e critérios de inclusão da listagem, estados sem resultados e como clínicas novas ganham visibilidade.
- [ ] **Revisar onboarding após OAuth.** Primeiro login cria conta, mas verificar se o profissional recebe orientação para completar perfil, definir disponibilidade e cadastrar pelo menos um serviço.

### Robustez e qualidade de dados

- [ ] **Validar formulários no backend com limites completos.** Adicionar tamanho máximo, normalização, validação de telefone, moeda/duração e mensagens consistentes; não confiar apenas no React Hook Form.
- [ ] **Validar parâmetros de rota e data.** Rejeitar datas impossíveis/formato inválido e IDs inválidos, retornando 400 em vez de normalizar silenciosamente ou produzir consulta errada.
- [ ] **Tratar erros de integração sem sucesso falso.** Rever `catch` que retorna lista vazia ou mensagem genérica (por exemplo, listagem pública e dados de agenda); registrar o erro para suporte e retornar estado de falha diferenciável.
- [ ] **Adicionar limites/tamanho para imagens.** Definir dimensão e peso máximos, nomes seguros, estratégia para remover/substituir imagens antigas e comportamento sem Cloudinary.
- [ ] **Adicionar índices do banco para consultas frequentes.** Avaliar `Appointment(userId, appointmentDate)`, `Reminder(userId)` e relações depois de medir consultas; adicionar migration e validar plano de execução.
- [ ] **Definir consistência dos dados financeiros.** Documentar que `Service.price` é centavos e garantir a mesma regra em formulário, seed, exibição e API.
- [ ] **Adicionar paginação ou limites** para listas que possam crescer (agendamentos, profissionais e lembretes).

### Testes automatizados

- [ ] Criar testes para regras de reserva: clínica inativa/inexistente, serviço de outra clínica, horário fora da agenda, data passada, conflito e reserva válida.
- [ ] Criar testes de isolamento multi-tenant para todas as server actions e rotas.
- [ ] Testar login local correto/incorreto, conta desativada, provider ausente e bloqueio do login de teste fora de development.
- [ ] Testar limites e estados de assinatura, incluindo eventos Stripe repetidos.
- [ ] Criar testes de integração com PostgreSQL para migrations e seed idempotente.
- [ ] Criar smoke test que abre home, login, página pública de clínica e dashboard autenticado.
- [ ] Configurar CI para instalar pelo lockfile, executar `typecheck`, testes, build e auditoria de dependências antes de integrar alterações.

## P2 — Preparação para lançamento público e operação

### Privacidade, conformidade e suporte

- [ ] Publicar política de privacidade e termos de uso; explicar coleta, finalidade, retenção, compartilhamento e exclusão dos dados de pacientes.
- [ ] Definir processo para exportação e exclusão de dados da clínica/paciente, incluindo fotos e dados mantidos em serviços terceiros.
- [ ] Definir retenção de agendamentos, logs e dados de conta; não manter informações pessoais além do necessário.
- [ ] Incluir consentimento e comunicação adequada antes de coletar dados pessoais de pacientes; validar requisitos LGPD com responsável jurídico.
- [ ] Disponibilizar canal de suporte e instruções para problemas de login, cobrança e agendamento.

### Operação

- [ ] Configurar backup automático do PostgreSQL, retenção e teste de restauração.
- [ ] Definir procedimento seguro de deploy: migrations compatíveis, rollback, health check e plano de recuperação.
- [ ] Configurar monitoramento de disponibilidade e captura de erros sem registrar dados clínicos/pessoais em logs.
- [ ] Substituir `console.log` de produção por logging estruturado; remover logs de dados de agendamentos.
- [ ] Definir rate limiting e proteção para login, upload, reservas e webhooks.
- [ ] Revisar dependências e vulnerabilidades antes do lançamento e estabelecer rotina de atualização.
- [ ] Validar domínio, HTTPS, URLs OAuth/webhook, `NEXT_PUBLIC_URL`, metadados e imagens no ambiente real.
- [ ] Testar layout responsivo, navegação por teclado, labels/contraste e mensagens de erro nos fluxos essenciais.
- [ ] Ajustar idioma do documento para português (`lang="pt-BR"`) e rever textos, acentuação e identidade visual/créditos da landing page.

## Critério sugerido para declarar o MVP pronto

- [ ] Um profissional consegue entrar, configurar perfil/horários/serviços e publicar uma clínica.
- [ ] Um paciente consegue reservar um horário válido; horários simultâneos ou inválidos são recusados no servidor.
- [ ] O profissional consegue consultar e tratar agendamentos e lembretes sem acessar dados de outra clínica.
- [ ] OAuth e/ou método de acesso escolhido está configurado e validado no ambiente alvo; credenciais de demonstração não estão habilitadas em produção.
- [ ] Cobrança está testada de ponta a ponta **ou** fica explicitamente fora do MVP, sem botões de compra inoperantes.
- [ ] Testes automatizados cobrem autenticação, isolamento, reserva e regras de assinatura adotadas.
- [ ] Privacidade, suporte, backups e deploy têm responsáveis e procedimentos definidos.

## Resumo da entrega e pendências

### Feito nesta etapa

- [x] Migration e modelo de dados para administrador/dono da clínica e funcionário vinculado.
- [x] Dashboard, navegação e encerramento de sessão distintos para administrador e funcionário; paciente continua sem conta e agenda publicamente.
- [x] Cadastro/reativação de funcionário pelo administrador e credenciais locais de demonstração somente em desenvolvimento.
- [x] Restrições por papel nas páginas administrativas e middleware para exigir sessão e impedir que funcionário acesse outras rotas do dashboard.
- [x] Agenda e lembretes da clínica acessíveis ao funcionário; clínica e agenda públicas filtram usuários pelo papel ADMIN.
- [x] Recursos exclusivos do `main` remoto preservados na cópia integrada (54 arquivos; configurações/tipos compartilhados consolidados); conflito de build e incompatibilidade de rota Next.js 15 corrigidos.
- [x] Dados públicos de clínica limitados aos campos necessários; senhas e dados internos não são enviados à listagem pública nem impressos em logs de debug.
- [x] README, seed e este checklist atualizados; migrations aplicadas, seed executado, typecheck e build verificados.

### Falta antes de publicar no repositório e liberar o MVP

- [ ] Consolidar os commits locais com a história do `main` remoto e publicar por fast-forward, sem force push.
- [ ] Validar no navegador o fluxo administrativo de cadastro de funcionário e a associação OAuth por e-mail.
- [ ] Auditar e testar isolamento/autorização de todas as ações, incluindo os módulos que existem somente no `main` remoto.
- [ ] Implementar os demais itens P0/P1/P2 acima, principalmente limite de serviços no servidor, testes automatizados, política de privacidade, deploy/backup e integrações reais.
- [ ] Resolver as 5 vulnerabilidades reportadas por `npm audit --omit=dev` (1 moderada e 4 altas) sem atualização major não revisada do Next.js.
