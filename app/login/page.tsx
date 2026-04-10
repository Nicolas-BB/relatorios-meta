'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../../public/logo.png'
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    function LoginAlert() {
        if (error != '') {
            return (
                <Alert variant='destructive'>
                    <AlertCircle />
                    <AlertTitle>
                        Credenciais incorretas
                    </AlertTitle>
                    <AlertDescription>
                        Confira se usuário e senha estão corretos
                    </AlertDescription>
                </Alert>
            )
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background p-8 absolute left-0 top-0 z-[100]">
            <Card size='default' className='mx-auto w-full max-w-sm'>
                <CardHeader>
                    <CardTitle className='flex flex-col items-center gap-2'>
                        <Image src={logo} alt='logo' width={64} height={64} className='mx-auto' />
                        RD SYSTEM
                    </CardTitle>
                    <CardDescription className='text-center'>
                        Acesse sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='email'>Usuário</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder='Usuário'
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <InputGroupAddon>
                                        <User />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='password'>Senha</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder='Senha'
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputGroupAddon>
                                        <Lock />
                                    </InputGroupAddon>
                                    <InputGroupAddon align='inline-end' className='p-0'>
                                        <Button variant='ghost' size='icon' type='button' onClick={handleShowPassword}>
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <LoginAlert />
                            <Button type='submit' onClick={handleLogin} className='w-full' disabled={loading}>{loading ? 'Acessando' : 'Acessar'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <p className="mt-8 text-xs text-on-surface-variant text-center max-w-sm">
                Ambiente de uso exclusivamente interno. Todo tráfego é logado sob as chaves JWT restritas da aplicação.
            </p>
        </div>
    );
}
