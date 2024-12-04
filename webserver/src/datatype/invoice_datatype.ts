export interface Invoice {
    id: number;
    fullname: string;
    phone_number: string;

    product_name: string;
    product_price: number;
    product_discount: number;
    advance_payment: number;

    agent: string;
    issue_date: string;
}