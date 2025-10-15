import express from 'express';
import reminderRoutes from './routes/reminderRoutes.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';

const app = express()
const port = 3000

app.use(express.json())
app.use('/reminders', reminderRoutes)

// Should be last
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})