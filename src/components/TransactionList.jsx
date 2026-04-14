import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Car, Film, ShoppingBag, Heart, Zap, Tag, Edit, Trash2, RefreshCcw } from 'lucide-react';

const categoryIcons = {
  Food: <Coffee size={18} />,
  Transportation: <Car size={18} />,
  Entertainment: <Film size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Health: <Heart size={18} />,
  Utilities: <Zap size={18} />,
  Others: <Tag size={18} />,
};

const categoryColors = {
  Food: '#F59E0B',
  Transportation: '#3B82F6',
  Entertainment: '#8B5CF6',
  Shopping: '#EC4899',
  Health: '#10B981',
  Utilities: '#F43F5E',
  Others: '#6B7280',
};

const TransactionList = ({ transactions = [], loading, isTrash = false, onEdit, onDelete, onRestore }) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="glass-card p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold outfit">Transactions</h2>
        <button className="text-sm font-semibold text-cyan color-cyan">See All</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="transaction-scroll space-y-4">
          <AnimatePresence>
            {safeTransactions.map((t, index) => (
              <motion.div
                key={t?._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="transaction-item flex items-center justify-between p-4 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" 
                       style={{ backgroundColor: `${categoryColors[t?.category] || '#6B7280'}15`, color: categoryColors[t?.category] || '#6B7280' }}>
                    {categoryIcons[t?.category] || <Tag size={18} />}
                  </div>
                  <div>
                    <h4 className="font-semibold outfit">{t?.title || 'Unknown'}</h4>
                    <p className="text-xs text-secondary-label uppercase mt-0.5">
                      {t?.category} • {t?.date ? new Date(t.date).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className={`font-bold outfit ${t?.type === 'income' ? 'text-emerald' : 'text-white'}`}>
                    {t?.type === 'income' ? '+' : '-'} ₹{Number(t?.amount || 0).toLocaleString('en-IN')}
                  </p>
                  <div className="flex gap-2">
                    {isTrash ? (
                      <button 
                        onClick={() => onRestore && onRestore(t._id)}
                        className="p-1.5 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald/20 transition"
                        title="Restore"
                      >
                        <RefreshCcw size={14} />
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => onEdit && onEdit(t)}
                          className="p-1.5 rounded-lg bg-white/5 text-cyan hover:bg-white/10 transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => onDelete && onDelete(t._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                          title="Move to Trash"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {safeTransactions.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <p className="outfit text-lg">No records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
