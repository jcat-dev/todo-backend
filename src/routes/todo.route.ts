import express from 'express'
import { createTodo, deleteAllCompletedTodo, deleteTodoById, getTodos, sortTodos, toggleCompletedTodoById } from '../controllers/todo.controller'
const router = express.Router()

router.post('/', (req, res) => createTodo(req, res))
router.get('/', (_req, res) => getTodos(res))
router.put('/sort', (req, res) => sortTodos(req, res))
router.put('/:id', (req, res) => toggleCompletedTodoById(req, res))
router.delete('/', (_req, res) => deleteAllCompletedTodo(res))
router.delete('/:id', (req, res) => deleteTodoById(req, res))

export default router