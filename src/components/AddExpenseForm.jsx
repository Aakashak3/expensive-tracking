import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit, IndianRupee, Calendar } from 'lucide-react';

const AddExpenseForm = ({ isOpen, onClose, onAdd, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        date: new Date(initialData.date).toISOString().split('T')[0]
      });
    } else if (isOpen) {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const expenseCategories = ['Food', 'Transportation', 'Rent', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Others'];
  const incomeCategories = ['Salary', 'Freelance', 'Bonus', 'Dividend', 'Gift', 'Refund', 'Others'];
  
  const currentCategories = formData.type === 'expense' ? expenseCategories : incomeCategories;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, amount: parseFloat(formData.amount) });
    // Keep form data as is until next open
    onClose();
  };

  const isIncome = formData.type === 'income';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black-overlay z-100"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-slide-panel bg-secondary z-101 p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className={`text-3xl font-bold outfit ${isIncome ? 'text-emerald' : 'gradient-text'}`}>
                {initialData ? (isIncome ? 'Edit Income' : 'Edit Expense') : (isIncome ? 'Add Income' : 'Add Expense')}
              </h2>
              <button onClick={onClose} className="p-2 close-btn">
                <X size={24} color="#9ca3af" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className={`label-text ${isIncome ? 'text-emerald opacity-100' : ''}`}>Title</label>
                <input required type="text" 
                  placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Starship fuel"} 
                  className="input-field"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className={`label-text ${isIncome ? 'text-emerald opacity-100' : ''}`}>Amount</label>
                  <div className="relative flex items-center">
                    <IndianRupee size={20} className={`absolute left-4 ${isIncome ? 'text-emerald' : 'text-cyan'}`} />
                    <input required type="number" placeholder="0.00" className="input-field pl-12"
                      value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className={`label-text ${isIncome ? 'text-emerald opacity-100' : ''}`}>Date</label>
                  <input required type="date" className="input-field"
                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={`label-text ${isIncome ? 'text-emerald opacity-100' : ''}`}>Category</label>
                <select className="input-field" value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-2 p-1 bg-white-5 rounded-xl">
                <button type="button" onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
                  className={`flex-1 py-3 rounded-lg font-bold transition ${formData.type === 'expense' ? 'btn-type-active-rose' : 'btn-type'}`}
                >
                  Expense
                </button>
                <button type="button" onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
                  className={`flex-1 py-3 rounded-lg font-bold transition ${formData.type === 'income' ? 'btn-type-active-emerald' : 'btn-type'}`}
                >
                  Income
                </button>
              </div>

              <button type="submit" 
                className={`w-full py-4 text-lg mt-4 flex items-center justify-center gap-3 transition-all duration-300 ${isIncome ? 'btn-income' : 'btn-primary'}`}
              >
                {initialData ? <Edit size={24} /> : <Plus size={24} />}
                <span>{initialData ? (isIncome ? 'Update Income' : 'Update Expense') : (isIncome ? 'Save Income' : 'Save Expense')}</span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseForm;
