-- ========================================
-- 🚀 SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO DE DADOS
-- BarberTime+ - Sistema de Agendamento para Barbearias
-- ========================================

-- 🧹 LIMPEZA (caso precise recriar)
-- Descomente as linhas abaixo apenas se quiser recriar tudo do zero
-- DROP TABLE IF EXISTS agendamentos CASCADE;
-- DROP TABLE IF EXISTS servicos CASCADE;
-- DROP TABLE IF EXISTS barbeiros CASCADE;
-- DROP TABLE IF EXISTS shop_info CASCADE;
-- DROP TYPE IF EXISTS status_agendamento CASCADE;

-- ========================================
-- 📋 1. CRIAÇÃO DAS TABELAS
-- ========================================

-- 🔧 Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 👨‍💼 Tabela de Barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especialidades TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para barbeiros
DROP TRIGGER IF EXISTS update_barbeiros_updated_at ON barbeiros;
CREATE TRIGGER update_barbeiros_updated_at BEFORE UPDATE
ON barbeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 💇‍♂️ Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
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

-- Trigger para serviços
DROP TRIGGER IF EXISTS update_servicos_updated_at ON servicos;
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE
ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 📅 Enum para status de agendamento
DO $$ BEGIN
    CREATE TYPE status_agendamento AS ENUM ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 📋 Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome VARCHAR(100) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_email VARCHAR(100),
  barbeiro_id UUID NOT NULL REFERENCES barbeiros(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  status status_agendamento DEFAULT 'agendado',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para agendamentos
DROP TRIGGER IF EXISTS update_agendamentos_updated_at ON agendamentos;
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE
ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 🏪 Tabela de Informações da Loja
CREATE TABLE IF NOT EXISTS shop_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL DEFAULT 'BarberTime+',
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(100),
  horario_funcionamento JSONB DEFAULT '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-18:00", "sabado": "08:00-16:00", "domingo": "fechado"}',
  redes_sociais JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para shop_info
DROP TRIGGER IF EXISTS update_shop_info_updated_at ON shop_info;
CREATE TRIGGER update_shop_info_updated_at BEFORE UPDATE
ON shop_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 📊 2. ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para agendamentos
CREATE INDEX IF NOT EXISTS idx_agendamentos_barbeiro ON agendamentos(barbeiro_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_servico ON agendamentos(servico_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);

-- Índices para barbeiros
CREATE INDEX IF NOT EXISTS idx_barbeiros_ativo ON barbeiros(ativo);

-- Índices para serviços
CREATE INDEX IF NOT EXISTS idx_servicos_ativo ON servicos(ativo);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria);

-- ========================================
-- 🔒 3. POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar RLS nas tabelas
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_info ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Barbeiros são visíveis para todos" ON barbeiros;
DROP POLICY IF EXISTS "Serviços são visíveis para todos" ON servicos;
DROP POLICY IF EXISTS "Agendamentos são visíveis para todos" ON agendamentos;
DROP POLICY IF EXISTS "Qualquer um pode criar agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Qualquer um pode atualizar agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Shop info é visível para todos" ON shop_info;

-- Políticas para barbeiros
CREATE POLICY "Barbeiros são visíveis para todos" ON barbeiros
FOR SELECT USING (ativo = true);

-- Políticas para serviços
CREATE POLICY "Serviços são visíveis para todos" ON servicos
FOR SELECT USING (ativo = true);

-- Políticas para agendamentos
CREATE POLICY "Agendamentos são visíveis para todos" ON agendamentos
FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode criar agendamentos" ON agendamentos
FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar agendamentos" ON agendamentos
FOR UPDATE USING (true);

-- Políticas para shop_info
CREATE POLICY "Shop info é visível para todos" ON shop_info
FOR SELECT USING (true);

-- ========================================
-- 📝 4. DADOS INICIAIS
-- ========================================

-- 🧹 Limpar dados existentes (opcional)
-- DELETE FROM agendamentos;
-- DELETE FROM barbeiros;
-- DELETE FROM servicos;
-- DELETE FROM shop_info;

-- 👨‍💼 Inserir barbeiros de exemplo
INSERT INTO barbeiros (nome, especialidades, ativo) VALUES
('João Silva', ARRAY['Corte Masculino', 'Barba', 'Bigode'], true),
('Maria Santos', ARRAY['Corte Feminino', 'Escova', 'Hidratação'], true),
('Pedro Costa', ARRAY['Corte Masculino', 'Barba', 'Sobrancelha'], true),
('Ana Oliveira', ARRAY['Corte Feminino', 'Coloração', 'Tratamentos'], true)
ON CONFLICT (id) DO NOTHING;

-- 💇‍♂️ Inserir serviços de exemplo
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

-- 🏪 Inserir informações da loja
INSERT INTO shop_info (nome, endereco, telefone, email, horario_funcionamento, redes_sociais) VALUES
('BarberTime+ Premium', 
 'Rua das Flores, 123 - Centro - São Paulo/SP', 
 '(11) 99999-9999', 
 'contato@barbertimeplus.com.br',
 '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-19:00", "sabado": "08:00-17:00", "domingo": "09:00-15:00"}',
 '{"instagram": "@barbertimeplus", "facebook": "BarberTimePlus", "whatsapp": "5511999999999"}'
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- ✅ 5. VERIFICAÇÃO FINAL
-- ========================================

-- Contar registros inseridos
SELECT 
  'barbeiros' as tabela, 
  COUNT(*) as total_registros 
FROM barbeiros 
WHERE ativo = true

UNION ALL

SELECT 
  'servicos' as tabela, 
  COUNT(*) as total_registros 
FROM servicos 
WHERE ativo = true

UNION ALL

SELECT 
  'shop_info' as tabela, 
  COUNT(*) as total_registros 
FROM shop_info

UNION ALL

SELECT 
  'agendamentos' as tabela, 
  COUNT(*) as total_registros 
FROM agendamentos;

-- ========================================
-- 🎉 CONFIGURAÇÃO CONCLUÍDA!
-- ========================================

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '🎉 BANCO DE DADOS CONFIGURADO COM SUCESSO!';
  RAISE NOTICE '✅ Tabelas criadas: barbeiros, servicos, agendamentos, shop_info';
  RAISE NOTICE '✅ Políticas RLS configuradas';
  RAISE NOTICE '✅ Dados iniciais inseridos';
  RAISE NOTICE '✅ Índices criados para performance';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Sua aplicação BarberTime+ está pronta para uso!';
  RAISE NOTICE '📱 Acesse: http://localhost:3000';
END $$;