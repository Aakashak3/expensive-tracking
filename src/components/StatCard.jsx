import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, amount, icon, color, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex-1 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl" 
           style={{ background: `linear-gradient(to bottom right, ${color}, transparent)` }} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-4 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
            {trend}
          </div>
        )}
      </div>
      
      <p className="text-secondary-label text-sm font-medium outfit uppercase">{title}</p>
      <h3 className="text-3xl font-bold mt-1 outfit">
        <span className="text-gray-500 text-lg mr-1">₹</span>
        {Number(amount || 0).toLocaleString('en-IN')}
      </h3>
      
      <div className="progress-bar-bg mt-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          className="progress-bar-fill" 
          style={{ backgroundColor: color }} 
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
