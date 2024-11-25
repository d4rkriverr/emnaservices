export interface ExpenseInvoice {
    id: string;
    description: string;
    activity: string;
    total_cost: number;
    payment_method: string;
    agent: string;
    status: string;
    issue_date: string;
    selected?: boolean;
}
export interface ExpensesActivities {
    id: number;
    name: string;
}

export interface ExpensePayMethod {
    id: number;
    name: string;
}