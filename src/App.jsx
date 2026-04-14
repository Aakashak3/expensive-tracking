import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, IndianRupee, Plus, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import TransactionList from './components/TransactionList';
import AddExpenseForm from './components/AddExpenseForm';
import Analytics from './components/Analytics';

const API_BASE_URL = 'http://localhost:5000/api/expenses';
const COLORS = ['#00f2ff', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#f43f5e'];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [trashTransactions, setTrashTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialEditData, setInitialEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchTransactions();
    fetchTrashTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/trash/all`);
      setTrashTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching trash data:', err);
    }
  };

  const handleSoftDeleteTransaction = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      if (res.data.expense) setTrashTransactions([res.data.expense, ...trashTransactions]);
    } catch (err) {
      console.error('Error soft deleting transaction:', err);
    }
  };

  const handleRestoreTransaction = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/restore/${id}`);
      setTrashTransactions(prev => prev.filter(t => t._id !== id));
      if (res.data.expense) {
        setTransactions([res.data.expense, ...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) {
      console.error('Error restoring transaction:', err);
    }
  };

  const handleEditClick = (transaction) => {
    setInitialEditData(transaction);
    setIsFormOpen(true);
  };

  const calculateTotals = () => {
    const list = Array.isArray(transactions) ? transactions : [];
    const income = list.filter(t => t?.type === 'income').reduce((acc, t) => acc + (Number(t?.amount) || 0), 0);
    const expenses = list.filter(t => t?.type === 'expense').reduce((acc, t) => acc + (Number(t?.amount) || 0), 0);
    return { income, expenses, balance: income - expenses };
  };

  const totals = calculateTotals();

  const handleAddOrEditTransaction = async (data) => {
    try {
      if (data._id) {
        const res = await axios.put(`${API_BASE_URL}/${data._id}`, data);
        setTransactions(prev => prev.map(t => t._id === data._id ? res.data : t));
      } else {
        const res = await axios.post(API_BASE_URL, data);
        setTransactions([res.data, ...transactions]);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      alert('Failed to save to database. Please make sure MongoDB and backend are running.');
    }
  };

  const pieData = Object.entries(
    transactions.reduce((acc, t) => {
      if (t?.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const dashboardTrendData = Object.values(
    transactions.slice(0, 10).reduce((acc, t) => {
      const dateKey = new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (!acc[dateKey]) acc[dateKey] = { name: dateKey, v: 0 };
      acc[dateKey].v += t.type === 'expense' ? t.amount : 0;
      return acc;
    }, {})
  ).reverse();

  return (
    <div className="app-container pt-32 pb-20 px-6">
      <Navbar onAddClick={() => setIsFormOpen(true)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <AddExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setInitialEditData(null);
        }} 
        onAdd={handleAddOrEditTransaction} 
        initialData={initialEditData}
      />


      {activeTab === 'dashboard' ? (
        <>
          <div className="grid md-grid-cols-3 gap-6 mb-10">
            <StatCard title="Total Balance" amount={totals.balance} icon={<IndianRupee size={24} />} color="#00f2ff" />
            <StatCard title="Total Income" amount={totals.income} icon={<TrendingUp size={24} />} color="#10b981" trend="+12%" />
            <StatCard title="Total Expenses" amount={totals.expenses} icon={<TrendingDown size={24} />} color="#f43f5e" trend="-5%" />
          </div>

          <div className="grid lg-grid-cols-12 gap-6">
            <div className="lg-col-8 space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 chart-box">
                 <h2 className="text-2xl font-bold outfit mb-8">Spending Trend</h2>
                 <ResponsiveContainer width="100%" height={250}>
                   <AreaChart data={dashboardTrendData.length ? dashboardTrendData : [{name:'N/A',v:0}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis dataKey="name" stroke="#4b5563" fontSize={12} />
                     <Tooltip contentStyle={{backgroundColor:'#0f1115', border:'none'}} />
                     <Area type="monotone" dataKey="v" stroke="#00f2ff" fill="rgba(0,242,255,0.1)" strokeWidth={2} />
                   </AreaChart>
                 </ResponsiveContainer>
              </motion.div>

              <div className="grid md-grid-cols-2 gap-6">
                <div className="glass-card p-8 flex flex-col items-center">
                  <h3 className="text-sm font-semibold outfit mb-4 text-gray-400">Categories</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={pieData.length ? pieData : [{v:1}]} innerRadius={40} outerRadius={60} dataKey="value">
                        {pieData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-8">
                   <h3 className="text-sm font-semibold outfit text-gray-400">Monthly Status</h3>
                   <div className="budget-circle-container mt-6">
                      <div className="budget-circle">
                        {Math.round((totals.expenses/5000)*100)}%
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="lg-col-4">
              <TransactionList 
                transactions={transactions} 
                loading={loading} 
                onDelete={handleSoftDeleteTransaction}
                onEdit={handleEditClick} 
              />
            </div>
          </div>
        </>
      ) : activeTab === 'analytics' ? (
        <Analytics />
      ) : (
        <div className="lg-col-12 max-w-4xl mx-auto mt-10">
          <TransactionList 
            transactions={trashTransactions} 
            loading={loading} 
            isTrash={true}
            onRestore={handleRestoreTransaction} 
          />
        </div>
      )}
      
      <button onClick={() => setIsFormOpen(true)} className="fab-mobile md-hidden">
        <Plus size={32} />
      </button>
    </div>
  );
}

export default App;
