package com.sneha.paysight.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private Map<String, BigDecimal> expenseByCategory;
    private List<MonthlyData> monthlyData;

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal v) { this.totalIncome = v; }
    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal v) { this.totalExpense = v; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal v) { this.balance = v; }
    public Map<String, BigDecimal> getExpenseByCategory() { return expenseByCategory; }
    public void setExpenseByCategory(Map<String, BigDecimal> v) { this.expenseByCategory = v; }
    public List<MonthlyData> getMonthlyData() { return monthlyData; }
    public void setMonthlyData(List<MonthlyData> v) { this.monthlyData = v; }

    public static class MonthlyData {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;

        public String getMonth() { return month; }
        public void setMonth(String v) { this.month = v; }
        public BigDecimal getIncome() { return income; }
        public void setIncome(BigDecimal v) { this.income = v; }
        public BigDecimal getExpense() { return expense; }
        public void setExpense(BigDecimal v) { this.expense = v; }
    }
}