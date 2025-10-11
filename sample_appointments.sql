-- ========================================
-- 📅 AGENDAMENTOS DE EXEMPLO
-- Script para inserir dados de teste no sistema
-- ========================================

-- ⚠️ IMPORTANTE: Execute este script APENAS APÓS o database_setup.sql

-- Inserir agendamentos de exemplo para os próximos dias
INSERT INTO agendamentos (
  cliente_nome, 
  cliente_telefone, 
  cliente_email, 
  barbeiro_id, 
  servico_id, 
  data_agendamento, 
  status, 
  observacoes
) VALUES 
-- Agendamentos para hoje e próximos dias
(
  'Carlos Silva', 
  '(11) 98765-4321', 
  'carlos@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'João Silva' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Corte + Barba' LIMIT 1),
  NOW() + INTERVAL '2 hours',
  'agendado',
  'Cliente preferencial, gosta do corte bem baixo'
),
(
  'Ana Costa', 
  '(11) 97654-3210', 
  'ana@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Maria Santos' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Corte Feminino' LIMIT 1),
  NOW() + INTERVAL '4 hours',
  'confirmado',
  'Primeira vez na barbearia'
),
(
  'Roberto Oliveira', 
  '(11) 96543-2109', 
  'roberto@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Pedro Costa' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Barba' LIMIT 1),
  NOW() + INTERVAL '1 day',
  'agendado',
  'Apenas aparar, não cortar muito'
),
(
  'Fernanda Lima', 
  '(11) 95432-1098', 
  'fernanda@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Ana Oliveira' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Hidratação' LIMIT 1),
  NOW() + INTERVAL '1 day 2 hours',
  'agendado',
  'Cabelo muito ressecado, precisa de tratamento intensivo'
),
(
  'Marcos Santos', 
  '(11) 94321-0987', 
  'marcos@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'João Silva' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Corte Masculino' LIMIT 1),
  NOW() + INTERVAL '2 days',
  'agendado',
  'Corte social para entrevista de emprego'
),
(
  'Juliana Pereira', 
  '(11) 93210-9876', 
  'juliana@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Maria Santos' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Escova' LIMIT 1),
  NOW() + INTERVAL '2 days 3 hours',
  'agendado',
  'Evento especial no final de semana'
),
(
  'Paulo Rodrigues', 
  '(11) 92109-8765', 
  'paulo@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Pedro Costa' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Sobrancelha' LIMIT 1),
  NOW() + INTERVAL '3 days',
  'agendado',
  'Design masculino, não muito fino'
),
(
  'Camila Ferreira', 
  '(11) 91098-7654', 
  'camila@email.com',
  (SELECT id FROM barbeiros WHERE nome = 'Ana Oliveira' LIMIT 1),
  (SELECT id FROM servicos WHERE nome = 'Coloração' LIMIT 1),
  NOW() + INTERVAL '3 days 4 hours',
  'confirmado',
  'Quer mudar para loiro, fazer mechas'
);

-- Verificar agendamentos inseridos
SELECT 
  a.cliente_nome,
  b.nome as barbeiro,
  s.nome as servico,
  a.data_agendamento,
  a.status
FROM agendamentos a
JOIN barbeiros b ON a.barbeiro_id = b.id
JOIN servicos s ON a.servico_id = s.id
ORDER BY a.data_agendamento;

-- Estatísticas dos agendamentos
SELECT 
  status,
  COUNT(*) as quantidade
FROM agendamentos 
GROUP BY status
ORDER BY quantidade DESC;