import { useEffect, useState } from 'react';

const initialTask = {
  title: '',
  description: '',
  deadline: '',
  priority: 'Medium',
  status: 'Pending',
};

const TaskForm = ({ onSubmit, editingTask, onCancel, loading }) => {
  const [form, setForm] = useState(initialTask);

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        deadline: editingTask.deadline ? new Date(editingTask.deadline).toISOString().split('T')[0] : '',
      });
      return;
    }
    setForm(initialTask);
  }, [editingTask]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
    if (!editingTask) setForm(initialTask);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow space-y-3">
      <h2 className="font-semibold text-lg">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Task title"
        className="w-full p-2 rounded border dark:border-slate-600 bg-white dark:bg-slate-700"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 rounded border dark:border-slate-600 bg-white dark:bg-slate-700"
        rows={3}
      />
      <div className="grid sm:grid-cols-3 gap-2">
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="p-2 rounded border dark:border-slate-600 bg-white dark:bg-slate-700"
          required
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="p-2 rounded border dark:border-slate-600 bg-white dark:bg-slate-700"
        >
          {['Low', 'Medium', 'High'].map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 rounded border dark:border-slate-600 bg-white dark:bg-slate-700"
        >
          {['Pending', 'In Progress', 'Completed'].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="bg-brand text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
