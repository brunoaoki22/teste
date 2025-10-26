import React, { useState } from 'react';
import { Category } from '../../types';
import { ICONS, MoreHorizontal, Pencil, Trash2 } from '../Icons';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const Icon = ICONS[category.icon] || ICONS.HelpCircle;

  return (
    <div className="relative p-4 overflow-hidden text-center transition-transform duration-300 transform rounded-lg bg-card hover:-translate-y-1">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="p-1 rounded-full text-muted-foreground hover:bg-accent"
        >
          <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 z-10 w-32 mt-2 origin-top-right rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-accent"
              >
                <Pencil className="w-4 h-4 mr-2 flex-shrink-0" /> Editar
              </button>
              <button
                onClick={() => { onDelete(); setMenuOpen(false); }}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-destructive hover:bg-accent"
              >
                <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" /> Excluir
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <Icon className="w-12 h-12 mb-3 text-primary flex-shrink-0" />
        <h3 className="font-semibold text-card-foreground">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;