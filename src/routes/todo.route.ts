import express from 'express'
import todoController from '../controllers/todo.controller'
const router = express.Router()

router.post('/todo', (req, res) => todoController.post(req, res))

router.get('/todo', (_req, res) => todoController.get(res))
router.get('/todo/:id', (req, res) => todoController.getById(req, res))

router.put('/todo/:id', (req, res) => todoController.updateById(req, res))

router.delete('/todo/:id', (req, res) => todoController.deleteById(req, res))

export default router