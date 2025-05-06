import { Expense } from "../interfaces/expense.interface"
import { pool } from "../db/index"

interface ServiceError extends Error {
    errorType?: Number
    statusCode?: any
    displayMessage?: any
    originalError?: any
}


export async function getAllExpenses(): Promise<Expense[]> {

    try {
        let result = await pool.query(`select id, amount, category, description, date from expenses;`)

        let expenses: Expense[] = []
        result.rows.forEach((item) => {
            let expense: Expense = {
                id: item.id,
                amount: item.amount,
                category: item.category,
                description: item.description,
                date: item.date,

            }
            expenses.push(expense)
        })

        return expenses

    } catch (error: any) {

        const serviceError: ServiceError = new Error(`Failed to fetch all expenses`)

        serviceError.statusCode = 500
        serviceError.displayMessage = "Error occured while retriveing expenses"
        serviceError.originalError = error.message ? error.message : ""
        throw serviceError
    }


}
// Added validation for request body
export async function addAnExpense(expense: Expense): Promise<Expense> {
    const serviceError: ServiceError = new Error(`Failed to add an expense`) as ServiceError
    try {
        if (!expense.category || !expense.amount || !expense.date) {
            serviceError.errorType = 1
            throw serviceError;
        }
        let result = await pool.query(`INSERT INTO expenses ("amount","category","description","date","createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now()) returning id`, [
            expense.amount, expense.category, expense.description, expense.date])
        return result.rows[0]
    } catch (error: any) {
        serviceError.statusCode = 500
        serviceError.displayMessage = "Error occured while adding an expense"
        serviceError.originalError = error.message ? error.message : ""

        if (serviceError.errorType == 1) {
            serviceError.statusCode = 401;
            serviceError.displayMessage = `Missing required fields: amount, category, and date`;
            serviceError.originalError = `Missing required fields: amount, category, and date`;
        }

        throw serviceError
    }
}


export async function deleteAnExpense(expenseId: Number): Promise<Expense> {
    try {
        let result = await pool.query(`DELETE FROM expenses WHERE id = $1 returning amount,category,date `, [expenseId])
        return result.rows[0]
    } catch (error: any) {
        const serviceError: ServiceError = new Error(`Failed to delete an expense`)

        serviceError.statusCode = 500
        serviceError.displayMessage = "Error occured while deleting an expense"
        serviceError.originalError = error.message ? error.message : ""
        throw serviceError
    }
}


export async function updateExpenseAmount(expense: Expense, expenseId: Number) {
    const serviceError: ServiceError = new Error(`Failed to update an expense`) as ServiceError
    try {
        if (!expense.amount) {
            serviceError.errorType = 1
            throw serviceError;
        }
        await pool.query(`UPDATE expenses SET "amount" = $1 WHERE id = $2`, [expense.amount, expenseId])
    } catch (error: any) {
        serviceError.statusCode = 500
        serviceError.displayMessage = "Error occured while updating an expense"
        serviceError.originalError = error.message ? error.message : ""

        if (serviceError.errorType == 1) {
            serviceError.statusCode = 401;
            serviceError.displayMessage = `Missing required fields: amount`;
            serviceError.originalError = `Missing required fields: amount`;
        }

        throw serviceError
    }
}



