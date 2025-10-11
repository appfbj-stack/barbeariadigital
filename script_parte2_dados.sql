-- Parte 2: Inserção de dados iniciais

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