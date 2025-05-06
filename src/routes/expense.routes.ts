import { Router } from "express";
import { getAllExpenses, addAnExpense, deleteAnExpense, updateExpenseAmount } from "../services/expense.service"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

/*Replace /find and /add to /expenses and /expense respectively to follow REST naming convention*/
router.get('/expenses', authenticate, async (req, res) => {

    try {
        const expenses = await getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error })
    }

})


router.post('/expense', authenticate, async (req, res) => {
    try {
        const expense = await addAnExpense(req.body);
        res.status(201).json({ message: { expenseId: expense.id } });
    } catch (error) {
        res.status(500).json({ message: error })
    }

})

router.delete('/expense/:expenseId', authenticate, async (req, res) => {
    try {
        const expense = await deleteAnExpense(parseInt(req.params.expenseId));
        res.status(200).json({ message: `Expense with amount: ${expense.amount}, category: ${expense.category} and date: ${expense.date} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error })
    }
})


router.patch('/expense/:expenseId', authenticate, async (req, res) => {
    try {
        await updateExpenseAmount(req.body, parseInt(req.params.expenseId));
        res.status(200).json({ message: `Expense amount updated successfully` });
    } catch (error) {
        res.status(500).json({ message: error })
    }
})


export default router;