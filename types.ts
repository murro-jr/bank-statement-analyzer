
export enum TransactionCategory {
    Groceries = "Groceries",
    Utilities = "Utilities",
    Income = "Income",
    Entertainment = "Entertainment",
    Shopping = "Shopping",
    Transportation = "Transportation",
    Restaurants = "Restaurants",
    Health = "Health",
    Travel = "Travel",
    Housing = "Housing",
    Other = "Other",
}

export interface Transaction {
    date: string;
    description: string;
    amount: number;
    category: TransactionCategory;
}
