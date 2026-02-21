import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Moon, Sun, LogOut, CheckCircle2, Clock3, AlertTriangle, ListTodo } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks', { params: { status: filter || undefined, search, sortBy, order: sortOrder } });
    setTasks(data.tasks);
  };

  const fetchSummary = async () => {
    const { data } = await api.get('/tasks/summary');
    setSummary(data.summary);
  };

  const refreshAll = async () => {
    await Promise.all([fetchTasks(), fetchSummary()]);
  };

  useEffect(() => {
    refreshAll().catch(() => toast.error('Failed to load tasks'));
  }, [filter, search, sortBy, sortOrder]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      return;
    }
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, [darkMode]);

  const handleSubmitTask = async (payload) => {
    setLoading(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created');
      }
      setEditingTask(null);
      await refreshAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      await refreshAll();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      toast.success('Task completed');
      await refreshAll();
    } catch {
      toast.error('Could not mark as completed');
    }
  };

  const cards = [
    { label: 'Total Tasks', value: summary.total, icon: ListTodo },
    { label: 'Completed', value: summary.completed, icon: CheckCircle2 },
    { label: 'Pending', value: summary.pending, icon: Clock3 },
    { label: 'Overdue', value: summary.overdue, icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      <aside className="w-64 hidden md:block bg-white dark:bg-slate-800 p-6 shadow-lg">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">Stay focused and ship your day.</p>
      </aside>

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <header className="flex flex-wrap gap-3 justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Track, prioritize and complete your tasks.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDarkMode((prev) => !prev)} className="p-2 rounded-lg border">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={logout} className="p-2 rounded-lg bg-slate-800 text-white dark:bg-slate-700">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <article key={label} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
              <Icon className="text-brand" />
            </article>
          ))}
        </section>

        <TaskForm onSubmit={handleSubmitTask} editingTask={editingTask} onCancel={() => setEditingTask(null)} loading={loading} />

        <TaskList
          tasks={tasks}
          filter={filter}
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setFilter={setFilter}
          setSearch={setSearch}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
};

export default Dashboard;
