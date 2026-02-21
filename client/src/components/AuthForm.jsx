import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const defaultForm = { name: '', email: '', password: '' };

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const { register, login } = useAuth();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      setForm(defaultForm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-xl p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Task Management System</h1>
        {isRegister && (
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
            required
          />
        )}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
          required
        />

        <button
          disabled={submitting}
          className="w-full py-2 rounded-lg bg-brand text-white font-semibold hover:bg-brand-soft disabled:opacity-60"
        >
          {submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>

        <p className="text-sm text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsRegister((prev) => !prev)}
            className="ml-2 text-brand font-semibold"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default AuthForm;
