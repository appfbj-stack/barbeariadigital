import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminEmails: string[] = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Falha no login. Verifique e-mail e senha.');
        return;
      }

      const loggedEmail = data.user?.email?.toLowerCase();
      if (!loggedEmail || !adminEmails.includes(loggedEmail)) {
        setError('Acesso restrito. Seu e-mail não está autorizado como admin.');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md mx-auto mt-8 shadow-xl">
      <h2 className="text-2xl font-bold text-amber-400 mb-4 text-center">Entrar como Admin</h2>
      <p className="text-gray-300 text-sm mb-6 text-center">
        Somente administradores podem acessar as configurações da barbearia.
      </p>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <span className="text-red-400 mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="admin@seudominio.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Sua senha"
            required
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Dica: crie seu usuário admin no Supabase Auth e adicione o e-mail em VITE_ADMIN_EMAILS.
      </p>
    </div>
  );
};

export default AdminLogin;