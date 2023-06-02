import { CartItem } from './cartitem';

export interface Cart {
    id: string;
    items: CartItem[];
}