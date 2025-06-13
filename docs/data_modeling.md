# 📊 Modelagem de Dados - Fituno

## 1. Visão Geral

Este documento detalha a modelagem de dados do Fituno, identificando todas as
entidades necessárias para o funcionamento do sistema e seus relacionamentos. A
estrutura foi projetada para suportar tanto o app mobile (cliente) quanto o web
app (treinador).

## 2. Entidades Principais

### 2.1. Users (auth.users - Supabase)

```sql
-- Tabela gerenciada pelo Supabase Auth
users (
  id: uuid PRIMARY KEY,
  email: text UNIQUE NOT NULL,
  encrypted_password: text,
  confirmed_at: timestamptz,
  confirmation_sent_at: timestamptz,
  recovery_sent_at: timestamptz,
  email_change_sent_at: timestamptz,
  last_sign_in_at: timestamptz,
  raw_app_meta_data: jsonb,
  raw_user_meta_data: jsonb,
  created_at: timestamptz,
  updated_at: timestamptz,
  deleted_at: timestamptz,
  is_super_admin: boolean,
  phone: text,
  phone_confirmed_at: timestamptz,
  phone_change: text,
  email_change: text,
  banned_until: timestamptz,
  reauthentication_sent_at: timestamptz
)
```

### 2.2. Profiles

```sql
profiles (
  id: uuid PRIMARY KEY REFERENCES auth.users(id),
  type: enum('trainer', 'client') NOT NULL,
  full_name: text NOT NULL,
  avatar_url: text,
  timezone: text NOT NULL,
  language: text DEFAULT 'pt-BR',
  measurement_system: enum('metric', 'imperial') DEFAULT 'metric',
  terms_accepted_at: timestamptz,
  terms_version: text,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.3. Trainers

```sql
trainers (
  id: uuid PRIMARY KEY REFERENCES profiles(id),
  subscription_status: enum('free', 'pro', 'expired') DEFAULT 'free',
  subscription_id: text, -- Stripe subscription ID
  subscription_updated_at: timestamptz,
  max_clients: int DEFAULT 2, -- Limite do plano (2 para free, ilimitado para pro)
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.4. Clients

```sql
clients (
  id: uuid PRIMARY KEY REFERENCES profiles(id),
  current_trainer_id: uuid REFERENCES trainers(id),
  status: enum('pending', 'active', 'inactive') DEFAULT 'pending',
  latest_anamnesis_id: uuid,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.5. Client Trainer History

```sql
client_trainer_history (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id: uuid REFERENCES clients(id),
  trainer_id: uuid REFERENCES trainers(id),
  status: enum('active', 'inactive') NOT NULL,
  started_at: timestamptz NOT NULL DEFAULT now(),
  ended_at: timestamptz,
  created_at: timestamptz DEFAULT now()
)
```

### 2.6. Anamnesis Templates

```sql
anamnesis_templates (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id: uuid REFERENCES trainers(id),
  name: text NOT NULL,
  is_default: boolean DEFAULT false,
  questions: jsonb NOT NULL, -- Array de objetos com {id, type, text, options}
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.7. Anamnesis Responses

```sql
anamnesis_responses (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id: uuid REFERENCES clients(id),
  trainer_id: uuid REFERENCES trainers(id),
  template_id: uuid REFERENCES anamnesis_templates(id),
  answers: jsonb NOT NULL, -- Array de objetos com {question_id, answer}
  created_at: timestamptz DEFAULT now()
)
```

### 2.8. Exercises

```sql
exercises (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name: text NOT NULL,
  name_translations: jsonb, -- {en: "", es: "", pt: ""}
  description: text,
  description_translations: jsonb,
  type: enum('strength', 'isometric', 'plyometric', 'cardio_steady', 'cardio_interval', 'mobility', 'circuit') NOT NULL,
  muscle_group: text NOT NULL,
  sub_muscle_group: text,
  equipment: text[],
  animation_url: text, -- URL do Supabase Storage
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.9. Workout Plans

```sql
workout_plans (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id: uuid REFERENCES trainers(id),
  client_id: uuid REFERENCES clients(id),
  name: text NOT NULL,
  status: enum('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
  start_date: date NOT NULL,
  end_date: date,
  notes: text,
  equipment_checklist: text[],
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.10. Workout Sessions

```sql
workout_sessions (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id: uuid REFERENCES workout_plans(id),
  day_index: int NOT NULL, -- 0 = domingo, 1 = segunda, etc.
  name: text,
  notes: text,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now(),
  UNIQUE(plan_id, day_index)
)
```

### 2.11. Workout Exercises

```sql
workout_exercises (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id: uuid REFERENCES workout_sessions(id),
  exercise_id: uuid REFERENCES exercises(id),
  order_index: int NOT NULL,
  group_id: uuid, -- Para supersets/circuitos
  sets: int NOT NULL,
  reps_min: int,
  reps_max: int,
  load: decimal,
  duration_sec: int,
  rest_sec: int,
  tempo: text, -- Ex: "3-0-2-0"
  rpe: int,
  notes: text,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

### 2.12. Exercise Logs

```sql
exercise_logs (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id: uuid REFERENCES workout_exercises(id),
  client_id: uuid REFERENCES clients(id),
  set_number: int NOT NULL,
  reps_done: int,
  load_done: decimal,
  duration_sec: int,
  completed: boolean DEFAULT false,
  notes: text,
  synced: boolean DEFAULT true,
  performed_at: timestamptz NOT NULL DEFAULT now(),
  created_at: timestamptz DEFAULT now()
)
```

### 2.13. Messages

```sql
messages (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id: uuid REFERENCES clients(id),
  trainer_id: uuid REFERENCES trainers(id),
  sender_id: uuid REFERENCES profiles(id),
  content: text NOT NULL,
  exercise_id: uuid REFERENCES workout_exercises(id),
  read_at: timestamptz,
  created_at: timestamptz DEFAULT now()
)
```

### 2.14. Progress Media

```sql
progress_media (
  id: uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id: uuid REFERENCES clients(id),
  type: enum('photo', 'measurement') NOT NULL,
  url: text, -- URL do Supabase Storage
  metadata: jsonb, -- Medidas ou dados adicionais
  created_at: timestamptz DEFAULT now()
)
```

## 3. Políticas de Segurança (RLS)

### 3.1. Profiles

- Leitura: usuário autenticado pode ler seu próprio perfil
- Treinadores podem ler perfis de seus clientes vinculados
- Escrita: usuário só pode editar seu próprio perfil

### 3.2. Trainers/Clients

- Leitura: treinador vê apenas seus próprios dados e de seus clientes
- Cliente vê apenas seus próprios dados e do treinador atual

### 3.3. Workout Plans & Sessions

- Leitura: treinador vê apenas planos que criou
- Cliente vê apenas planos atribuídos a ele
- Escrita: apenas treinador pode criar/editar

### 3.4. Exercise Logs

- Leitura: treinador vê logs de seus clientes
- Cliente vê apenas seus próprios logs
- Escrita: cliente pode criar/editar seus logs

### 3.5. Messages

- Leitura/Escrita: apenas entre o par cliente-treinador envolvido

## 4. Índices Recomendados

```sql
-- Profiles
CREATE INDEX idx_profiles_type ON profiles(type);

-- Clients
CREATE INDEX idx_clients_trainer ON clients(current_trainer_id);
CREATE INDEX idx_clients_status ON clients(status);

-- Workout Plans
CREATE INDEX idx_workout_plans_trainer ON workout_plans(trainer_id);
CREATE INDEX idx_workout_plans_client ON workout_plans(client_id);
CREATE INDEX idx_workout_plans_status ON workout_plans(status);
CREATE INDEX idx_workout_plans_dates ON workout_plans(start_date, end_date);

-- Exercise Logs
CREATE INDEX idx_exercise_logs_client ON exercise_logs(client_id);
CREATE INDEX idx_exercise_logs_workout ON exercise_logs(workout_exercise_id);
CREATE INDEX idx_exercise_logs_performed ON exercise_logs(performed_at);

-- Messages
CREATE INDEX idx_messages_client_trainer ON messages(client_id, trainer_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

## 5. Observações Importantes

1. **Versionamento de Dados**

   - Anamneses são versionadas por data de criação
   - Planos de treino mantêm histórico via status
   - Vinculações cliente-treinador têm histórico próprio

2. **Dados Offline**

   - Campo `synced` em `exercise_logs` para controle
   - Dados essenciais cacheados localmente
   - Sincronização com retry em caso de falha

3. **Internacionalização**

   - Campos `*_translations` para textos multilíngue
   - Configuração de idioma por usuário
   - Fallback para pt-BR

4. **Timezone**

   - Armazenado por usuário
   - Datas UTC no banco
   - Conversão no frontend conforme timezone

5. **Soft Delete**
   - Implementado via status em vez de deleção
   - Preserva histórico e integridade referencial

## 6. Triggers e Funções

```sql
-- Atualiza latest_anamnesis_id do cliente
CREATE OR REPLACE FUNCTION update_client_latest_anamnesis()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clients
  SET latest_anamnesis_id = NEW.id
  WHERE id = NEW.client_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_latest_anamnesis
AFTER INSERT ON anamnesis_responses
FOR EACH ROW
EXECUTE FUNCTION update_client_latest_anamnesis();

-- Valida limite de clientes no plano gratuito
CREATE OR REPLACE FUNCTION validate_client_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT subscription_status = 'free'
    FROM trainers
    WHERE id = NEW.current_trainer_id
  ) AND (
    SELECT COUNT(*) >= 2
    FROM clients
    WHERE current_trainer_id = NEW.current_trainer_id
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Free plan limited to 2 active clients';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_client_limit
BEFORE INSERT OR UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION validate_client_limit();
```
