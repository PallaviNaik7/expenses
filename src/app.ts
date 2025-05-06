import express from 'express';
import expenseRoutes from "./routes/expense.routes"

const app = express();

app.use(express.json());

app.use('/api/', expenseRoutes);

export default app;