export interface OrderItem {
    sku: string;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderRequest {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: OrderItem[];
}
