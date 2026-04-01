'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';
import logo from '../../public/logo.png'

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                // Sucesso na autenticação, envia de volta para o dashboard
                router.push('/saldos');
                router.refresh(); // Força reset interno do novo cookie na cache visual
            } else {
                const data = await res.json();
                setError(data.error || 'Credenciais inválidas');
            }
        } catch (err) {
            setError('Ocorreu um erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background p-8 absolute left-0 top-0 z-[100]">
            <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)] border border-outline-variant/10">
                <div className="text-center mb-10">
                    <img src={logo.src} alt="logo" className='w-16 h-16 mx-auto' />
                    <h1 className="text-2xl font-black text-on-surface uppercase tracking-widest text-sm">RD System</h1>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">Acesso ao painel de relatórios</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="username">
                            Usuário
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-on-surface transition-colors"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="password">
                            Senha de Acesso
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-on-surface transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-error-container/10 border-l-4 border-error rounded-r-xl">
                            <p className="text-sm font-bold text-error flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm" data-icon="warning">warning</span>
                                {error}
                            </p>
                        </div>
                    )}

                    <Button type="submit" variant="primary" className="w-full py-4 text-sm mt-4" disabled={loading}>
                        {loading ? 'Validando...' : 'Acessar Painel'}
                    </Button>
                </form>
            </div>

            <p className="mt-8 text-xs text-on-surface-variant text-center max-w-sm">
                Ambiente de uso exclusivamente interno. Todo tráfego é logado sob as chaves JWT restritas da aplicação.
            </p>
        </div>
    );
}
