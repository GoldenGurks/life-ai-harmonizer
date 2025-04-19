
import { useState } from 'react';
import { PantryItem } from '@/types/meal-planning';
import { toast } from 'sonner';

const samplePantryItems: PantryItem[] = [
  { id: '1', name: 'Pasta', category: 'Grains', amount: 500, unit: 'g', expirationDate: '2026-01-15' },
  { id: '2', name: 'Canned tomatoes', category: 'Vegetables', amount: 400, unit: 'g', expirationDate: '2026-06-20' },
  { id: '3', name: 'Rice', category: 'Grains', amount: 1000, unit: 'g', expirationDate: '2027-03-10' },
  { id: '4', name: 'Greek yogurt', category: 'Dairy', amount: 500, unit: 'g', expirationDate: '2025-04-25' },
  { id: '5', name: 'Quinoa', category: 'Grains', amount: 250, unit: 'g', expirationDate: '2026-12-05' },
];

export const usePantry = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(samplePantryItems);

  const addPantryItem = (item: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...item,
      id: Date.now().toString(),
    };
    setPantryItems([...pantryItems, newItem]);
    toast.success(`${item.name} added to pantry`);
  };

  const removePantryItem = (id: string) => {
    setPantryItems(items => items.filter(item => item.id !== id));
    toast.success('Item removed from pantry');
  };

  const updatePantryItem = (id: string, updates: Partial<Omit<PantryItem, 'id'>>) => {
    setPantryItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
    toast.success('Item updated successfully');
  };

  return {
    pantryItems,
    addPantryItem,
    removePantryItem,
    updatePantryItem,
  };
};
