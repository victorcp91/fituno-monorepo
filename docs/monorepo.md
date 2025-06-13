# 📁 Estrutura de Pastas do Monorepo - Fituno

Este documento descreve a estrutura de diretórios do monorepo `fituno`, que
abriga o aplicativo de treino físico composto por dois apps (cliente e
treinador), além de pacotes compartilháveis.

---

## 🗂️ Estrutura Geral

```
fituno/
├── apps/
│   ├── trainer-app/        # Web App: Plataforma do Treinador (Next.js + Tailwind + ShadCN)
│   └── client-app/         # Mobile App: Plataforma do Cliente (React Native + Expo + React Native Paper)
│
├── packages/
│   ├── types/              # Tipagens globais (User, Exercise, WorkoutPlan, etc.)
│   ├── utils/              # Funções auxiliares reutilizáveis
│   ├── services/           # Integrações: Supabase client, Stripe, notificações, etc.
│   └── constants/          # Paleta de cores, enums, textos fixos, regex, configurações globais
│
├── .github/                # Workflows do GitHub Actions (CI/CD, lint, test, etc.)
├── .env                    # Variáveis de ambiente (usado via dotenv)
├── README.md
└── package.json            # Gerenciado com Yarn Workspaces
```

---

## apps/client - Estrutura Interna (Expo)

```bash
apps/client/
├── assets/                  # Imagens, ícones e arquivos estáticos
├── components/              # Componentes próprios do app cliente usando React Native Paper
├── features/                # Módulos isolados por funcionalidade (ex: chat, treino, progresso)
├── hooks/                   # Hooks exclusivos do cliente
├── navigation/              # Configuração das rotas do React Navigation
├── screens/                 # Telas da aplicação
├── services/                # Serviços de API e integração
├── stores/                  # Zustand ou Context API
├── utils/                   # Helpers específicos do app cliente
├── i18n/                    # Setup local da internacionalização
├── config/                  # Configurações locais (ex: tema, constantes, cores)
├── types/                   # Tipos locais (se necessário)
└── App.tsx                  # Entry point do app Expo
```

---

## apps/trainer - Estrutura Interna (Next.js)

```bash
apps/trainer/
├── components/              # Componentes visuais usando shadcn/ui
├── features/                # Módulos funcionais (ex: clientes, treinos, dashboard)
├── hooks/                   # Hooks exclusivos da web
├── pages/                   # Páginas do Next.js (rotas)
├── public/                  # Arquivos estáticos
├── services/               # API clients (ex: Supabase, Stripe)
├── stores/                 # Zustand ou Context API
├── utils/                  # Helpers e funções auxiliares
├── i18n/                   # Setup local da internacionalização
├── config/                 # Configs locais e constantes
├── types/                  # Tipos locais
├── styles/                 # Estilos globais e Tailwind config
└── app/                    # Diretório App se usar App Router (Next 13+)
```

---

## Pacotes Compartilhados - Detalhes

- `packages/types`: será a principal fonte de verdade para as tipagens globais
  compartilhadas.
- `packages/utils`: funções puras, como formatadores, normalizadores,
  validadores.
- `packages/services`: conexão e clientes configurados para serviços externos.
- `packages/constants`: constantes globais e configurações compartilhadas.

---

## 📚 Conveções de Uso

### 1. Tipagens (packages/types)

- Toda tipagem global deve estar nesse pacote.
- Exemplo: `User`, `Trainer`, `WorkoutPlan`, `Exercise`, `Message`.

### 2. Utilitários (packages/utils)

- Funções de manipulação de datas, validações, formatações.
- Reaproveitáveis em ambos os apps.

### 3. Constantes (packages/constants)

- Exemplo: grupos musculares disponíveis, tempos padrão de descanso, lista de
  idiomas suportados, nomes de planos etc.

### 4. Serviços (packages/services)

- Conexão e clientes configurados para:
  - Supabase
  - Stripe
  - Firebase Messaging (Push Notifications)
  - Monitoramento de erros

---

## 🔄 Compartilhamento entre Apps

Utilize `Yarn Workspaces` e `TypeScript path aliases` para importar pacotes
compartilhados entre os apps.

Exemplo de importação:

```ts
import { WorkoutPlan } from '@fituno/types';
import { formatCurrency } from '@fituno/utils';
```

---

## 📦 Apps

### `trainer-app/` (Web - Next.js)

- Interface completa para treinadores
- Utiliza: ShadCN, Supabase Client, React Query, Stripe Integration
- UI Components específicos para web usando shadcn/ui

### `client-app/` (Mobile - Expo)

- Interface para execução de treinos, registro de progresso, comunicação com
  treinador
- Suporte a modo offline + cache de treinos
- UI Components específicos para mobile usando React Native Paper
- Utiliza: React Native Paper, Expo FileSystem, Notifications

---

## 🌐 Internacionalização

- Sistema i18n centralizado nos `packages/constants/i18n/`
- Textos carregados por namespace
- Exemplo: `login.json`, `workout.json`, `errors.json`

---

## 📸 Lottie Animations & Images

- Não serão importadas dinamicamente como JSON local
- Armazenadas em Supabase Storage
- Relacionamento via nome do arquivo com a tabela de exercícios

---

## 📝 Boas Práticas

- Evite duplicar código entre os apps
- Mantenha componentes UI específicos em cada app
- Utilize hooks globais compartilháveis (`useAuth`, `useTheme`) em
  `packages/utils/hooks`

---

## Diretrizes Adicionais

- **Testes obrigatórios:**

  - uso de pastas `tests/` por domínio.
  - Validação contínua com CI (GitHub Actions recomendado).

- **Componentes UI:**

  - Web: usar shadcn/ui
  - Mobile: usar React Native Paper
  - Manter componentes em seus respectivos apps

- **Organização por domínio:**

  - Dentro de `features/`, adotar estrutura por domínio funcional (ex: `chat/`,
    `workout/`, `client-management/`).

- **Versionamento:**
  - Cada pacote no `packages/` deve ter sua própria `package.json` com controle
    de versão independente (opcional).

---
