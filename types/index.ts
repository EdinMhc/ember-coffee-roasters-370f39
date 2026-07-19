export interface Product {
  id: number;
  name: string;
  slug: string;
  origin: string;
  price: number;
  roast_level: string;
  tasting_notes: string;
  image_url: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  grind: 'whole-bean' | 'filter' | 'espresso';
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderLineItem {
  product_id: number;
  product_name: string;
  quantity: number;
  grind: string;
  unit_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  subtotal: number;
  shipping: number;
  total: number;
  line_items: OrderLineItem[];
  created_at: string;
}
