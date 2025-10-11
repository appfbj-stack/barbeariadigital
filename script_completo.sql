-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  especialidades TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  duracao INTEGER NOT NULL, -- duração em minutos
  categoria TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  barbeiro_id UUID REFERENCES barbeiros(id),
  servico_id UUID REFERENCES servicos(id),
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'confirmado',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de informações da loja
CREATE TABLE IF NOT EXISTS shop_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  horario_funcionamento JSONB,
  redes_sociais JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir barbeiros de exemplo
INSERT INTO barbeiros (nome, especialidades, ativo) VALUES
('João Silva', ARRAY['Corte Masculino', 'Barba', 'Bigode'], true),
('Maria Santos', ARRAY['Corte Feminino', 'Escova', 'Hidratação'], true),
('Pedro Costa', ARRAY['Corte Masculino', 'Barba', 'Sobrancelha'], true),
('Ana Oliveira', ARRAY['Corte Feminino', 'Coloração', 'Tratamentos'], true)
ON CONFLICT (id) DO NOTHING;

-- Inserir serviços de exemplo
INSERT INTO servicos (nome, descricao, preco, duracao, categoria, ativo) VALUES
('Corte Masculino', 'Corte de cabelo masculino tradicional com acabamento', 25.00, 30, 'Corte', true),
('Corte + Barba', 'Corte de cabelo + barba completa com modelagem', 35.00, 45, 'Combo', true),
('Barba', 'Aparar e modelar barba com navalha', 15.00, 20, 'Barba', true),
('Corte Feminino', 'Corte de cabelo feminino com lavagem', 40.00, 60, 'Corte', true),
('Escova', 'Escova modeladora com finalização', 20.00, 30, 'Tratamento', true),
('Sobrancelha', 'Design de sobrancelha masculina e feminina', 10.00, 15, 'Estética', true),
('Hidratação', 'Tratamento hidratante para cabelos', 30.00, 45, 'Tratamento', true),
('Coloração', 'Coloração completa do cabelo', 80.00, 120, 'Coloração', true)
ON CONFLICT (id) DO NOTHING;

-- Inserir informações da loja
INSERT INTO shop_info (nome, endereco, telefone, email, horario_funcionamento, redes_sociais) VALUES
('BarberTime+ Premium', 
 'Rua das Flores, 123 - Centro - São Paulo/SP', 
 '(11) 99999-9999', 
 'contato@barbertimeplus.com.br',
 '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-19:00", "sabado": "08:00-17:00", "domingo": "09:00-15:00"}',
 '{"instagram": "@barbertimeplus", "facebook": "BarberTimePlus", "whatsapp": "5511999999999"}'
)
ON CONFLICT (id) DO NOTHING;