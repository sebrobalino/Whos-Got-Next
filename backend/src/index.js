import express from 'express';
import reminderRoutes from './routes/reminderRoutes.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/reminders', reminderRoutes)
app.use('/users', userRoutes)

// Should be last
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})