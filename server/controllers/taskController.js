const { body, query } = require('express-validator');
const Task = require('../models/Task');

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
  body('completed').optional().isBoolean(),
];

const taskQueryValidation = [
  query('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
  query('sortBy').optional().isIn(['deadline', 'priority', 'createdAt']),
  query('order').optional().isIn(['asc', 'desc']),
  query('search').optional().isString(),
];

const getSortOptions = (sortBy = 'deadline', order = 'asc') => {
  if (sortBy === 'priority') {
    return {
      priority: order === 'asc' ? 1 : -1,
      deadline: 1,
    };
  }

  return {
    [sortBy]: order === 'asc' ? 1 : -1,
  };
};

const listTasks = async (req, res) => {
  const { status, search, sortBy, order } = req.query;

  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(filter).sort(getSortOptions(sortBy, order));

  return res.status(200).json({ tasks });
};

const getSummary = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  const now = new Date();

  const summary = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (task.completed || task.status === 'Completed') acc.completed += 1;
      if (task.status === 'Pending') acc.pending += 1;
      if (!task.completed && task.deadline < now) acc.overdue += 1;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, overdue: 0 }
  );

  return res.status(200).json({ summary });
};

const createTask = async (req, res) => {
  const payload = {
    ...req.body,
    user: req.user.id,
  };

  if (payload.status === 'Completed') payload.completed = true;

  const task = await Task.create(payload);
  return res.status(201).json({ message: 'Task created', task });
};

const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  Object.assign(task, req.body);
  if (task.status === 'Completed') task.completed = true;

  const updated = await task.save();
  return res.status(200).json({ message: 'Task updated', task: updated });
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  return res.status(200).json({ message: 'Task deleted' });
};

const completeTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = 'Completed';
  task.completed = true;
  const updated = await task.save();

  return res.status(200).json({ message: 'Task marked as completed', task: updated });
};

module.exports = {
  taskValidation,
  taskQueryValidation,
  listTasks,
  getSummary,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
};
