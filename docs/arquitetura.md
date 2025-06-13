# 📐 Documentação de Arquitetura Técnica – Fituno

## 1. Visão Geral da Arquitetura

Fituno é dividido em dois aplicativos principais:

- **App do Treinador (Web):** construído com Next.js + ShadCN UI.
- **App do Cliente (Mobile):** construído com Expo + React Native Paper.

Ambos compartilham lógica e tipos via **monorepo com Yarn Workspaces**.

Arquitetura baseada em:

- Frontends conectando com backend via API Routes do Next.js.
- Backend se comunica com o banco de dados Supabase (auth, storage e realtime
  inclusos).

## 2. Estrutura de Diretórios

```
fituno-monorepo/
├── apps/
│   ├── client/          # App React Native do cliente
│   ├── trainer/         # App Next.js do treinador
├── packages/
│   ├── types/           # Tipagens e Zod schemas compartilhados
│   ├── utils/           # Funções utilitárias reutilizáveis
│   ├── i18n/            # Traduções por idioma (pt, en, es)
```

## 3. Fluxos Principais

### Autenticação

- Supabase Auth (email/senha + login social)
- JWT armazenado localmente e enviado via header/autorização
- Verificação de e-mail com sistema automático do Supabase

### Anamnese

- Modelos prontos + customização por treinador
- Cliente responde no onboarding ou por solicitação do treinador

### Criação e Atribuição de Treinos

**Workflow Builder:**

- Treinador clica “➕ Adicionar exercício” ➜ abre `ExercisesDrawer`.
- Seleciona 1 ou N exercícios; cada seleção dispara `ExerciseParamsModal` que
  renderiza formulário baseado em `exercise_type`.
- Ao salvar, front gera payload: ts{ workout_id, day_index, exercise_id,
  exercise_type, sets: number, reps_min?: number, reps_max?: number, load?:
  number }

  | Tipo                        | Campos obrigatórios                       | Campos avançados                |
  | --------------------------- | ----------------------------------------- | ------------------------------- |
  | Strength / Resistido        | sets, reps, load, rest                    | tempo, RPE/RIR, notes           |
  | Isométrico                  | sets, duration_sec, rest                  | RPE, notes                      |
  | Pliométrico / HIIT (reps)   | sets, reps, rest                          | RPE, notes                      |
  | Cardio – Steady             | time_min **ou** distance_km/mi, intensity | incline/level, notes            |
  | Cardio – Intervalo          | rounds, work_sec, rest_sec                | warmup_sec, cooldown_sec, notes |
  | Mobilidade / Flexibilidade  | sets, hold_sec, rest, sides               | notes                           |
  | Circuito Composto (wrapper) | group_id, rounds, inter_rest_sec          | —                               |

### Execução de Treino

- Cronômetro, substituição de exercício com sugestão automática por
  grupo/subgrupo muscular
- Marcação de repetições, pesos e tempo
- Progresso sincronizado e armazenado em tempo real

### Chat

- Pooling otimizado + push notification
- Vinculação de mensagens a exercícios específicos

### Pagamento / Plano

- Integração com Stripe
- Limite de clientes no plano gratuito
- Bloqueio parcial de funções se plano expira

## 4. Banco de Dados (Supabase)

### Tabelas principais

- users (auth)
- trainers, clients
- workouts, workout_sessions
- exercises, exercise_logs
- messages
- anamnesis_templates, anamnesis_responses
- subscriptions, plans

### Estratégias

- Versionamento de séries
- Controle de acesso com RLS
- Filtro por timezone nas queries de treino

## 5. Internacionalização (i18n)

- Arquivos `.json` por idioma em `packages/i18n`
- Sistema multilíngue desde o MVP: pt-BR (padrão), en, es
- Exibição de datas formatada pelo fuso do usuário

## 6. Otimizações e Performance

- React Query para cache, revalidação e mutation
- Virtualização de listas longas
- Suspense e loading global
- Componentes globais em pasta `packages/ui`

## 7. Segurança e Permissões

- RLS (Row Level Security) no Supabase para dados sensíveis
- Middleware em rotas Next.js para controle de sessão e plano
- Proteção por tipo de usuário (cliente/treinador)

## 8. Estratégia de Notificação

- Pooling leve e inteligente para chat
- Push Notifications para novas mensagens (Firebase ou Supabase edge functions)
- Notificações internas: plano expirado, nova anamnese, treino disponível

## 9. Padrões e Convenções

- Código e banco: **Inglês**
- Documentação e interface com usuário: **Português (padrão), com suporte
  multilíngue**
- Componentes customizados são globais e reaproveitados em ambos os apps

---

## 🔁 Futuras decisões arquiteturais serão registradas como ADRs individuais.

## 10. Estratégia para Animações (Lottie JSON)

### Visão Geral

A aplicação conta com aproximadamente 600 arquivos de animações em formato
`.json` (Lottie), utilizados para exibir a execução de exercícios.

### Decisão Técnica

Os arquivos **não serão embutidos diretamente nos apps**. Em vez disso, serão
**armazenados e servidos pelo Supabase Storage**, com links diretos salvos no
banco de dados.

### Justificativa

- Evita que os apps (web e mobile) fiquem excessivamente pesados
- Permite carregamento dinâmico e sob demanda, aumentando a performance
- Possibilita manutenção e escalabilidade (inclusão de novos exercícios sem
  rebuild)
- O Supabase oferece CDN integrado e controle de cache via headers

### Justificativa

- Muitas academias não possuem Wi-Fi confiável, exigindo operação offline.
- A ausência de internet não deve impedir o treino do cliente.
- Suporte local será limitado aos dados mínimos para execução de treinos.
- A sincronização será feita de forma resiliente assim que a conexão for
  restabelecida.

---

### Detalhes de Implementação

- Arquivos `.json` serão organizados por categorias ou IDs no Supabase Storage.
- Cada exercício terá no banco um campo `animation_url` apontando para o
  arquivo.
- Ao renderizar um exercício, os apps utilizarão essa URL para carregar a
  animação no componente Lottie.

### Otimizações por Plataforma

**App do Treinador (Web):**

- Animações em listas serão carregadas com lazy-loading e virtualização (ex:
  `react-virtual`)
- Animações completas só são carregadas em modais ou views detalhadas

**App do Cliente (Mobile):**

- Será utilizado pré-carregamento dos `.json` referentes aos treinos da semana
- Nas listagens, as animações Lottie em `.json` serão exibidas diretamente, dado
  que são leves e otimizadas
- Lottie será exibido apenas no momento da execução do exercício
- Pode ser usado `expo-file-system` para cache local temporário

### Segurança

- Os arquivos `.json` podem ser públicos, pois não contêm dados sensíveis
- Para proteção contra scraping massivo, pode-se usar nomes de arquivos
  ofuscados (ex: UUID)

### Segurança

- Sessões expiram automaticamente com Supabase.
- Middleware no Next.js protege rotas privadas.
- Redirecionamento automático para login em caso de sessão inválida.

---

### Segurança

- Os dados de assinatura e status serão gravados em tabela separada
  (`subscriptions`) no Supabase.
- Apenas o backend poderá alterar o status de plano com base no retorno do
  Stripe.

### Observações Adicionais

- As animações serão mantidas em `.json` sem conversão para `.webp`, pois os
  arquivos são leves e o sistema contará com otimizações como virtualização e
  carregamento sob demanda

### Evitar

- Importar dinamicamente arquivos locais `.json` no frontend (quebra os
  bundlers)
- Embutir todos os arquivos dentro do bundle dos apps

## 11. Armazenamento e Sincronização de Dados do Cliente (App Mobile)

### Estratégia

- Todos os dados são sincronizados com o Supabase via React Query.
- O cache será utilizado para manter estado entre sessões.
- **Suporte offline será incluído no MVP** para garantir uso em academias sem
  internet.
- Os dados essenciais (treinos da semana, progresso local, status de execução)
  serão armazenados localmente com `expo-sqlite` ou `AsyncStorage`.
- Sincronização ocorrerá automaticamente quando a internet estiver disponível.

### Estratégia

- Token JWT fornecido pelo Supabase Auth será utilizado como chave de sessão.
- Web (treinador): token armazenado como cookie httpOnly.
- Mobile (cliente): token armazenado com `SecureStore` do Expo.

### Estratégia

- Chamadas via React Query encapsuladas com `isLoading`, `isError`, `isSuccess`.
- Skeletons ou spinners nos principais pontos da UI (dashboard, treino, chat).
- Feedback visual em:
  - Envio de mensagem no chat
  - Marcação de exercício como concluído
  - Substituição de exercício

---

### Estratégia

- Utilização de React Query com `queryKey` por endpoint.
- Invalidação inteligente após mutações:
  - Ex: envio de anamnese → atualiza status do cliente e tela de treino.
- Pre-fetch de treinos futuros ao carregar o treino atual.

---

### Estratégia

- Stack Navigation + Bottom Tabs com React Navigation.
- Tela inicial depende do status do cliente:
  - Sem anamnese respondida → redireciona para tela de anamnese
  - Com treino disponível → redireciona para treino do dia
  - Com treino executado → exibe dashboard de progresso

### Estratégia

- Toda a lógica de acesso será controlada via **RLS (Row Level Security)** do
  Supabase.
- Treinadores só poderão acessar dados de clientes vinculados ao seu `user_id`.
- Clientes só poderão ver dados dos seus treinos, progresso e mensagens com seu
  treinador.

### Estratégia

- React Query será usado com `queryKey` bem definidos para cada entidade (ex:
  `["workouts", client_id]`).
- Mutations invalidam apenas os caches relevantes, evitando refetch global.
- Treinos futuros serão pré-carregados para uso offline.

### Estratégia

- Stripe será usado para checkout e assinatura mensal do plano PRO dos
  treinadores.
- Webhooks do Stripe serão consumidos pela API do Next.js
  (`/api/webhooks/stripe`) para atualizar o status do plano.

## 12. Ajustes Identificados na Revisão Final

### 12.1. Controle de Consistência Offline

- Cada progresso salvo offline será marcado com um `synced: false` e timestamp
  local.
- Ao reconectar, o app sincroniza com o Supabase.
- Conflitos serão resolvidos por política de "último envio vence" no MVP.
- Futuramente, poderá haver merge mais sofisticado ou revisão manual.

### 12.2. Fallback para Animações

- Se a animação falhar (404, timeout, erro de JSON), será exibido um ícone de
  exercício genérico com opção de "tentar novamente".
- Erros de carregamento serão logados localmente.

### 12.3. Limpeza de Dados Locais Obsoletos

- Treinos locais com status "expirado" (fora da data de validade) serão
  automaticamente removidos após 7 dias.
- Caso o cliente mude de treinador, os dados locais antigos são imediatamente
  descartados.

### 12.4. Execução em Dias Não Planejados

- Cada treino terá: `scheduled_date` e `performed_date`.
- Cliente pode recuperar treinos perdidos ou antecipar treinos futuros.
- Treinador terá visibilidade clara de execução fora do planejado.

### 12.5. Gerenciamento Mínimo de Conta no App do Cliente

- App do cliente terá seção de "Minha Conta" com opções para:
  - Logout
  - Visualizar e-mail
  - Alterar foto de perfil (opcional)
  - Ver timezone atual detectado

### 12.6. Idioma Padrão e Fallback

- O app detecta o idioma do sistema do dispositivo.
- Caso idioma não esteja disponível, usará pt-BR como fallback.
- Futuramente, o idioma poderá ser alterado manualmente.

### 12.7. Restrições no Plano Gratuito (Limite de Clientes Vinculados)

- O treinador pode ter até dois clientes vinculados, **independentemente do
  status (ativo/inativo)**.
- Tentativas de adicionar um terceiro cliente serão bloqueadas com notificação.
- Ao excluir um cliente do sistema (futuramente), a vaga será liberada.

## 13. Permissões e Controle de Acesso

### Regras Específicas

- Exercícios da biblioteca serão globais e gerenciados apenas por
  administradores (via Supabase diretamente).
- Treinadores não poderão ver clientes de outros treinadores, mesmo que
  inativos.
- Supabase Auth será integrado com regras personalizadas por role (`client`,
  `trainer`, `admin` futura).

---

## 14. Cache Inteligente com React Query

### Mecanismos

- `staleTime` configurado de acordo com o tipo de dado:
  - Exercícios: 24h (não mudam com frequência)
  - Treinos: 5 min
  - Chat: 10s quando ativo

### Revalidação

- `refetchOnWindowFocus`: ativado apenas para telas críticas como dashboard do
  treinador.
- `retry`: ativado para falhas leves (ex: conexão instável), desativado em erros
  críticos.

---

## 15. Integração com Stripe

### Comportamentos

- Treinadores no plano gratuito: limite de até 2 clientes vinculados.
- Plano expirado ou cancelado:
  - Treinador pode ver os dados existentes
  - Não pode adicionar novos treinos, clientes ou enviar mensagens
  - Banner informativo persistente no dashboard

##16. Termos de Uso e Política de Privacidade

### Estratégia Técnica

- Ambas as plataformas (cliente e treinador) exibirão os Termos de Uso e a
  Política de Privacidade no primeiro acesso.
- O usuário deverá rolar o conteúdo até o fim e aceitar explicitamente antes de
  continuar usando a aplicação.
- O aceite será registrado na tabela de usuários (`terms_accepted_at`:
  timestamp).

### Armazenamento

- A flag `terms_accepted_at` será obrigatória para liberar o uso do app.
- Essa flag será usada para redirecionar o usuário automaticamente para a tela
  de aceite, caso não tenha aceitado ainda.

### Reexibição (futuro)

- Caso os termos sejam atualizados, será possível resetar a flag via backend e
  forçar nova leitura/aceite.
- O Supabase poderá armazenar o histórico de aceite com versão, se necessário.

### Acesso Permanente

- Um link para visualizar os Termos e a Política será disponibilizado nas telas
  de "Minha Conta" tanto no app cliente quanto no painel do treinador.

### Estrutura

- Os textos legais ficarão hospedados como arquivos Markdown no repositório e/ou
  página web pública (ex: `https://fituno.com/legal/terms`).

## 17. ADR - Controle de Aceite Legal (Termos e Política)

### Decisão

Os Termos de Uso e a Política de Privacidade serão exibidos em uma **única
tela** durante o primeiro acesso do usuário (cliente ou treinador). O aceite
será obrigatório e versionado.

### Motivações

- Simplificação da jornada de onboarding.
- Cumprimento de obrigações legais relacionadas à coleta de dados sensíveis.
- Redução de fricção ao centralizar os dois documentos em uma tela única.

### Implementação

- Os arquivos de Termos e Política serão disponibilizados como conteúdo HTML ou
  Markdown processado, com rolagem obrigatória.
- O sistema armazenará `terms_accepted_at` e `terms_version` para cada usuário.
- Versões futuras dos termos poderão invalidar o aceite anterior, forçando o
  usuário a aceitar novamente.

### Versão Inicial

- Versão dos documentos: 1.0
- Armazenados localmente e acessíveis por link estático ou CDN.
- Link de acesso permanente nas configurações do usuário.

## 18. Observações Finais e Casos Complementares

### 1. Timezone e Treinos Agendados

- O sistema armazenará o timezone de cada cliente para garantir que a
  visualização dos treinos seja precisa tanto para o cliente quanto para o
  treinador.
- O dashboard do treinador exibirá os horários dos treinos no horário local do
  cliente.

### 2. Confirmação e Status de Mensagens (Cliente)

- Ao enviar mensagens no app cliente, especialmente no modo offline, o usuário
  verá indicadores como:
  - "Enviando..."
  - "Erro ao enviar, tente novamente"
- As mensagens não enviadas serão reprocessadas quando a conexão for
  restabelecida.

### 3. Upload de Avatar com Login Social

- Caso o login social traga uma imagem de perfil, ela será usada como padrão
  inicial.
- O usuário (cliente ou treinador) poderá **alterar a imagem de perfil a
  qualquer momento** manualmente nas configurações.

### 4. Exclusão de Conta

- A exclusão de conta será realizada mediante solicitação por e-mail.
- Um texto claro estará disponível na política de privacidade explicando como
  realizar esse pedido.
- No futuro, poderá haver funcionalidade de exclusão direta no app.

### 5. Dispositivos Compartilhados

- O app limpará o cache e sincronização offline ao realizar logout para evitar
  conflitos de dados entre usuários diferentes num mesmo dispositivo.

### 6. Backup Local de Progresso

- O progresso salvo localmente (modo offline) será sincronizado com o backend
  assim que o dispositivo estiver online.
- Caso o app seja desinstalado antes da sincronização, os dados poderão ser
  perdidos.
- Sugestão futura: backup local seguro com persistência criptografada.

## 19. Integração de Anamnese com a Montagem de Treino

Durante o processo de montagem de treinos pelo treinador, será exibido um bloco
fixo (sticky card ou painel lateral) com as informações relevantes do cliente
extraídas da anamnese. Este painel deve conter:

- Nome e idade do cliente
- Nível de treinamento (iniciante, intermediário, avançado)
- Frequência semanal desejada
- Grupos musculares com foco desejado (ênfase)
- Histórico de lesões

Esses dados são exibidos como **contexto informativo** e não impactam
diretamente na filtragem ou classificação dos exercícios na interface. O
treinador continua com controle total sobre a seleção, sendo apenas alertado
visualmente (de forma sutil) sobre pontos de atenção.

Nenhuma marcação será feita automaticamente sobre os exercícios listados. A
responsabilidade de escolha continua sendo do treinador.

Este modelo evita sobrecarregar visualmente a tela de montagem com alertas
automáticos e respeita a autonomia do profissional.

## 20. Edge Cases Complementares (Atualização Final)

### 1. Alteração de Foto de Perfil após Login Social

- Mesmo que o usuário tenha se autenticado via login social e sua foto tenha
  sido carregada automaticamente, ele pode substituí-la manualmente a qualquer
  momento. O sistema deve sobrescrever a imagem atual.
- Edge case: se o login social for utilizado novamente após alteração manual,
  **não deve sobrescrever a imagem personalizada.**

### 2. Nova Vinculação de Cliente por Outro Treinador

- Se um cliente for vinculado por um treinador novo usando o mesmo e-mail:
  - O vínculo anterior se torna inativo.
  - O app do cliente deve reconhecer a troca e atualizar automaticamente os
    dados exibidos (treinos, anamnese, chat).
  - Edge case: se o cliente tinha anamnese antiga com treinador anterior, ela
    não deve ser reutilizada com o novo treinador. Nova anamnese deve ser
    solicitada.

### 3. Mudança no Modelo de Anamnese do Treinador

- Caso o treinador altere o modelo de anamnese após o cliente já ter preenchido
  a anterior:
  - O sistema **não solicita novamente** automaticamente.
  - Edge case: treinador pode forçar nova resposta manualmente — nesse caso, é
    gerado novo histórico (versão).

### 4. Atualização de Termos de Uso e Política

- Sempre que houver nova versão dos termos ou política, a próxima vez que o
  usuário abrir o app, ele deve ser redirecionado para tela de aceite.
- Edge case: se o app estiver em modo offline, a nova versão dos termos só é
  exigida após sincronização online ser possível.

### 5. Internacionalização e Idioma Preferido

- Sistema deve carregar os textos na língua do dispositivo (português, inglês,
  espanhol).
- Edge case: se a língua não estiver disponível, o idioma padrão será português.
- Edge case 2: app precisa ser capaz de mudar dinamicamente de idioma via
  configuração do usuário (sem reinício completo).

### 6. Offline e Animações

- Os arquivos de exercícios (Lottie JSON) devem estar acessíveis offline.
- Edge case: se o app for reinstalado e não houver conexão, ele deve exibir
  alerta de que os exercícios não estão disponíveis.
- Edge case 2: sincronização de progresso feito offline precisa ser feita com
  tolerância para conflitos.

### 7. Chat no Contexto de Exercício

- Durante um exercício, o cliente pode abrir o chat diretamente com o exercício
  vinculado.
- Edge case: se o exercício for removido da série pelo treinador antes da
  sincronização da mensagem, a referência ao exercício deve cair em fallback
  ("exercício anterior não disponível").

## 🔍 Revisão Final e Edge Cases Adicionais (v4)

### 1. Evolução e Progresso do Cliente

- Imagens enviadas para comparativos serão otimizadas no frontend ou backend
  antes de upload (compressão/redimensionamento).
- Imagens muito grandes devem ser redimensionadas automaticamente ou recusadas
  com aviso.

### 2. Vinculação de Exercício ao Chat

- Edge Case: Cliente tenta enviar dúvida vinculada a um exercício já removido da
  série → exibir fallback com aviso "Exercício não disponível".

### 3. Autorização de Termos de Uso

- Versões dos termos são controladas por `terms_version` e `terms_accepted_at`.
- Edge Case: Usuário com app offline e termos desatualizados deve visualizar
  aviso e operar em modo restrito até sincronizar.
- Mudança de termos invalida versão anterior no próximo login.

### 4. Internacionalização (i18n)

- Todos os objetos compartilhados entre cliente e treinador (exercícios,
  categorias, filtros) devem conter textos multilíngues, ex:
  `name_translations`.
- Edge Case: Idiomas distintos entre treinador e cliente → garantir
  compatibilidade na exibição e entendimento.

### 5. Otimizações Offline

- App deve mostrar aviso claro caso não consiga funcionar offline por falta de
  cache.
- Sincronização offline deve ser feita com retries exponenciais, evitando
  sobrecarga nas APIs do Supabase.

### 6. Cadastro - Dados Essenciais

- Treinadores devem informar: nome, email, senha/login social, foto/avatar
  (editável a qualquer momento), timezone (detectado e armazenado).
- Edge Case: Usuário altera timezone → todas as datas exibidas devem refletir
  novo fuso.

### 7. Anamnese

- A UI deve priorizar uso de componentes de seleção (radio, checkbox, dropdown)
  para minimizar digitação.
- Edge Case: Treinador altera modelo de anamnese após resposta do cliente → uma
  nova versão é salva sem sobrescrever dados anteriores.

## 🔁 Atualizações Arquiteturais

### 🌐 Internacionalização (i18n)

- Será utilizada a biblioteca `i18next`:
  - **Next.js**: `react-i18next` com `next-i18next` (v13.2.4)
  - **Expo (React Native)**: `react-i18next` com fallback para
    `expo-localization` (v11.18.6)
- Estrutura de pastas `/locales/{lang}/common.json`
- Os textos da aplicação serão carregados dinamicamente.
- Idioma padrão: `pt-BR`
- Idioma pode ser alterado manualmente pelo usuário em tela de configurações.

### ⚖️ Unidades de Medida

- Aplicação preparada para múltiplas unidades:
  - Peso: kg / lb
  - Distância: km / mi
- Configurável pelo usuário manualmente.
- Configurações salvas no perfil do usuário.

### 🧾 Termos de Uso e Política de Privacidade

- Apresentadas ao usuário no primeiro login.
- Aceitação obrigatória para usar o app.
- Exibidas em tela única.
- Caso atualizadas, o app forçará nova aceitação na próxima sessão.
- Registros salvos em Supabase (data de aceite, versão).

### 🖼️ Upload de Imagens de Progresso

- Usuário pode fazer upload de fotos e medições corporais.
- Treinador também poderá acessar e acompanhar.
- Imagens serão otimizadas antes do envio ao storage (compressão automática).
- Formato final: `.jpg` ou `.webp` conforme compressão, nunca `.json`.

### 👤 Foto de Perfil

- Se login social for usado, tentamos capturar a imagem do provedor (Google,
  Apple, etc.).
- Mesmo com isso, o usuário pode alterar a foto a qualquer momento.
- Aplicável tanto a treinadores quanto a clientes.

### 🛠️ Organização Modular

- Uso de pasta `shared` dentro do monorepo para compartilhar:
  - Tipagens (TypeScript)
  - Helpers e utils
  - Validações e schemas
  - Traduções e constantes

### 🧪 Otimização de Imagens de Progresso (Back-end)

- As imagens enviadas pelo cliente ou treinador (como fotos de progresso)
  **serão processadas na API do Next.js** antes de serem armazenadas no
  Supabase.
- Esse processamento garante:
  - Compressão inteligente (qualidade x tamanho)
  - Conversão para formatos otimizados como `.webp` ou `.jpeg`
  - Redimensionamento, se necessário (ex: largura máxima de 1280px)
- Utilização de bibliotecas como [`sharp`](https://github.com/lovell/sharp)
  (v0.33.x) para manipulação de imagem no backend.
- Após o processamento, o arquivo otimizado será armazenado no **Supabase
  Storage**, vinculado ao usuário no banco de dados.
