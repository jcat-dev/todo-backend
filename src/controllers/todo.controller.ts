import { Request, Response } from 'express'
import { resError, resSuccessful } from '../controllers/response'
import todoService from '../services/todo.service'

const post = async (req: Request, res: Response) => {
  todoService.create(req.body)
    .then(() => res.status(200).json(resSuccessful))
    .catch(() => {
      return res.status(500).json(resError)
    })
}

const get = (res: Response) => {
  todoService.find()
    .then((data) => res.status(200).json({...resSuccessful, data}))
    .catch(() => res.status(500).json(resError))
}

const getById = (req: Request, res: Response) => {
  const { id } = req.params

  todoService.findById(id)
    .then((data) => res.status(200).json({...resSuccessful, data}))
    .catch(() => res.status(500).json(resError))
}

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = req.body

  todoService.updateById(id , data)
    .then(() => res.status(200).json(resSuccessful))
    .catch(() => res.status(500).json(resError))
}

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params

  todoService.deleteById(id)
    .then(() => res.status(200).json(resSuccessful))
    .catch(() => res.status(500).json(resError))
}

export default {
  post,
  get,
  getById,
  updateById,
  deleteById
}