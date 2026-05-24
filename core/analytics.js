/**
 * Analytics Engine
 * Purpose: Business Health Calculation, Trend Analysis, and Formatting
 */

export const Analytics = {
    // 1. Calculate Business Health Score (0-100)
    // Formula: (Revenue vs Expense) + (Customer Growth) - (Pending Payments)
    calculateHealthScore(metrics) {
        const { revenue, expenses, pending, target } = metrics;
        let score = 70; // Base score

        if (revenue > expenses) score += 15;
        if (pending < (revenue * 0.1)) score += 10;
        if (revenue >= target) score += 5;
        
        return Math.min(score, 100); // Max 100
    },

    // 2. Trend Analysis (Is business going up or down?)
    getTrend(currentValue, previousValue) {
        if (!previousValue) return 0;
        const diff = ((currentValue - previousValue) / previousValue) * 100;
        return diff.toFixed(1); // Returns percentage like +12.5 or -5.0
    },

    // 3. Currency Formatter (Indian Context/Global)
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumSignificantDigits: 3
        }).format(amount);
    },

    // 4. Growth Graph Placeholder Logic
    // Ye future mein Chart.js ya ApexCharts ke saath integrate hoga
    getGraphData(dataArray) {
        return dataArray.map(item => ({
            label: item.date,
            value: item.amount
        }));
    }
};
