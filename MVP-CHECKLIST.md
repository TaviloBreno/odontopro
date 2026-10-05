# Checklist do MVP Odonto PRO

**Escopo:** auditoria do código, schema/migrations, seed e configuração local em 05/10/2026.  
**Legenda:** `[x]` existe ou foi verificado; `[ ]` continua pendente. Um recurso existente ainda pode exigir testes de aceitação antes de ser considerado pronto para usuários reais.

## Estado atual

- [x] Aplicação Next.js compila com `npm run build`.
- [x] `npm run typecheck` passa.
- [x] Schema Prisma válido e PostgreSQL local acessível.
- [x] As nove migrations existentes foram aplicadas ao banco local.
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

- [x] Validação de servidor com limites, normalização e validação de telefone/moeda/duração nos fluxos de cadastro de clínica, serviço, lembrete e reserva; formulários também têm limites de entrada.
- [ ] Revisar formulários dos módulos avançados/mock para aplicar as mesmas regras antes de conectar persistência real.
- [ ] **Validar parâmetros de rota e data.** Rejeitar datas impossíveis/formato inválido e IDs inválidos, retornando 400 em vez de normalizar silenciosamente ou produzir consulta errada.
- [x] **Tratar erros nos fluxos principais.** Falhas de perfil, serviços, lembretes, agenda e listagem pública são registradas/propagadas; telas de agenda/reserva exibem erro em vez de confirmação ou disponibilidade falsa.
- [x] Avatar limita peso a 5 MB, confere PNG/JPEG por assinatura e associa o `public_id` à clínica; [ ] falta limitar dimensões e definir retenção/remoção no Cloudinary.
- [ ] **Adicionar índices do banco para consultas frequentes.** Avaliar `Appointment(userId, appointmentDate)`, `Reminder(userId)` e relações depois de medir consultas; adicionar migration e validar plano de execução.
- [x] **Consistência financeira e de reservas.** `Service.price` é persistido em centavos; reserva captura nome, preço e duração para manter histórico correto após edição/arquivamento.
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

- [x] Schema/migrations para publicação independente da conta, estados de agendamento e snapshots de serviço/preço/duração; migrations aplicadas ao PostgreSQL local.
- [x] Isolamento das leituras/mutações centrais conferido; perfil e listagem pública não serializam e-mail, telefone, senha, tokens ou dados de assinatura desnecessários.
- [x] Limite de serviços por plano verificado no servidor dentro de transação serializável; validação de formulário não depende somente da interface.
- [x] Clínicas novas começam ocultas, perfil valida fuso/horários e publicação exige horário e serviço; dashboard orienta o primeiro setup.
- [x] CTA, reserva pública com feedback, estados de agenda, histórico de reserva, relatório mensal e ciclo básico de lembretes implementados.
- [x] Rotas de demonstração são 404 em produção; contas seed só autenticam em development com a flag explícita.
- [x] README e este checklist atualizados com o comportamento de publicação e os limites ainda conhecidos.

### Falta para liberar o MVP

- [ ] Escolher a política de cancelamento/reagendamento pelo paciente e implementar confirmação/notificação conforme a regra escolhida.
- [ ] Adicionar rate limit persistente e proteção anti-bot para reservas públicas.
- [ ] Completar agenda semanal (dias/feriados), edição de lembretes e substituir telas demonstrativas restantes por fluxos reais ou removê-las do MVP.
- [ ] Validar OAuth, Stripe/Cloudinary e onboarding de funcionário no ambiente alvo; criar testes automatizados de autenticação, isolamento, reservas, estados e planos.
- [ ] Concluir privacidade, backups, deploy, paginação/índices e auditoria dos módulos avançados antes de liberar acesso externo.
- [ ] Resolver as 5 vulnerabilidades reportadas por `npm audit --omit=dev` (1 moderada e 4 altas) sem atualização major não revisada do Next.js.
