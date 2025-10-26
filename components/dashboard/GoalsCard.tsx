import React from 'react';
import { Goal, Currency } from '../../types';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Button from '../ui/Button';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Edit } from '../Icons';
import { formatCurrency } from '../../utils/helpers';

interface GoalsCardProps {
  goals: Goal[];
  currency: Currency;
  onAddGoal: () => void;
  onUpdateProgress: (goal: Goal) => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalItem: React.FC<{ goal: Goal; currency: Currency; onUpdateProgress: (goal: Goal) => void; onEditGoal: (goal: Goal) => void; onDeleteGoal: (goalId: string) => void; }> = 
({ goal, currency, onUpdateProgress, onEditGoal, onDeleteGoal }) => {
    const [isMenuOpen, setMenuOpen] = React.useState(false);
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <li className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-semibold">{goal.name}</span>
                <div className="relative">
                    <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => setMenuOpen(true)} onBlur={() => setTimeout(() => setMenuOpen(false), 200)}>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                     {isMenuOpen && (
                        <div className="absolute right-0 z-10 w-32 mt-1 origin-top-right rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                                <button onClick={() => { onEditGoal(goal); setMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-accent"><Pencil className="w-4 h-4 mr-2"/> Editar</button>
                                <button onClick={() => { onDeleteGoal(goal.id); setMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-left text-destructive hover:bg-accent"><Trash2 className="w-4 h-4 mr-2"/> Excluir</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(goal.currentAmount, currency)}</span>
                <span>{formatCurrency(goal.targetAmount, currency)}</span>
            </div>
             <div className="flex items-center justify-between">
                 <span className="text-xs text-muted-foreground">
                    {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo encerrado"}
                </span>
                <Button variant="ghost" size="sm" onClick={() => onUpdateProgress(goal)}>
                    Adicionar Progresso
                </Button>
            </div>
        </li>
    );
};


const GoalsCard: React.FC<GoalsCardProps> = ({ goals, currency, onAddGoal, onUpdateProgress, onEditGoal, onDeleteGoal }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Metas Financeiras</CardTitle>
                <CardDescription>Acompanhe seu progresso.</CardDescription>
            </div>
            <Button onClick={onAddGoal} size="sm" className="gap-2">
                <PlusCircle className="w-4 h-4 flex-shrink-0" /> Nova Meta
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <ul className="space-y-6">
            {goals.map(goal => (
              <GoalItem 
                key={goal.id} 
                goal={goal} 
                currency={currency} 
                onUpdateProgress={onUpdateProgress}
                onEditGoal={onEditGoal}
                onDeleteGoal={onDeleteGoal}
               />
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">Nenhuma meta definida ainda.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsCard;
