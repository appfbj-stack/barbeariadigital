# 🚀 Configuração do Supabase para BarberTime+

## 📋 Pré-requisitos
- Conta no Supabase (gratuita): https://supabase.com
- Projeto BarberTime+ já configurado localmente

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: `barbeariadigital` ou `barbertime-plus`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America)
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

### 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: https://xxxxxxxxxxx.supabase.co)
   - **anon public** key (chave pública)

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e preencha:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica_anonima_aqui
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```

### 4. Criar Tabelas do Banco de Dados

No painel do Supabase, vá em **SQL Editor** e execute os seguintes comandos:

#### 4.1 Tabela de Barbeiros
```sql
CREATE TABLE barbeiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especialidades TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_barbeiros_updated_at BEFORE UPDATE
ON barbeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4.2 Tabela de Serviços
```sql
CREATE TABLE servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  categoria VARCHAR(50) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE
ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4.3 Tabela de Agendamentos
```sql
CREATE TYPE status_agendamento AS ENUM ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado');

CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome VARCHAR(100) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_email VARCHAR(100),
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id),
  servico_id UUID NOT NULL REFERENCES servicos(id),
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  status status_agendamento DEFAULT 'agendado',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE
ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_agendamentos_barbeiro ON agendamentos(barbeiro_id);
CREATE INDEX idx_agendamentos_servico ON agendamentos(servico_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
```

### 5. Inserir Dados Iniciais

#### 5.1 Barbeiros de Exemplo
```sql
INSERT INTO barbeiros (nome, especialidades, ativo) VALUES
('João Silva', ARRAY['Corte Masculino', 'Barba', 'Bigode'], true),
('Maria Santos', ARRAY['Corte Feminino', 'Escova', 'Hidratação'], true),
('Pedro Costa', ARRAY['Corte Masculino', 'Barba', 'Sobrancelha'], true);
```

#### 5.2 Serviços de Exemplo
```sql
INSERT INTO servicos (nome, descricao, preco, duracao, categoria, ativo) VALUES
('Corte Masculino', 'Corte de cabelo masculino tradicional', 25.00, 30, 'Corte', true),
('Corte + Barba', 'Corte de cabelo + barba completa', 35.00, 45, 'Combo', true),
('Barba', 'Aparar e modelar barba', 15.00, 20, 'Barba', true),
('Corte Feminino', 'Corte de cabelo feminino', 40.00, 60, 'Corte', true),
('Escova', 'Escova modeladora', 20.00, 30, 'Tratamento', true),
('Sobrancelha', 'Design de sobrancelha', 10.00, 15, 'Estética', true);
```

### 6. Configurar Políticas de Segurança (RLS)

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (dados básicos)
CREATE POLICY "Barbeiros são visíveis para todos" ON barbeiros
FOR SELECT USING (ativo = true);

CREATE POLICY "Serviços são visíveis para todos" ON servicos
FOR SELECT USING (ativo = true);

-- Políticas para agendamentos (mais restritivas)
CREATE POLICY "Agendamentos são visíveis para todos" ON agendamentos
FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode criar agendamentos" ON agendamentos
FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar agendamentos" ON agendamentos
FOR UPDATE USING (true);
```

### 7. Testar Conexão

Após configurar tudo, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação deve conectar automaticamente ao Supabase e carregar os dados reais!

## 🔍 Verificação

Para verificar se tudo está funcionando:

1. Abra o console do navegador (F12)
2. Não deve haver erros de conexão com Supabase
3. Os dados dos barbeiros e serviços devem aparecer na aplicação
4. Teste fazer um agendamento

## 🆘 Solução de Problemas

### Erro de Conexão
- Verifique se as URLs e chaves estão corretas no `.env.local`
- Confirme se o projeto Supabase está ativo

### Dados não Aparecem
- Verifique se as tabelas foram criadas corretamente
- Confirme se os dados iniciais foram inseridos
- Verifique as políticas RLS

### Erro de CORS
- Nas configurações do Supabase, vá em **Authentication** → **URL Configuration**
- Adicione `http://localhost:3000` nas URLs permitidas

## 📚 Próximos Passos

Após a configuração básica:
1. ✅ Implementar autenticação de usuários
2. ✅ Adicionar validações de dados
3. ✅ Configurar notificações em tempo real
4. ✅ Implementar backup automático
5. ✅ Configurar monitoramento

---

**💡 Dica**: Mantenha sempre um backup das suas configurações e dados importantes!