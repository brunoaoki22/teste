import React, { useState } from 'react';
import { Category, TransactionType } from '../types';
import Button from '../components/ui/Button';
import CategoryCard from '../components/dashboard/CategoryCard';
import AddCategoryModal from '../components/dashboard/AddCategoryModal';
import EditCategoryModal from '../components/dashboard/EditCategoryModal';
import ConfirmDeleteModal from '../components/dashboard/ConfirmDeleteModal';
import { PlusCircle } from '../components/Icons';

interface CategoriesPageProps {
    categories: Category[];
    onAddCategory: (category: Omit<Category, 'id'>) => void;
    onUpdateCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.EXPENSE);
    
    // Modal States
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };

    const filteredCategories = categories.filter(c => c.type === activeTab);

    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Personalizar Categorias</h2>
                    <p className="text-muted-foreground">Crie, edite e gerencie suas categorias de receitas e despesas.</p>
                </div>
                <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                    <PlusCircle className="w-4 h-4 flex-shrink-0" /> Nova Categoria
                </Button>
            </div>

            <div className="">
                <nav className="flex space-x-6">
                    <button 
                        onClick={() => setActiveTab(TransactionType.EXPENSE)}
                        className={`py-4 px-1 font-medium text-lg ${activeTab === TransactionType.EXPENSE ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        💸 Despesas
                    </button>
                    <button 
                        onClick={() => setActiveTab(TransactionType.INCOME)}
                        className={`py-4 px-1 font-medium text-lg ${activeTab === TransactionType.INCOME ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        💵 Receitas
                    </button>
                </nav>
            </div>

            <div className="py-8">
                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredCategories.map(cat => (
                            <CategoryCard 
                                key={cat.id} 
                                category={cat} 
                                onEdit={() => openEditModal(cat)}
                                onDelete={() => openDeleteModal(cat)}
                            />
                        ))}
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-64 text-center rounded-lg bg-card">
                        <p className="text-lg font-semibold">Nenhuma categoria encontrada.</p>
                        <p className="text-muted-foreground">Clique em "Nova Categoria" para começar.</p>
                    </div>
                )}
            </div>

            <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAddCategory={onAddCategory} />
            <EditCategoryModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onUpdateCategory={onUpdateCategory} category={selectedCategory} />
            <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onDelete={() => { if(selectedCategory) onDeleteCategory(selectedCategory.id) }} categoryName={selectedCategory?.name} />
        </div>
    );
};

export default CategoriesPage;