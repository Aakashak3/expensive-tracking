import React, { useState } from 'react';
import { Wallet, TrendingUp, LayoutDashboard, Menu, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onAddClick, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 glass-card mx-6 mt-6 px-10 flex items-center justify-between z-50 rounded-full nav-resp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-cyan rounded-xl flex items-center justify-center shadow-accent logo-hide">
            <Wallet className="text-black" size={24} />
          </div>
          <span className="text-xl font-bold outfit logo-text">Expense <span className="gradient-text">Tracker</span></span>
        </div>
        
        <div className="items-center gap-10 md-flex">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => handleTabChange('dashboard')}
          />
          <NavItem 
            icon={<TrendingUp size={20} />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => handleTabChange('analytics')}
          />
          <NavItem 
            icon={<Trash2 size={20} />} 
            label="Trash" 
            active={activeTab === 'trash'} 
            onClick={() => handleTabChange('trash')}
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onAddClick} className="btn-primary flex items-center gap-2 btn-resp">
            <span>Add</span>
          </button>
          <button 
            className="md-hidden text-white" 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-6 right-6 glass-card p-4 rounded-2xl z-40 md-hidden flex flex-col gap-2"
            style={{ top: '6rem' }}
          >
            <div 
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white-5 text-white' : 'text-gray-400'}`}
              style={{ cursor: 'pointer' }}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium outfit">Dashboard</span>
            </div>
            <div 
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'analytics' ? 'bg-white-5 text-white' : 'text-gray-400'}`}
              style={{ cursor: 'pointer' }}
            >
              <TrendingUp size={20} />
              <span className="font-medium outfit">Analytics</span>
            </div>
            <div 
              onClick={() => handleTabChange('trash')}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'trash' ? 'bg-white-5 text-white' : 'text-gray-400'}`}
              style={{ cursor: 'pointer' }}
            >
              <Trash2 size={20} />
              <span className="font-medium outfit">Trash</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-2 cursor-pointer transition-all relative ${active ? 'text-white' : 'text-gray-400'}`}
  >
    {icon}
    <span className="font-medium text-sm outfit">{label}</span>
    {active && <div className="active-indicator" />}
  </div>
);

export default Navbar;
