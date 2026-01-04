/**
 * TypeScript Type Definitions for Protex Wear Frontend
 * These types should match the backend GraphQL schema
 */

// User Types
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  shippingAddress?: Address;
  billingAddress?: Address;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: 'es' | 'en';
  currency: 'EUR' | 'USD';
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
}

// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imageUrls?: string[];
  category?: string;
  tags?: string[];
  specifications?: Record<string, any>;
  dimensions?: ProductDimensions;
  weight?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'in';
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod?: PaymentMethod;
  paymentIntentId?: string;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export type PaymentStatus = 
  | 'pending' 
  | 'succeeded' 
  | 'failed' 
  | 'disputed' 
  | 'refunded';

// Address Types
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Shipping Types
export interface ShippingOption {
  method: string;
  carrier: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  description: string;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

export interface ShippingCalculationRequest {
  destination: {
    country: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
  package: {
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    value: number;
  };
  shippingMethod?: 'standard' | 'express' | 'overnight';
  customerType?: 'retail' | 'wholesale' | 'vip';
  orderValue: number;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search and Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  search?: string;
}

export interface SortOption {
  field: 'name' | 'price' | 'createdAt' | 'stock';
  direction: 'asc' | 'desc';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Admin Types
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesByMonth: { month: string; sales: number }[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Utility Types
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Partial<T> = { [P in keyof T]?: T[P] };
export type Required<T> = { [P in keyof T]-?: T[P] };

// GraphQL Types (for future use)
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export interface GraphQLVariables {
  [key: string]: any;
}