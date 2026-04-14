import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, Activity, TrendingDown, IndianRupee, Calendar, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api/expenses';
const COLORS = ['#00f2ff', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#f43f5e'];

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API_BASE_URL);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const income = data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    const pieData = Object.entries(
      data.reduce((acc, t) => {
        if (t.type === 'expense') {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    // Trend data (daily totals)
    const trendMap = data.reduce((acc, t) => {
      const dateKey = new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (!acc[dateKey]) acc[dateKey] = { name: dateKey, income: 0, expense: 0 };
      if (t.type === 'income') acc[dateKey].income += t.amount;
      else acc[dateKey].expense += t.amount;
      return acc;
    }, {});
    
    const trendData = Object.values(trendMap).sort((a,b) => new Date(a.name) - new Date(b.name));

    return { income, expenses, pieData, trendData };
  };

  const { income, expenses, pieData, trendData } = calculateStats();

  const getDateMention = () => {
    if (!data || data.length === 0) return 'No Date Range';
    
    const sorted = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    const start = new Date(sorted[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const end = new Date(sorted[sorted.length - 1].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (start === end) return start;
    return `${start} - ${end}`;
  };

  const getDaysDiff = () => {
    if (!data || data.length < 2) return 1;
    const sorted = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    const start = new Date(sorted[0].date);
    const end = new Date(sorted[sorted.length - 1].date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold outfit mb-2">Financial <span className="gradient-text">Insights</span></h2>
          <div className="date-mention-pill w-fit">
            <Calendar size={14} />
            <span>Showing results for: <strong>{getDateMention()}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid md-grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-cyan" />
            <h3 className="text-xl font-bold outfit">Spending Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData.length ? trendData : [{name: 'Empty', expense: 0}]}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor:'#0f1115', border:'1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} 
                itemStyle={{color: '#00f2ff'}}
              />
              <Area type="monotone" dataKey="expense" stroke="#00f2ff" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="text-cyan" />
            <h3 className="text-xl font-bold outfit">Expense Breakdown</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={pieData.length ? pieData : [{name: 'None', value: 1}]} 
                  innerRadius={60} 
                  outerRadius={80} 
                  dataKey="value"
                  paddingAngle={5}
                >
                  {pieData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                  {!pieData.length && <Cell fill="rgba(255,255,255,0.05)" stroke="none" />}
                </Pie>
                <Tooltip contentStyle={{backgroundColor:'#0f1115', border:'none'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 w-full">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
              {pieData.length === 0 && <p className="text-gray-500 text-sm italic">No expenses in this range</p>}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid md-grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <Activity className="text-cyan mb-4" size={32} />
          <h4 className="text-gray-400 text-sm mb-2">Savings Rate</h4>
          <p className="text-2xl font-bold outfit">
            {income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%
          </p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <TrendingDown className="text-rose mb-4" size={32} />
          <h4 className="text-gray-400 text-sm mb-2">Total Expenses</h4>
          <p className="text-2xl font-bold outfit">₹{expenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <IndianRupee className="text-emerald mb-4" size={32} />
          <h4 className="text-gray-400 text-sm mb-2">Average Daily</h4>
          <p className="text-2xl font-bold outfit">₹{Math.round(expenses / getDaysDiff()).toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black-overlay z-100 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
