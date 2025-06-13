PRD - Fituno (MVP)

1. Visão Geral

Fituno é uma plataforma de treino físico com duas interfaces principais: um web
app para treinadores e um aplicativo mobile para alunos. O MVP é focado
exclusivamente na criação, execução e acompanhamento de treinos.

- Treinador: acessa via Web (Next.js + Supabase)
- Aluno: acessa via app mobile (Expo/React Native)
- Monetização: treinador paga para usar (plano gratuito até 2 clientes ativos;
  plano PRO com Stripe)

2. Funcionalidades Web - Treinador

A. Dashboard:

- Exibe alertas de clientes sem série, séries vencidas, treinos do dia, atalhos
  rápidos (Cadastrar Cliente / Criar Série).

B. Gestão de Clientes:

- Lista de clientes (filtros ativos/inativos), vínculo via convite por e-mail,
  inativação de cliente.

C. Builder de Treinos:

- **Criação diária visual (drag-and-drop):** cada coluna = dia da semana.<br>-
  **Drawer de Seleção de Exercícios:** filtros (grupo/sub-grupo muscular,
  equipamento, tipo, favoritos) e _search_.
- **Tipos de exercício suportados:**

1.  Strength / Resistido 2. Isométrico  3. Pliométrico/HIIT (reps)  4. Cardio
    Steady  5. Cardio Intervalo  6. Mobilidade/Flexibilidade  7. Circuito
    Composto (wrapper).

- **Modal de Parâmetros dinâmico** Campos básicos variam conforme o tipo (Sets,
  Reps, Carga, Tempo, Duração, Rest, Rounds…).<br> - Aba “Avançado” para Tempo
  de execução (3-0-2-0), RPE/RIR, notas.
- **Validações em tempo real:** intervalo aceitável de reps/carga, alerta de
  volume > 20 sets por músculo/semana, aviso de equipamento indisponível para o
  cliente.
- **Superset / Circuito:** criação por _drag over_ ou menu → gera `group_id`,
  badges “Superset A”, “Circuito 1”, campos Rounds/Inter-rest.
- **Cache local** das alterações até o botão **Salvar Série** (commita na tabela
  `workouts`).
- **Bloqueios de plano:** treinadores Free (> 2 clientes) impedidos de publicar
  a série; banner de upgrade.
- **Observações gerais da série** e **checklist automático de equipamentos**
  mantidos.

D. Chat com Cliente: Chat com Cliente:

- Comunicação 1:1
- Histórico por cliente (scroll para carregar)
- Menção direta ao exercício (em contexto)
- Sem WebSocket: push notification + trigger local atualiza badges

3. Funcionalidades Mobile - Aluno

A. Acesso via convite (e-mail), login com Supabase B. Anamnese obrigatória antes
de receber treinos C. Tela inicial dinâmica:

- Se não tem treino: mostra aviso
- Se treino do dia disponível: exibe lista de sessões
- Se treino já foi feito: mostra progresso e opções (refazer, adiantar,
  recuperar) D. Execução do treino:
- Interface por sessão (categorias: alongamento, força, cardio, HIIT,
  mobilidade)
- Marcar sets como concluídos, editar carga, iniciar cronômetro de descanso
- Registro automático de tempo total (exceto cardio) E. Histórico e Progresso:
- Por dia, por exercício (evolução de carga, repetições)
- Gráficos e melhores marcas F. Chat com treinador:
- Push notifications (FCM)
- Badge e banner via trigger local
- Envio de mensagens com menção a exercício

4. Anamnese Personalizada

- Modelo padrão de anamnese fornecido pelo sistema
- Treinador pode criar e salvar modelos próprios
- Escolha do modelo por cliente
- Requisição de nova anamnese possível a qualquer momento

5. Cadastro, Autenticação e Plano

- Cadastro e login via e-mail/senha ou login social (Google, Facebook etc. via
  Supabase), tanto para treinador quanto para cliente
- Verificação de e-mail e recuperação de senha automática
- Painel do treinador: editar dados, foto de perfil, ver plano, upgrade com
  Stripe
- Plano gratuito: até 2 clientes ativos
- Plano PRO: acesso ilimitado, pagamentos via Stripe
- Quando o plano expira:
- Treinador mantém acesso de leitura
- Bloqueado para criar séries, cadastrar clientes, enviar mensagens
- Banner de aviso no dashboard

6. Vinculação e Desvinculação

- Treinador só pode inativar clientes (não deletar)
- Cliente inativo vê aviso no app e perde acesso a treinos/chat
- Novo treinador pode vincular o mesmo cliente por e-mail
- App detecta e atualiza vínculo automaticamente

7. Casos Especiais e Edge Cases

Inclui:

- Cliente sem anamnese
- Série com data futura
- Série expirada sem nova
- Treino no dia de descanso
- Substituição e cancelamento de exercício
- Repetição ou adiantamento de treino
- Treinador inativando cliente para contornar limite
- Cliente acessando sem vínculo
- App desatualizado
- Fuso horário entre treinador e aluno
- Cliente treinando offline (sincronização futura)

8. Funcionalidades Adicionais

- Observações gerais em séries
- Checklist de equipamentos por treino
- Treino incompleto marcado no histórico
- Substituição de exercício registrada para o treinador

9. Stack Tecnológica

- Web: Next.js, shadcn/ui, Tailwind CSS, React Query, API Routes
- Mobile: Expo, React Native Paper, React Query, FCM, Virtualização com FlatList
- Backend: Supabase (auth, db, API), Stripe (pagamentos)
- Notificações: Firebase Cloud Messaging (FCM)
- Lottie para animações

10. Identidade Visual

- Nome: Fituno
- Paleta de cores:
- Azul primário: #2b85ff
- Verde: #11b683
- Amarelo: #dfb725
- Vermelho: #e34b51
- Estilo minimalista e moderno, baseado no logotipo oficial

11. Integração Treino + Chat

- Durante execução, aluno pode enviar mensagem com referência direta ao
  exercício atual
- Treinador recebe visual com ícone/nome do exercício no chat

12. Internacionalização

- Sistema preparado desde o MVP para múltiplos idiomas
- Suporte planejado para: PT-BR, EN-US, ES-ES
- Strings extraídas para arquivos de tradução
- Suporte a localização de preços por país
- Lançamento inicial: Brasil

13. Fluxo de Autenticação (Cliente e Treinador)

A. Login e Cadastro (via Supabase Auth):

- Login via e-mail/senha ou login social (Google, Facebook etc.)
- Cadastro cria conta no Supabase e dispara e-mail de verificação automático
- Até o e-mail ser verificado, o acesso à plataforma é bloqueado

B. Recuperação de Senha:

- Link de "Esqueci minha senha" disponível nas telas de login
- Supabase envia e-mail com link para redefinir senha

C. Redirecionamento após login:

- Cliente:
- Se não tem anamnese → redireciona para a tela de anamnese
- Se tem anamnese mas nenhum treinador → mensagem de “aguarde vínculo”
- Se tudo ok → redireciona para o treino do dia
- Treinador:
- Redireciona sempre para o dashboard principal

D. Expiração de Sessão e Logout:

- Sessão gerenciada pelo Supabase Auth com tokens de acesso/refresh
- Sessões podem ser invalidadas ao fazer logout ou por timeout
- Ao expirar, o usuário é redirecionado para a tela de login com aviso

E. Segurança e Proteção:

- Campos de login com proteção contra brute-force (gerenciado pelo Supabase)
- Dados sensíveis protegidos via SSL/TLS

14. Uso de Ícones e Componentes

A. Ícones:

- Web App (shadcn/ui):
- Utiliza Heroicons (já integrados na biblioteca)
- Quando necessário, importar ícones adicionais gratuitos como FontAwesome Free
- Mobile App (React Native Paper):
- Usa Material Community Icons via @expo/vector-icons
- Quando necessário, integrar FontAwesome via react-native-vector-icons

B. Componentes:

- Deve-se **priorizar o uso de componentes prontos das bibliotecas de UI
  escolhidas**:
- Web: shadcn/ui
- Mobile: React Native Paper
- Evitar a criação de componentes personalizados do zero quando houver
  alternativas equivalentes nas bibliotecas existentes
- Criar componentes customizados apenas quando não houver uma alternativa visual
  ou funcional adequada

Objetivo:

- Garantir consistência visual e comportamental em toda a aplicação
- Reduzir esforço de desenvolvimento e manutenção

15. Ajustes Estratégicos Adicionados ao MVP

1. Conclusão manual do treino:

- Cliente pode marcar treino como concluído mesmo sem executar todos os sets,
  para lidar com casos de esquecimento ou execução fora do app.

2. Filtros por status no dashboard do treinador:

- Dashboard exibirá filtros rápidos por status: sem anamnese, sem série ativa,
  treino vencido, clientes inativos.

3. Bloqueio de edição de série em andamento:

- Séries com data de início já passada não poderão ser editadas. Treinador
  poderá duplicar uma série existente para gerar uma nova versão.

4. Feedback do cliente pós-treino:

- Após concluir o treino, o cliente poderá avaliar (leve, ideal, pesado) e
  adicionar comentário textual opcional.

5. Dias de treino configuráveis livremente:

- Série pode conter treinos em qualquer combinação de dias (ex: Seg, Qua, Sex),
  sem necessidade de preencher todos os dias.

6. Substituição de exercício com sugestão automatizada:

- Ao substituir um exercício, o sistema mostrará apenas sugestões de exercícios
  com mesmo grupo/subgrupo muscular, equipamento e categoria compatível. Isso
  evita erro por parte do cliente.

7. Regras de integridade e proteção de dados:

- O sistema garantirá que não seja possível criar treino sem cliente vinculado.
- Inativações ou trocas de treinador não apagarão dados históricos.

16. Reutilização de Componentes Customizados

- Todo componente da biblioteca de UI (shadcn/ui ou React Native Paper) que for
  customizado visualmente ou funcionalmente deve ser abstraído em um componente
  reutilizável.
- Esses componentes devem ser armazenados em uma pasta de **componentes
  globais** no projeto, tanto para o Web App quanto para o App Mobile.
- Exemplo: se um botão do chat for estilizado com cores específicas, ícones ou
  comportamentos adicionais, ele deve ser salvo como `CustomChatButton` (ou
  similar) e reutilizado onde for necessário.
- Isso garante consistência visual, redução de retrabalho e facilita a
  manutenção.

17. Dados de Cadastro e Personalização

A. Dados do treinador no cadastro:

- Nome completo (obrigatório)
- E-mail (obrigatório)
- Senha ou login social (Google, Facebook etc. via Supabase)
- Avatar (opcional): pode ser carregado do login social, se disponível, ou
  atualizado manualmente a qualquer momento
- Foto e nome aparecem na interface do cliente e nas mensagens

B. Dados do cliente no cadastro (pelo treinador):

- Nome completo (obrigatório)
- E-mail (obrigatório)
- Idade (opcional, mas recomendado)
- Localização (cidade e país - opcional)
- Timezone (detecção automática via sistema operacional, usada para exibir datas
  e horários de treino corretamente tanto para treinador quanto cliente)

C. Personalização e edição:

- Treinador e cliente podem editar nome, avatar e outras informações no painel
  de gerenciamento de conta
- O sistema deve armazenar e utilizar corretamente o timezone de cada usuário
  para coordenar exibição de datas e treinos conforme sua região

18. Modelos de Anamnese

A. Modelo Padrão:

- O sistema oferece um modelo padrão de anamnese com perguntas baseadas nas mais
  usadas em academias e apps de treino.
- Exemplo de perguntas incluídas:
- Qual seu objetivo principal? (emagrecimento, hipertrofia, condicionamento,
  etc.)
- Já teve lesões ou cirurgias? (sim/não + descrição)
- Qual sua experiência com musculação? (iniciante, intermediário, avançado)
- Possui alguma limitação física?
- Faz uso de medicação?
- Quantos dias por semana pretende treinar?

B. Modelos Customizados:

- O treinador pode criar modelos próprios de anamnese.
- É possível adicionar, editar ou remover perguntas livremente.
- Cada modelo customizado pode ser salvo e reutilizado.

C. Seleção de Modelo por Cliente:

- Ao cadastrar ou editar um cliente, o treinador pode escolher qual modelo de
  anamnese aplicar (padrão ou customizado).
- O treinador também pode atualizar o modelo vinculado a um cliente.

D. Reenvio de Anamnese:

- O treinador pode solicitar que o cliente responda novamente a anamnese a
  qualquer momento.
- Essa ação reinicia o fluxo da anamnese para o cliente, que verá a nova versão
  ao acessar o app.

## 📎 Anexo I – Perguntas sugeridas para Anamnese (com opções selecionáveis)

1. Qual é seu objetivo com os treinos?

- ( ) Emagrecimento
- ( ) Hipertrofia
- ( ) Condicionamento físico
- ( ) Reabilitação física
- ( ) Manutenção da saúde
- ( ) Outro: \***\*\_\_\_\_\*\***

2. Qual é o seu nível atual de experiência com treino de força/musculação?

- ( ) Iniciante
- ( ) Intermediário
- ( ) Avançado

3. Você já pratica alguma atividade física atualmente?

- ( ) Sim
- ( ) Não

4. Com que frequência você pretende treinar por semana?

- ( ) 1x
- ( ) 2x
- ( ) 3x
- ( ) 4x
- ( ) 5x ou mais

5. Qual(is) grupo(s) muscular(es) você gostaria de dar mais ênfase? (Escolha
   até 3)

- ( ) Peitoral
- ( ) Costas
- ( ) Pernas
- ( ) Glúteos
- ( ) Bíceps
- ( ) Tríceps
- ( ) Ombros
- ( ) Abdômen

6. Você já sofreu alguma lesão ou possui alguma limitação física? Se sim,
   indique a área afetada.

- ( ) Coluna
- ( ) Ombro
- ( ) Joelho
- ( ) Tornozelo
- ( ) Cotovelo
- ( ) Quadril
- ( ) Não possuo lesões ou limitações

7. Você possui alguma condição médica diagnosticada que o treinador precisa
   saber?

- ( ) Hipertensão
- ( ) Diabetes
- ( ) Problemas cardíacos
- ( ) Nenhuma condição conhecida
- ( ) Outro: \***\*\_\_\_\_\*\***

8. Qual é o melhor horário do dia para você treinar?

- ( ) Manhã
- ( ) Tarde
- ( ) Noite
- ( ) Varia de acordo com o dia

9. Tem acesso a qual tipo de estrutura?

- ( ) Academia completa
- ( ) Academia com equipamentos limitados
- ( ) Espaço com halteres e acessórios
- ( ) Apenas peso corporal (em casa/parques)

10. Está disposto(a) a seguir treinos com foco em mobilidade e/ou reabilitação
    complementar?

- ( ) Sim
- ( ) Não
