import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import 'dotenv/config'

import contactsRouter from './routes/api/contacts.js'
import authRouter from './routes/api/auth-router.js'
import avatarRouter from './routes/api/avatar-router.js'


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use('/api/contacts', contactsRouter)
app.use('/api/auth', authRouter)
app.use('/users/avatars', avatarRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;
