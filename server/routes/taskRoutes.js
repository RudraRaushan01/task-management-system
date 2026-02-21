const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  taskValidation,
  taskQueryValidation,
  listTasks,
  getSummary,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} = require('../controllers/taskController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', taskQueryValidation, validate, asyncHandler(listTasks));
router.get('/summary', asyncHandler(getSummary));
router.post('/', taskValidation, validate, asyncHandler(createTask));
router.put('/:id', taskValidation, validate, asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));
router.patch('/:id/complete', asyncHandler(completeTask));

module.exports = router;
