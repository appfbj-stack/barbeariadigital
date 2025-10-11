import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configurações do Supabase não encontradas. Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env.local'
  )
}

// Cliente Supabase configurado
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      barbeiros: {
        Row: {
          id: string
          nome: string
          especialidades: string[]
          avatar_url?: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          especialidades: string[]
          avatar_url?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          especialidades?: string[]
          avatar_url?: string
          ativo?: boolean
          updated_at?: string
        }
      }
      servicos: {
        Row: {
          id: string
          nome: string
          descricao?: string
          preco: number
          duracao: number
          categoria: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string
          preco: number
          duracao: number
          categoria: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          preco?: number
          duracao?: number
          categoria?: string
          ativo?: boolean
          updated_at?: string
        }
      }
      agendamentos: {
        Row: {
          id: string
          cliente_nome: string
          cliente_telefone: string
          cliente_email?: string
          barbeiro_id: string
          servico_id: string
          data_agendamento: string
          status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
          observacoes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_nome: string
          cliente_telefone: string
          cliente_email?: string
          barbeiro_id: string
          servico_id: string
          data_agendamento: string
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
          observacoes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_nome?: string
          cliente_telefone?: string
          cliente_email?: string
          barbeiro_id?: string
          servico_id?: string
          data_agendamento?: string
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
          observacoes?: string
          updated_at?: string
        }
      }
    }
  }
}