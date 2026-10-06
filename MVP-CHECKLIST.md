# Checklist do MVP Odonto PRO

**Escopo:** auditoria do código, schema/migrations, seed e configuração local em 05/10/2026.  
**Legenda:** `[x]` existe ou foi verificado; `[ ]` continua pendente. Um recurso existente ainda pode exigir testes de aceitação antes de ser considerado pronto para usuários reais.

## Estado atual

- [x] Aplicação Next.js compila com `npm run build`.
- [x] `npm run typecheck` passa.
- [x] Schema Prisma válido e PostgreSQL local acessível.
- [ ] As migrations foram aplicadas ao banco local; a migration do registro de ciência do aviso de privacidade ainda está pendente.
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
- [x] Existe suíte automatizada para os fluxos centrais; novas alterações de privacidade e operação ainda precisam passar pela execução de validação registrada abaixo.

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
- [x] **Cancelamento e reagendamento pelo paciente.** Link bearer aleatório de 256 bits, apresentado uma única vez após a reserva; somente o hash SHA-256 fica salvo. Permite alterar data/horário ou cancelar até o início da consulta, com validação do servidor e transação serializável para reagendamento. Não há envio real por e-mail: paciente precisa guardar o link exibido na confirmação.
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

- [x] Regras de reserva cobertas com PostgreSQL: clínica inexistente/não publicada, serviço de outra clínica/inativo, data impossível/passada, slot fora da agenda ou com intervalo insuficiente, reserva válida, snapshots imutáveis, conflitos sobrepostos e concorrência.
- [x] Isolamento multi-tenant testado nas ações e APIs principais: sessão ausente, clínica diferente, administrador e funcionário ativo/desativado; chamadas diretas não podem alterar lembretes/agendamentos alheios.
- [x] Credenciais corretas/incorretas, usuário inexistente, funcionário desativado, senha excessiva, normalização de e-mail e regras de credenciais demo por ambiente testados; smoke real confirma login local quando OAuth não está configurado.
- [x] Limites de serviços para trial, plano pago e trial expirado testados contra PostgreSQL; sincronização da assinatura Stripe cobre criação repetida, atualização de status/preço e remoção.
- [x] Migrations são aplicadas duas vezes no schema isolado de teste; seed é executado duas vezes e a suíte confirma que não duplica os dados demo.
- [x] Smoke Chromium percorre home, clínica pública/serviço, falha e sucesso de login, dashboard autenticado e redirecionamento de visitante sem sessão.
- [x] CI instala pelo lockfile e executa geração Prisma, `typecheck`, suíte unitária/integração, build, smoke Chromium e auditoria de dependências.
- [ ] Validar após mudanças de privacidade/operação: migrations, testes de ciência do aviso, typecheck, build, smoke Chromium e scripts de backup/restauração ainda não foram executados nesta etapa.

## P2 — Preparação para lançamento público e operação

### Privacidade, conformidade e suporte

- [x] Páginas técnicas provisórias de aviso de privacidade, termos e suporte publicadas na aplicação; informam coleta/uso observado, retenção definida pelo operador, serviços externos, contato e limites dos fluxos manuais.
- [x] Formulário público de reserva liga ao aviso, exige ciência validada no servidor e grava o timestamp junto ao agendamento; isso não declara consentimento como base legal.
- [x] Canal de contato e instruções para login, cobrança, agendamento e solicitações de privacidade informados em `/support`.
- [ ] Revisão jurídica das páginas e validação das bases legais, prazos e obrigações aplicáveis à LGPD antes do uso real.
- [ ] Operacionalizar e testar exportação/exclusão de dados da clínica/paciente em banco, imagens e terceiros; hoje solicitações são manuais e verificadas individualmente.
- [ ] Definir responsáveis e prazo de atendimento para suporte, privacidade e incidentes; o endereço publicado ainda não representa um processo de suporte formal.

### Operação

- [x] Endpoint `/api/health` verifica conectividade PostgreSQL, não armazena resposta em cache e retorna erro sanitizado sem detalhes da conexão.
- [x] Logger JSON estruturado omite mensagem/stack de erros; logs explícitos dos principais fluxos de reserva, agendamento, lembrete, perfil/avatar e serviços foram substituídos por eventos sanitizados.
- [x] Scripts `db:backup` e `db:backup:restore` criados para dump custom verificado e ensaio em banco descartável com nome `test`/`restore`; o procedimento e as limitações estão em `OPERATIONS.md`.
- [x] Procedimento de migrations/deploy, verificação de saúde, restauração e resposta inicial a incidentes documentado em `OPERATIONS.md`.
- [ ] Configurar backup automático, cifra, cópia externa, retenção, alertas e comprovar restauração no provedor alvo; os scripts atuais não fazem isso.
- [ ] Configurar monitoramento externo/alertas e confirmar tratamento operacional de falhas e incidentes no ambiente alvo.
- [ ] Concluir inventário de logs: outros `console.*` ainda podem existir em fluxos secundários/demonstrativos e devem ser revistos antes do lançamento.
- [ ] Definir rate limiting e proteção para login, upload, reservas e webhooks.
- [ ] Revisar dependências e vulnerabilidades antes do lançamento e estabelecer rotina de atualização.
- [ ] Validar domínio, HTTPS, URLs OAuth/webhook, `NEXT_PUBLIC_URL`, metadados e imagens no ambiente real.
- [ ] Testar layout responsivo, navegação por teclado, labels/contraste e mensagens de erro nos fluxos essenciais.
- [x] Idioma global declarado como português (`lang="pt-BR"`) e links globais para aviso, termos, suporte e contato adicionados.
- [ ] Rever responsividade, teclado, labels/contraste, textos e identidade visual/créditos da landing page.

## Critério sugerido para declarar o MVP pronto

**Regra de aprovação:** declarar pronto somente quando todos os critérios abaixo aplicáveis ao escopo escolhido estiverem marcados `[x]` e comprovados no ambiente de lançamento. Marcar um recurso como implementado no código ou validado localmente, por si só, não aprova a operação em produção. Se uma área (por exemplo, cobrança ou módulos avançados) ficar fora do MVP, ela deve estar desativada/indisponível aos usuários e isso deve ser registrado como decisão de escopo, não como funcionalidade pronta.

### Acesso, papéis e isolamento

- [ ] No ambiente alvo, administrador e funcionário conseguem entrar pelo método de autenticação escolhido; fluxos inválidos, contas desativadas, provider indisponível e recuperação/ajuda ao usuário têm comportamento verificado.
- [ ] Demonstração, credenciais seed e rotas de teste não autenticam nem expõem conteúdo em produção; segredos estão apenas na configuração protegida do provedor.
- [ ] Administrador completa o onboarding: configura perfil, fuso/horários e serviços, publica a clínica e consegue voltar a ocultá-la sem perder o acesso ao painel.
- [ ] Funcionário ativo só acessa as operações permitidas; funcionário desativado perde acesso. Pacientes e clínicas diferentes não leem nem alteram dados alheios por UI, chamadas diretas, IDs manipulados ou links.
- [ ] Testes de isolamento cobrem todas as server actions e APIs com sessão ausente, usuário de outro papel, clínica diferente e funcionário desativado.

### Reserva e operação diária

- [ ] Paciente consegue encontrar uma clínica publicada, reservar sem conta e receber uma confirmação verdadeira somente depois da persistência; formulário, erros, carregamento e ausência de horários foram verificados em desktop e dispositivo móvel.
- [ ] Servidor rejeita data/horário inválidos ou passados, clínica fechada, serviço inativo/de outra clínica, reserva fora dos horários configurados e conflito; teste concorrente comprova que no máximo uma reserva ocupa a mesma vaga.
- [ ] Dados históricos da reserva preservam nome, preço e duração originais do serviço. O paciente consegue consultar, reagendar e cancelar antes do início pelo link secreto; token inválido/alterado, reserva concluída/cancelada e disputa pelo mesmo slot são tratados sem revelar dados.
- [ ] Link de gestão é entregue por um canal definido. Se e-mail/SMS não fizer parte do MVP, a confirmação informa claramente que o paciente deve guardar o link exibido; nenhum envio simulado é apresentado como envio real.
- [ ] Profissional consegue consultar a agenda, concluir ou cancelar sem apagar histórico e criar, editar, concluir/reabrir e excluir lembretes, sempre no escopo da própria clínica.
- [ ] Horários por dia, feriados/ausências e transições de horário de verão estão implementados e testados **ou** as limitações atuais (uma lista semanal uniforme de slots) estão explícitas e aceitas para o escopo inicial.
- [ ] Rate limiting persistente e proteção anti-bot cobrem reserva pública e os endpoints sensíveis; limites e respostas para excesso de requisições são verificados em implantação com mais de uma instância.

### Escopo comercial e qualidade

- [ ] Decisão de cobrança está registrada: se incluída, checkout, webhooks, eventos repetidos, cancelamento/renovação e estados de assinatura foram testados com credenciais de teste e depois validados no ambiente alvo; se excluída, CTAs e rotas de compra não funcionais foram removidos ou desativados.
- [ ] Telas demonstrativas/mock que não fazem parte do MVP foram removidas do fluxo do usuário ou identificadas e bloqueadas; telas incluídas persistem dados reais e têm validação e tratamento de erros no servidor.
- [x] Testes automatizados cobrem autenticação, autorização/isolamento multi-tenant dos fluxos centrais, cadastro e gestão de reserva, concorrência/conflitos, estados de agendamento, lembretes, limites de plano e sincronização repetida de assinaturas.
- [x] Testes de integração executam migrations duas vezes e seed idempotente em PostgreSQL; smoke Chromium percorre home, login, clínica pública e dashboard autenticado.
- [x] CI instala dependências pelo lockfile e executa geração Prisma, typecheck, testes, build, smoke test e auditoria de dependências. A auditoria ainda reporta cinco vulnerabilidades high/moderate, registradas como pendência abaixo; versões major não são atualizadas automaticamente.
- [ ] Formulários e páginas essenciais passaram por verificação responsiva, teclado, labels, contraste, idioma `pt-BR`, textos, links e estados de erro/vazio.
- [ ] Consultas/listas com crescimento previsível têm limites/paginação e índices avaliados com planos de execução e volume representativo; dimensões/tamanho e retenção dos avatares estão definidos.

### Privacidade, segurança e lançamento

- [ ] Política de privacidade e termos publicados explicam dados coletados, finalidade, compartilhamento, retenção e exclusão; consentimento e tratamento de dados foram revisados por responsável competente segundo a LGPD.
- [ ] Processos de exportação/exclusão de dados da clínica e do paciente incluem banco, imagens e terceiros; canal de suporte e responsáveis por privacidade, segurança, cobrança e incidentes estão definidos.
- [ ] Deploy de produção foi ensaiado: variáveis e segredos corretos, domínio/HTTPS, OAuth e webhooks, `NEXT_PUBLIC_URL`, migrations compatíveis, health check, rollback e plano de recuperação foram verificados.
- [ ] Backup automático tem retenção definida e restauração foi testada; monitoramento/captura de erros funciona sem gravar dados pessoais ou clínicos indevidos nos logs.
- [ ] Rate limiting também protege login, upload e webhooks; upload tem limite de dimensões/tamanho, associação correta à clínica e procedimento de remoção/retenção no Cloudinary.
- [ ] Logs de produção não incluem payloads ou identificadores desnecessários de pacientes; logging estruturado, alertas e resposta a incidentes foram testados.

**Resultado da auditoria atual:** este critério ainda não está aprovado para lançamento público. Critérios dependentes de validação local desta etapa, ambiente real, políticas operacionais, proteção persistente, integração comercial/externa e correção das vulnerabilidades continuam pendentes conforme as seções P0/P1/P2 abaixo.

## Resumo da entrega e pendências

### Feito nesta etapa

- [x] Schema/migrations para publicação independente da conta, estados de agendamento e snapshots de serviço/preço/duração; migrations aplicadas ao PostgreSQL local.
- [x] Isolamento das leituras/mutações centrais conferido; perfil e listagem pública não serializam e-mail, telefone, senha, tokens ou dados de assinatura desnecessários.
- [x] Limite de serviços por plano verificado no servidor dentro de transação serializável; validação de formulário não depende somente da interface.
- [x] Clínicas novas começam ocultas, perfil valida fuso/horários e publicação exige horário e serviço; dashboard orienta o primeiro setup.
- [x] CTA, reserva pública com feedback, estados de agenda, histórico de reserva, relatório mensal e ciclo básico de lembretes implementados.
- [x] Rotas de demonstração são 404 em produção; contas seed só autenticam em development com a flag explícita.
- [x] Cancelamento/reagendamento pelo paciente via link aleatório de uso exclusivo; hash armazenado, disponibilidade recalculada no servidor e alterações validadas em transação serializável.
- [x] README e este checklist atualizados com o comportamento de publicação e os limites ainda conhecidos.

### Falta para liberar o MVP

- [ ] Configurar envio real por e-mail da confirmação e do link de gestão; atualmente o paciente precisa guardar o link mostrado após reservar.
- [ ] Adicionar rate limit persistente e proteção anti-bot para reservas públicas.
- [ ] Completar agenda semanal (dias/feriados), edição de lembretes e substituir telas demonstrativas restantes por fluxos reais ou removê-las do MVP.
- [ ] Validar OAuth, webhooks Stripe e Cloudinary com credenciais/URLs do ambiente alvo; a suíte automatizada local já cobre autenticação, isolamento, reservas, estados, lembretes e limites/sincronização de planos.
- [ ] Concluir revisão legal, exclusão/exportação operacional, backup externo restaurável, monitoramento, deploy e auditoria dos módulos avançados antes de liberar acesso externo.
- [ ] Resolver as 5 vulnerabilidades reportadas por `npm audit --omit=dev` (1 moderada e 4 altas) sem atualização major não revisada do Next.js.
