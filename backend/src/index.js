import express from 'express';
import reminderRoutes from './routes/reminderRoutes.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/reminders', reminderRoutes)
app.use('/users', userRoutes)
app.use('/courts', courtRoutes)
app.use('/groups', groupRoutes)




// Should be last
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})