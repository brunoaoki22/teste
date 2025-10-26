import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, Transaction, Goal, Category, Currency, Theme, TransactionType } from '../types';
import { api } from '../utils/api';

// Components
import Button from '../components/ui/Button';
import ProfilePage from './ProfilePage';
import CategoriesPage from './CategoriesPage';
import MonthlyView from '../components/dashboard/MonthlyView';
import GoalsCard from '../components/dashboard/GoalsCard';
import ReportsCard from '../components/dashboard/ReportsCard';
import AnnualReportCard from '../components/dashboard/AnnualReportCard';
import Toast from '../components/ui/Toast';

// Modals
import TransactionModal from '../components/dashboard/TransactionModal';
import AddGoalModal from '../components/dashboard/AddGoalModal';
import EditGoalModal from '../components/dashboard/EditGoalModal';
import UpdateGoalProgressModal from '../components/dashboard/UpdateGoalProgressModal';
import ConfirmDeleteGoalModal from '../components/dashboard/ConfirmDeleteGoalModal';


// Icons
import { Logo, Settings, Tags, Home, MoreHorizontal, X, LineChart } from '../components/Icons';

// Props
interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

// Local types
type NavView = 'dashboard' | 'categories' | 'reports' | 'profile';
type ToastMessage = { message: string; type: 'success' | 'error' };

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  // Global State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<Currency>('BRL');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // UI State
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal States
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isAddGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setEditGoalModalOpen] = useState(false);
  const [isUpdateGoalModalOpen, setUpdateGoalModalOpen] = useState(false);
  const [isDeleteGoalModalOpen, setDeleteGoalModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };
  
  // Data Fetching
  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [fetchedTransactions, fetchedGoals, fetchedCategories] = await Promise.all([
        api.get<Transaction[]>(`transactions?userId=${user.id}`),
        api.get<Goal[]>(`goals?userId=${user.id}`),
        api.get<Category[]>(`categories?userId=${user.id}`)
      ]);
      setTransactions(fetchedTransactions);
      setGoals(fetchedGoals);
      setCategories(fetchedCategories);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transaction Handlers
  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>, installments: number) => {
    try {
        const newTransactions = await api.post<Transaction[]>('transactions', { transactionData, installments, userId: user.id });
        setTransactions(prev => [...prev, ...newTransactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        showToast('Transação adicionada com sucesso!');
    } catch (error: any) {
        showToast(error.message, 'error');
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    try {
        const updatedTransaction = await api.put<Transaction>(`transactions/${transaction.id}`, transaction);
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        showToast('Transação atualizada com sucesso!');
    } catch (error: any) {
        showToast(error.message, 'error');
    }
  };
  
  const handleDeleteTransaction = async (transactionId: string) => {
    // For now, we will just delete the single transaction. A full implementation would ask to delete all installments.
    try {
        await api.delete(`transactions/${transactionId}`);
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        showToast('Transação excluída com sucesso!');
    } catch (error: any) {
        showToast(error.message, 'error');
    }
  };

  // Goal Handlers
  const handleAddGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'currentAmount'>) => {
      try {
          const newGoal = await api.post<Goal>('goals', { ...goalData, userId: user.id });
          setGoals(prev => [...prev, newGoal]);
          showToast('Meta adicionada com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  const handleUpdateGoal = async (goal: Goal) => {
       try {
          const updatedGoal = await api.put<Goal>(`goals/${goal.id}`, goal);
          setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
          showToast('Meta atualizada com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };
  
  const handleUpdateGoalProgress = async (goalId: string, amountToAdd: number) => {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;
      
      const updatedGoalData = { ...goal, currentAmount: goal.currentAmount + amountToAdd };

      try {
          const updatedGoal = await api.put<Goal>(`goals/${goalId}`, updatedGoalData);
          setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
          showToast('Progresso da meta atualizado!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  const handleDeleteGoal = async (goalId: string) => {
       try {
          await api.delete(`goals/${goalId}`);
          setGoals(prev => prev.filter(g => g.id !== goalId));
          showToast('Meta excluída com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  // Category Handlers
  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
      try {
          const newCategory = await api.post<Category>('categories', { ...categoryData, userId: user.id });
          setCategories(prev => [...prev, newCategory]);
          showToast('Categoria adicionada com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  const handleUpdateCategory = async (category: Category) => {
       try {
          const updatedCategory = await api.put<Category>(`categories/${category.id}`, category);
          setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
          showToast('Categoria atualizada com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };

  const handleDeleteCategory = async (categoryId: string) => {
       try {
          await api.delete(`categories/${categoryId}`);
          setCategories(prev => prev.filter(c => c.id !== categoryId));
          showToast('Categoria excluída com sucesso!');
      } catch (error: any) {
          showToast(error.message, 'error');
      }
  };


  // Memos for derived state
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date + 'T00:00:00');
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);

  const { income, expense, balance } = useMemo(() => {
    return monthlyTransactions.reduce((acc, t) => {
        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
        acc.balance = acc.income - acc.expense;
        return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }, [monthlyTransactions]);


  // Navigation handlers
  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  // Modal Open/Close handlers
  const openTransactionModal = (transaction: Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setTransactionModalOpen(true);
  };
  
  const openEditGoalModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditGoalModalOpen(true);
  };
  
  const openUpdateGoalModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setUpdateGoalModalOpen(true);
  };

  const openDeleteGoalModal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if(goal) {
      setSelectedGoal(goal);
      setDeleteGoalModalOpen(true);
    }
  };


  const renderContent = () => {
    if (isLoadingData) {
        return <div className="text-center p-8">Carregando dados...</div>;
    }
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <MonthlyView 
                    currentDate={currentDate}
                    transactions={monthlyTransactions}
                    categories={categories}
                    income={income}
                    expense={expense}
                    balance={balance}
                    currency={currency}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onAddTransaction={() => openTransactionModal()}
                    onEditTransaction={(t) => openTransactionModal(t)}
                    onDeleteTransaction={handleDeleteTransaction}
                />
            </div>
             <div className="lg:col-span-1 space-y-8">
                <GoalsCard 
                  goals={goals} 
                  currency={currency} 
                  onAddGoal={() => setAddGoalModalOpen(true)} 
                  onUpdateProgress={openUpdateGoalModal}
                  onEditGoal={openEditGoalModal}
                  onDeleteGoal={openDeleteGoalModal}
                />
            </div>
          </div>
        );
      case 'reports':
        return (
            <div className="space-y-8">
                <ReportsCard transactions={transactions} categories={categories} currency={currency} />
                <AnnualReportCard transactions={transactions} currency={currency} />
            </div>
        );
      case 'categories':
        return <CategoriesPage categories={categories} onAddCategory={handleAddCategory} onUpdateCategory={handleUpdateCategory} onDeleteCategory={handleDeleteCategory} />;
      case 'profile':
        return <ProfilePage user={user} onUpdateUser={onUpdateUser} onNavigateBack={() => setActiveView('dashboard')} showToast={showToast} />;
      default:
        return null;
    }
  };

  const NavLink: React.FC<{ view: NavView; icon: React.ReactNode; label: string; }> = ({ view, icon, label }) => (
    <button
      onClick={() => { setActiveView(view); setSidebarOpen(false); }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        activeView === view ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className={`absolute z-40 lg:relative lg:translate-x-0 w-64 h-full p-4 bg-card border-r border-border transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">FinanDash</span>
          </div>
          <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="space-y-2">
          <NavLink view="dashboard" icon={<Home className="w-5 h-5 mr-3" />} label="Dashboard" />
          <NavLink view="reports" icon={<LineChart className="w-5 h-5 mr-3" />} label="Relatórios" />
          <NavLink view="categories" icon={<Tags className="w-5 h-5 mr-3" />} label="Categorias" />
          <NavLink view="profile" icon={<Settings className="w-5 h-5 mr-3" />} label="Meu Perfil" />
        </nav>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-card/80 backdrop-blur-sm border-b border-border">
          <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={() => setSidebarOpen(true)}>
             <MoreHorizontal className="w-5 h-5"/>
          </Button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             <span className="hidden text-sm font-medium sm:block">{user.fullName}</span>
            <Button onClick={onLogout} variant="secondary" size="sm">Sair</Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
      
      {/* Modals */}
      <TransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        onUpdate={handleUpdateTransaction}
        categories={categories}
        transactionToEdit={selectedTransaction}
      />
      <AddGoalModal 
        isOpen={isAddGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
      <EditGoalModal
        isOpen={isEditGoalModalOpen}
        onClose={() => setEditGoalModalOpen(false)}
        onUpdateGoal={handleUpdateGoal}
        goal={selectedGoal}
      />
      <UpdateGoalProgressModal
        isOpen={isUpdateGoalModalOpen}
        onClose={() => setUpdateGoalModalOpen(false)}
        onUpdateGoal={handleUpdateGoalProgress}
        goal={selectedGoal}
        currency={currency}
      />
      <ConfirmDeleteGoalModal
        isOpen={isDeleteGoalModalOpen}
        onClose={() => setDeleteGoalModalOpen(false)}
        onDelete={() => { if(selectedGoal) handleDeleteGoal(selectedGoal.id) }}
        goalName={selectedGoal?.name}
      />
    </div>
  );
};

export default Dashboard;
