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
const express_1 = require("express");
const expense_service_1 = require("../services/expense.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/*Replace /find and /add to /expenses and /expense respectively to follow REST naming convention*/
router.get('/expenses', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield (0, expense_service_1.getAllExpenses)();
        res.status(200).json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
router.post('/expense', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield (0, expense_service_1.addAnExpense)(req.body);
        res.status(201).json({ message: { expenseId: expense.id } });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
router.delete('/expense/:expenseId', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expense = yield (0, expense_service_1.deleteAnExpense)(parseInt(req.params.expenseId));
        res.status(200).json({ message: `Expense with amount: ${expense.amount}, category: ${expense.category} and date: ${expense.date} deleted successfully` });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
router.patch('/expense/:expenseId', auth_middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, expense_service_1.updateExpenseAmount)(req.body, parseInt(req.params.expenseId));
        res.status(200).json({ message: `Expense amount updated successfully` });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.default = router;
