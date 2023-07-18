import express from 'express'
import todoController from '../controllers/todo.controller'
const router = express.Router()

router.post('/', (req, res) => todoController.post(req, res))

router.get('/', (_req, res) => todoController.get(res))
router.get('/:id', (req, res) => todoController.getById(req, res))

router.put('/:id', (req, res) => todoController.updateById(req, res))

router.delete('/', (_req, res) => todoController.deleteAllCompleted(res))
router.delete('/:id', (req, res) => todoController.deleteById(req, res))

export default router