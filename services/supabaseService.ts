import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

// Tipos para facilitar o uso
type Barbeiro = Database['public']['Tables']['barbeiros']['Row']
type Servico = Database['public']['Tables']['servicos']['Row']
type Agendamento = Database['public']['Tables']['agendamentos']['Row']
type NovoAgendamento = Database['public']['Tables']['agendamentos']['Insert']

// ==================== BARBEIROS ====================

/**
 * Busca todos os barbeiros ativos
 */
export async function getBarbeiros(): Promise<Barbeiro[]> {
  try {
    const { data, error } = await supabase
      .from('barbeiros')
      .select('*')
      .eq('ativo', true)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar barbeiros:', error)
      throw new Error('Falha ao carregar barbeiros')
    }

    return data || []
  } catch (error) {
    console.error('Erro na função getBarbeiros:', error)
    return []
  }
}

/**
 * Busca um barbeiro específico por ID
 */
export async function getBarbeiroById(id: string): Promise<Barbeiro | null> {
  try {
    const { data, error } = await supabase
      .from('barbeiros')
      .select('*')
      .eq('id', id)
      .eq('ativo', true)
      .single()

    if (error) {
      console.error('Erro ao buscar barbeiro:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro na função getBarbeiroById:', error)
    return null
  }
}

// ==================== SERVIÇOS ====================

/**
 * Busca todos os serviços ativos
 */
export async function getServicos(): Promise<Servico[]> {
  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('ativo', true)
      .order('categoria', { ascending: true })
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar serviços:', error)
      throw new Error('Falha ao carregar serviços')
    }

    return data || []
  } catch (error) {
    console.error('Erro na função getServicos:', error)
    return []
  }
}

/**
 * Busca um serviço específico por ID
 */
export async function getServicoById(id: string): Promise<Servico | null> {
  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', id)
      .eq('ativo', true)
      .single()

    if (error) {
      console.error('Erro ao buscar serviço:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro na função getServicoById:', error)
    return null
  }
}

// ==================== AGENDAMENTOS ====================

/**
 * Cria um novo agendamento
 */
export async function criarAgendamento(agendamento: NovoAgendamento): Promise<Agendamento | null> {
  try {
    // Garantir que a data está no formato correto
    const formattedAgendamento = {
      ...agendamento,
      // Certifica que a data está no formato ISO
      data_agendamento: new Date(agendamento.data_agendamento).toISOString()
    };
    
    // Tentar criar no Supabase
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([formattedAgendamento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar agendamento no Supabase:', error);
      throw error;
    }

    console.log('✅ Agendamento criado com sucesso no Supabase');
    return data;
    
  } catch (error) {
    console.error('Erro na função criarAgendamento:', error);
    throw error;
  }
}

/**
 * Busca agendamentos por barbeiro e data
 */
export async function getAgendamentosPorBarbeiroEData(
  barbeiroId: string,
  dataInicio: string,
  dataFim: string
): Promise<Agendamento[]> {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbeiros:barbeiro_id(nome),
        servicos:servico_id(nome, duracao)
      `)
      .eq('barbeiro_id', barbeiroId)
      .gte('data_agendamento', dataInicio)
      .lte('data_agendamento', dataFim)
      .in('status', ['agendado', 'confirmado', 'em_andamento'])
      .order('data_agendamento')

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro na função getAgendamentosPorBarbeiroEData:', error)
    return []
  }
}

/**
 * Busca todos os agendamentos de uma data específica
 */
export async function getAgendamentosPorData(data: string): Promise<Agendamento[]> {
  try {
    const dataInicio = `${data}T00:00:00.000Z`
    const dataFim = `${data}T23:59:59.999Z`

    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        barbeiros:barbeiro_id(nome),
        servicos:servico_id(nome, duracao, preco)
      `)
      .gte('data_agendamento', dataInicio)
      .lte('data_agendamento', dataFim)
      .order('data_agendamento')

    if (error) {
      console.error('Erro ao buscar agendamentos por data:', error)
      return []
    }

    return agendamentos || []
  } catch (error) {
    console.error('Erro na função getAgendamentosPorData:', error)
    return []
  }
}

/**
 * Atualiza o status de um agendamento
 */
export async function atualizarStatusAgendamento(
  id: string,
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar status do agendamento:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro na função atualizarStatusAgendamento:', error)
    return false
  }
}

/**
 * Verifica disponibilidade de horário para um barbeiro
 */
export async function verificarDisponibilidade(
  barbeiroId: string,
  dataHora: string,
  duracaoMinutos: number
): Promise<boolean> {
  try {
    const dataInicio = new Date(dataHora)
    const dataFim = new Date(dataInicio.getTime() + duracaoMinutos * 60000)

    const { data, error } = await supabase
      .from('agendamentos')
      .select('id, data_agendamento, servicos:servico_id(duracao)')
      .eq('barbeiro_id', barbeiroId)
      .in('status', ['agendado', 'confirmado', 'em_andamento'])
      .gte('data_agendamento', dataInicio.toISOString())
      .lte('data_agendamento', dataFim.toISOString())

    if (error) {
      console.error('Erro ao verificar disponibilidade:', error)
      return false
    }

    // Se encontrou algum agendamento no período, não está disponível
    return !data || data.length === 0
  } catch (error) {
    console.error('Erro na função verificarDisponibilidade:', error)
    return false
  }
}

// ==================== UTILITÁRIOS ====================

/**
 * Formata data para exibição
 */
export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Formata hora para exibição
 */
export function formatarHora(data: string): string {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formata preço para exibição
 */
export function formatarPreco(preco: number): string {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

/**
 * Calcula duração total em minutos
 */
export function calcularDuracaoTotal(servicos: Servico[]): number {
  return servicos.reduce((total, servico) => total + servico.duracao, 0)
}

/**
 * Calcula preço total
 */
export function calcularPrecoTotal(servicos: Servico[]): number {
  return servicos.reduce((total, servico) => total + servico.preco, 0)
}