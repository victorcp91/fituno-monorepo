# Fituno Workspace Scripts

Este documento descreve os scripts disponíveis para desenvolvimento e build do
monorepo Fituno.

## Scripts de Desenvolvimento

### Desenvolvimento Completo

```bash
yarn dev
```

Inicia o desenvolvimento dos packages compartilhados e do trainer-app
simultaneamente.

### Desenvolvimento Individual

```bash
yarn dev:trainer    # Next.js trainer app
yarn dev:client     # Expo client app
yarn dev:packages   # Todos os packages compartilhados em watch mode
```

## Scripts de Build

### Build Completo

```bash
yarn build
```

Builda todos os packages compartilhados e depois os apps (ordem correta de
dependências).

### Build por Categoria

```bash
yarn build:packages  # Apenas packages compartilhados
yarn build:apps      # Apenas apps (trainer + client)
```

### Build Individual

```bash
yarn build:trainer   # Apenas trainer-app
yarn build:client    # Apenas client-app
```

## Scripts de Limpeza

### Limpeza Completa

```bash
yarn clean          # Remove dist, node_modules e cache
yarn reinstall      # Limpa tudo e reinstala dependências
```

### Limpeza por Categoria

```bash
yarn clean:packages  # Remove dist dos packages
yarn clean:apps      # Remove cache dos apps
```

## Scripts de Verificação

### Type Checking

```bash
yarn type-check          # Type check completo (builda packages primeiro)
yarn type-check:packages # Apenas packages
yarn type-check:apps     # Apenas apps
```

### Linting e Formatação

```bash
yarn lint            # Corrige problemas de lint automaticamente
yarn lint:check      # Apenas verifica lint sem corrigir
yarn format          # Formata código com Prettier
yarn format:check    # Verifica formatação sem alterar
```

### Testes

```bash
yarn test            # Executa todos os testes
yarn test:packages   # Apenas testes dos packages
yarn test:apps       # Apenas testes dos apps
```

## Estrutura de Dependências

Os scripts respeitam a ordem correta de dependências:

1. **Packages compartilhados** (types → constants → utils → services)
2. **Apps** (trainer-app, client-app)

### Packages Compartilhados

- **@fituno/types**: Tipos TypeScript compartilhados
- **@fituno/constants**: Constantes do sistema
- **@fituno/utils**: Utilitários e helpers
- **@fituno/services**: Serviços compartilhados (API, Auth, etc.)

### Apps

- **@fituno/trainer-app**: Aplicação web Next.js para personal trainers
- **@fituno/client-app**: Aplicação mobile Expo/React Native para clientes

## Fluxo de Desenvolvimento Recomendado

1. **Iniciar desenvolvimento**: `yarn dev`
2. **Fazer alterações** nos packages ou apps
3. **Verificar tipos**: `yarn type-check`
4. **Executar testes**: `yarn test`
5. **Verificar lint**: `yarn lint:check`
6. **Build para produção**: `yarn build`

## Troubleshooting

### Problemas de Importação

Se houver problemas com importações entre packages:

```bash
yarn clean:packages
yarn build:packages
```

### Problemas de Dependências

Se houver problemas com node_modules:

```bash
yarn reinstall
```

### Problemas de TypeScript

Se houver problemas de tipos:

```bash
yarn type-check:packages
yarn build:packages
yarn type-check:apps
```
