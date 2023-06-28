import 'dotenv/config'
import './config/mongooseDB'
import express from 'express'
import todoRoute from './routes/todo.route'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: process.env.ORIGIN,
  methods: 'POST, GET, PUT, DELETE',
  allowedHeaders: 'Content-Type',
}))

app.use(express.json())

app.use('/api', todoRoute)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port http://localhost:${process.env.PORT}`)
})
