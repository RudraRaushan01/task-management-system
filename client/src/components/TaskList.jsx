import { motion } from 'framer-motion';

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const TaskList = ({
  tasks,
  filter,
  search,
  sortBy,
  sortOrder,
  setFilter,
  setSearch,
  setSortBy,
  setSortOrder,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    const direction = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'priority') return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
    return (new Date(a.deadline) - new Date(b.deadline)) * direction;
  });

  return (
    <section className="space-y-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow grid md:grid-cols-4 gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 rounded border dark:border-slate-600 bg-transparent">
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="p-2 rounded border dark:border-slate-600 bg-transparent"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 rounded border dark:border-slate-600 bg-transparent">
          <option value="deadline">Sort by deadline</option>
          <option value="priority">Sort by priority</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-2 rounded border dark:border-slate-600 bg-transparent">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {sortedTasks.map((task) => (
          <motion.article
            layout
            key={task._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 space-y-2 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{task.title}</h3>
              <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{task.status}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{task.description || 'No description'}</p>
            <p className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p className="text-sm">Priority: {task.priority}</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => onEdit(task)} className="px-3 py-1 rounded border">Edit</button>
              <button onClick={() => onDelete(task._id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
              {task.status !== 'Completed' && (
                <button onClick={() => onComplete(task._id)} className="px-3 py-1 rounded bg-emerald-600 text-white">
                  Mark Completed
                </button>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default TaskList;
