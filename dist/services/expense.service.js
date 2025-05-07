"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExpenses = getAllExpenses;
exports.addAnExpense = addAnExpense;
exports.deleteAnExpense = deleteAnExpense;
exports.updateExpenseAmount = updateExpenseAmount;
const index_1 = require("../db/index");
function getAllExpenses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield index_1.pool.query(`select id, amount, category, description, date from expenses;`);
            let expenses = [];
            result.rows.forEach((item) => {
                let expense = {
                    id: item.id,
                    amount: item.amount,
                    category: item.category,
                    description: item.description,
                    date: item.date,
                };
                expenses.push(expense);
            });
            return expenses;
        }
        catch (error) {
            const serviceError = new Error(`Failed to fetch all expenses`);
            serviceError.statusCode = 500;
            serviceError.displayMessage = "Error occured while retriveing expenses";
            serviceError.originalError = error.message ? error.message : "Error occured while retriveing expenses";
            throw serviceError;
        }
    });
}
// Added validation for request body
function addAnExpense(expense) {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceError = new Error(`Failed to add an expense`);
        try {
            if (!expense.category || !expense.amount || !expense.date) {
                serviceError.errorType = 1;
                throw serviceError;
            }
            let result = yield index_1.pool.query(`INSERT INTO expenses ("amount","category","description","date","createdAt","updatedAt") VALUES ($1,$2,$3,$4,now(),now()) returning id`, [
                expense.amount, expense.category, expense.description, expense.date
            ]);
            return result.rows[0];
        }
        catch (error) {
            serviceError.statusCode = 500;
            serviceError.displayMessage = "Error occured while adding an expense";
            serviceError.originalError = error.message ? error.message : "Error occured while adding an expense";
            if (serviceError.errorType == 1) {
                serviceError.statusCode = 400;
                serviceError.displayMessage = `Missing required fields: amount, category, and date`;
                serviceError.originalError = `Missing required fields: amount, category, and date`;
            }
            throw serviceError;
        }
    });
}
function deleteAnExpense(expenseId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield index_1.pool.query(`DELETE FROM expenses WHERE id = $1 returning amount,category,date `, [expenseId]);
            return result.rows[0];
        }
        catch (error) {
            const serviceError = new Error(`Failed to delete an expense`);
            serviceError.statusCode = 500;
            serviceError.displayMessage = "Error occured while deleting an expense";
            serviceError.originalError = error.message ? error.message : "Error occured while deleting an expense";
            throw serviceError;
        }
    });
}
// Added validation for request body
function updateExpenseAmount(expense, expenseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceError = new Error(`Failed to update an expense`);
        try {
            if (!expense.amount) {
                serviceError.errorType = 1;
                throw serviceError;
            }
            yield index_1.pool.query(`UPDATE expenses SET "amount" = $1 WHERE id = $2`, [expense.amount, expenseId]);
        }
        catch (error) {
            serviceError.statusCode = 500;
            serviceError.displayMessage = "Error occured while updating an expense";
            serviceError.originalError = error.message ? error.message : "Error occured while updating an expense";
            if (serviceError.errorType == 1) {
                serviceError.statusCode = 400;
                serviceError.displayMessage = `Missing required fields: amount`;
                serviceError.originalError = `Missing required fields: amount`;
            }
            throw serviceError;
        }
    });
}
