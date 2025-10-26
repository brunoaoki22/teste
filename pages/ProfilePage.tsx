import React, { useState, FormEvent, useEffect } from 'react';
import { User } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft, Edit } from '../components/Icons';
import UpdateProfilePictureModal from '../components/dashboard/UpdateProfilePictureModal';
import { api } from '../utils/api';

interface ProfilePageProps {
    user: User;
    onUpdateUser: (user: User) => void;
    onNavigateBack: () => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onNavigateBack, showToast }) => {
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isPictureModalOpen, setPictureModalOpen] = useState(false);
    
    useEffect(() => {
        setFullName(user.fullName);
        setEmail(user.email);
    }, [user]);

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        
        if (fullName !== user.fullName || email !== user.email) {
            try {
                const updatedUser = await api.put<User>(`users/${user.id}/profile`, { fullName, email });
                onUpdateUser(updatedUser);
                showToast('Perfil atualizado com sucesso!', 'success');
            } catch (error: any) {
                showToast(error.message, 'error');
            }
        }
    };
    
    const handlePasswordChange = async (e: FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmNewPassword) {
            showToast('As novas senhas não coincidem.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('A nova senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        try {
            await api.put(`users/${user.id}/password`, { currentPassword, newPassword });
            showToast('Senha alterada com sucesso!', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch(error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleProfilePictureUpdate = async (newUrl: string) => {
        try {
            const updatedUser = await api.put<User>(`users/${user.id}/picture`, { profilePicture: newUrl });
            onUpdateUser(updatedUser);
            showToast('Foto de perfil atualizada!', 'success');
            setPictureModalOpen(false);
        } catch(error: any) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-8">
                 <Button onClick={onNavigateBack} variant="ghost" size="sm" className="p-2 h-auto"><ArrowLeft className="w-5 h-5 flex-shrink-0" /></Button>
                 <div>
                    <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
                    <p className="text-muted-foreground">Gerencie suas informações pessoais e de segurança.</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle>Foto de Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <img src={user.profilePicture} alt={user.fullName} className="w-32 h-32 rounded-full" />
                                <button onClick={() => setPictureModalOpen(true)} className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-muted-foreground">Nome Completo</label>
                                    <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-muted-foreground">Endereço de E-mail</label>
                                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={fullName === user.fullName && email === user.email}>Salvar Alterações</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Alterar Senha</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword"  className="block mb-2 text-sm font-medium text-muted-foreground">Senha Atual</label>
                                    <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="newPassword"  className="block mb-2 text-sm font-medium text-muted-foreground">Nova Senha</label>
                                    <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword"  className="block mb-2 text-sm font-medium text-muted-foreground">Confirmar Nova Senha</label>
                                    <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Alterar Senha</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <UpdateProfilePictureModal
                isOpen={isPictureModalOpen}
                onClose={() => setPictureModalOpen(false)}
                currentSeed={user.fullName}
                onUpdate={handleProfilePictureUpdate}
            />
        </div>
    );
};

export default ProfilePage;