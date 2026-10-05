# Checklist do MVP Odonto PRO

**Escopo:** auditoria do código, schema/migrations, seed e configuração local em 05/10/2026.  
**Legenda:** `[x]` existe ou foi verificado; `[ ]` continua pendente. Um recurso existente ainda pode exigir testes de aceitação antes de ser considerado pronto para usuários reais.

## Estado atual

- [x] Aplicação Next.js compila com `npm run build`.
- [x] `npm run typecheck` passa.
- [x] Schema Prisma válido e PostgreSQL local acessível.
- [x] As oito migrations existentes foram aplicadas ao banco local.
- [x] `npm run db:seed` é repetível e cria a clínica demo, funcionário vinculado, serviços, agendamentos e lembretes sem duplicar registros.
- [x] Login local de teste foi validado no navegador e abriu o dashboard com dados.
- [x] Papéis de administrador e funcionário persistidos no banco, com painéis/menus separados; rotas de funcionário ficam restritas ao painel de agenda/lembretes e o paciente reserva pela página pública sem conta.
- [x] Login de teste do funcionário validado no navegador; acesso direto às rotas administrativas redireciona para o dashboard permitido.
- [x] Cadastro e login com senha bcrypt validados ponta a ponta; dados da conta descartável de smoke test foram removidos depois da validação.
- [x] Administrador pode cadastrar e reativar funcionários por e-mail; o funcionário pode autenticar com Google no e-mail pré-cadastrado ou com credenciais locais de demonstração em development.
- [x] Validação de agendamento foi exercitada contra PostgreSQL: conflito sobreposto recusado e, em duas tentativas concorrentes para a mesma vaga, somente uma reserva foi criada; registros temporários do teste foram removidos.
- [x] Upload de avatar sem sessão responde 401; os dados públicos de clínica não incluem e-mail, telefone ou credenciais; API pública retorna somente slots ocupados e rejeita datas inválidas.
- [ ] Login Google real não foi validado; requer credenciais OAuth e configuração do callback no Google Cloud.
- [ ] Integrações pagas (Stripe e Cloudinary) não foram validadas com credenciais reais.
- [ ] Ainda não existe uma suíte de testes automatizados do produto.

## P0 — Bloqueadores antes de expor o MVP a usuários externos

### Segurança e isolamento entre clínicas

- [x] **Proteger ações e leituras por clínica.** Serviços, lembretes, perfil, agenda e equipe derivam a clínica da sessão no banco e limitam leituras/mutações ao proprietário; IDs enviados pelo cliente não autorizam acesso a outra clínica. Dados de perfil usam seleção explícita sem senha, e-mail ou tokens.
- [x] **Proteger upload de avatar.** `src/app/api/image/upload/route.ts` exige sessão, deriva a identidade da sessão, limita arquivo a 5 MB, valida assinatura PNG/JPEG e impede a escolha de `public_id` pelo cliente. Requer credenciais Cloudinary para completar o armazenamento.
- [x] **Validar agendamentos no servidor.** A reserva valida clínica publicada, serviço ativo da clínica, e-mail/telefone/nome, data, fuso, horário configurado e slots consecutivos; preço, nome e duração são copiados do banco, não confiados ao browser.
- [x] **Impedir conflitos de horário.** A reserva e a verificação ocorrem em transação PostgreSQL `Serializable`; apenas reservas `SCHEDULED` bloqueiam slots e conflito de serialização retorna mensagem recuperável.
- [x] **Aplicar limites de plano no servidor.** Criação valida BASIC/PROFESSIONAL/PREMIUM e trial por clínica dentro de transação serializável, além do bloqueio visual no painel.
- [x] **Revisar isolamento nas ações e APIs deste fluxo.** Create/update/archive de serviço, lembretes, perfil/avatar, cancelamento/conclusão e leituras da agenda usam a clínica obtida da sessão e filtros por proprietário.
- [x] **Proteger rotas privadas do painel.** Layout verifica a conta no banco; funcionário desativado perde acesso e funcionário ativo é limitado à agenda/lembretes. APIs de agenda/avatar também exigem sessão.
- [x] A visibilidade pública da clínica foi separada do estado da conta: clínicas fechadas continuam podendo entrar no dashboard; novos cadastros começam não publicados e só podem publicar com serviço e horários configurados.
- [x] Login de demonstração só é habilitado em development com flag explícita; produção não aceita as senhas compartilhadas do seed.
- [x] Rotas `/test*`, `/debug`, `/demo*` e `/checkout/test` retornam 404 em produção via middleware.

### Agendamento e experiência essencial

- [x] **CTA da home.** “Encontre uma clínica” navega até a lista, que informa quando ainda não há clínicas publicadas.
- [x] **Caminho feliz público de reserva.** Clínicas publicadas mostram serviços/horários; o paciente reserva sem conta e recebe confirmação apenas após persistência. A ação valida novamente disponibilidade no servidor.
- [x] **Feedback da reserva.** Formulário mostra validação, erros de conflito/falha e estado de envio; conflito recarrega slots e não apresenta sucesso falso.
- [x] A clínica pode cancelar ou concluir um atendimento sem apagar o registro; status e valor/duração/nome originais ficam preservados.
- [ ] Definir e implementar política de cancelamento/reagendamento pelo paciente (identidade, prazo e confirmação) e comunicações de cancelamento.
- [x] Nome, e-mail, telefone e payload de serviço/data/horário são validados também no servidor.
- [ ] Adicionar rate limit persistente e proteção anti-bot para reservas públicas; não foi usado limite em memória, que seria ineficaz em múltiplas instâncias.

## P1 — Necessário para um MVP utilizável e verificável

### Funcionalidade do profissional

- [x] **Entregar relatório mensal real.** Exibe reservas ativas, concluídas, canceladas, serviços ativos e valor previsto com preço capturado no momento da reserva; restringe a conta da clínica e assinatura/trial válido.
- [x] **Validar horários básicos.** Fuso IANA, formato em intervalos de 30 minutos, duplicidade, ordenação e máximo de slots são validados no servidor; data e slots de hoje usam o fuso da clínica.
- [ ] Expandir horário para configuração por dia da semana, feriados/ausências e regras explícitas de transição de horário de verão.
- [ ] **Conectar os módulos avançados preservados ao banco e a serviços reais.** Algumas telas remotas, como calendário, novo agendamento e análises, usam dados mock ou comportamento demonstrativo; não tratá-las como funcionalidades entregues até persistir e testar os fluxos.
- [x] **Gestão de serviços no backend.** Criação/edição/arquivamento valida nome, centavos, duração e proprietário; limite de plano é aplicado no servidor. Cada reserva mantém nome, preço e duração originais mesmo se o serviço for alterado ou arquivado.
- [x] **Estados de agendamento.** `SCHEDULED`, `CANCELLED` e `COMPLETED`; cancelamento não apaga histórico e conclusão só é permitida após o horário reservado.
- [x] **Agenda diária.** Filtra por data e clínica, considera duração capturada na reserva, mostra erro/retry, evita controles duplicados nos slots consecutivos e atualiza após tratar o agendamento.
- [ ] **Completar notificações.** Definir envio de confirmação e lembrete para paciente e clínica (e-mail/SMS/WhatsApp, conforme o produto); se isso ficar fora do MVP, informar claramente que a clínica precisa contatar o paciente manualmente.
- [x] **Ciclo básico de lembretes.** Criar, listar, concluir/reabrir e excluir com validação de proprietário, ordenação e feedback.
- [ ] Adicionar edição de lembretes.
- [x] **Descoberta de clínicas.** Lista apenas clínicas publicadas, em ordem determinística, sem expor telefone/e-mail e com estado vazio explícito.
- [x] **Onboarding do administrador.** Novas contas ficam não publicadas; painel orienta cadastrar serviço, definir horários e publicar pelo perfil.
- [ ] Validar o onboarding por OAuth real, com credenciais e callback configurados.

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
- [x] Históricos integrados sem force push e versão publicada em `main`; branch local e remota conferidas no commit `b358ba2`.
- [x] Build de produção e typecheck passaram após remover a augmentation duplicada/incompleta de tipos NextAuth; migrations estão em dia.
- [x] Dados públicos de clínica limitados aos campos necessários; senhas e dados internos não são enviados à listagem pública nem impressos em logs de debug.
- [x] README, seed e este checklist atualizados; migrations aplicadas, seed executado, typecheck e build verificados.

### Falta para liberar o MVP

- [ ] Validar no navegador o fluxo administrativo de cadastro de funcionário e a associação OAuth por e-mail.
- [ ] Auditar e testar isolamento/autorização de todas as ações, incluindo os módulos que existem somente no `main` remoto.
- [ ] Implementar os demais itens P0/P1/P2 acima, principalmente limite de serviços no servidor, testes automatizados, política de privacidade, deploy/backup e integrações reais.
- [ ] Resolver as 5 vulnerabilidades reportadas por `npm audit --omit=dev` (1 moderada e 4 altas) sem atualização major não revisada do Next.js.
