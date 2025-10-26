import React, { useState, FormEvent } from 'react';
import { User } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Logo } from '../components/Icons';
import { api } from '../utils/api';

interface AuthPageProps {
    onLogin: (user: User) => void;
    onRegister: (user: User) => void;
}

type SubscriptionPlan = 'free' | 'premium';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('free');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginView) {
                const user = await api.post<User>('auth/login', { email, password });
                onLogin(user);
            } else {
                if (password !== confirmPassword) {
                    setError('As senhas não coincidem.');
                    return;
                }
                if (email && password && fullName) {
                     const newUser = await api.post<User>('auth/register', { 
                         fullName, 
                         email, 
                         password, 
                         subscriptionPlan
                     });
                    onRegister(newUser);
                } else {
                    setError('Todos os campos são obrigatórios.');
                }
            }
        } catch (err: any) {
             setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-card">
                <div className="flex flex-col items-center space-y-2">
                    <Logo className="w-12 h-12 text-primary flex-shrink-0"/>
                    <h1 className="text-3xl font-bold text-center">
                        {isLoginView ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h1>
                    <p className="text-center text-muted-foreground">
                        {isLoginView ? 'Faça login para acessar seu painel.' : 'Comece sua jornada financeira conosco.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                        <div>
                            <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                            <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="João da Silva" required={!isLoginView} />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Endereço de E-mail</label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@exemplo.com" required />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-muted-foreground">Senha</label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {!isLoginView && (
                        <>
                            <div>
                                <label htmlFor="confirmPassword"  className="text-sm font-medium text-muted-foreground">Confirmar Senha</label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required={!isLoginView} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-muted-foreground">Plano de Assinatura</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setSubscriptionPlan('free')} className={`p-4 text-center rounded-md ${subscriptionPlan === 'free' ? 'bg-primary/20' : 'bg-secondary'}`}>
                                        <p className="font-semibold">Gratuito</p>
                                        <p className="text-xs text-muted-foreground">Funcionalidades básicas</p>
                                    </button>
                                     <button type="button" onClick={() => setSubscriptionPlan('premium')} className={`p-4 text-center rounded-md ${subscriptionPlan === 'premium' ? 'bg-primary/20' : 'bg-secondary'}`}>
                                        <p className="font-semibold">Premium</p>
                                        <p className="text-xs text-muted-foreground">Todos os recursos</p>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                        {isLoading ? 'Carregando...' : (isLoginView ? 'Entrar' : 'Criar Conta')}
                    </Button>
                </form>
                
                <div className="text-sm text-center">
                    <button onClick={toggleView} className="font-medium text-primary hover:underline">
                        {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;