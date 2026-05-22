export interface Product {
  id: string;
  name: string;
  category: 'iphones' | 'samsung' | 'pixels' | 'tablets' | 'laptops' | 'accessories';
  priceZMW: number;
  priceUSD: number;
  originalPriceZMW?: number;
  originalPriceUSD?: number;
  image: string;
  description: string;
  specs: string[];
  isHotDeal?: boolean;
  promoBadge?: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: {
    color?: string;
    storage?: string;
  };
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  deliveryMethod: 'delivery' | 'pickup';
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
  location: string;
}

export interface PromoFlyer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  dealEnds: string;
  image: string;
  category: string;
}
