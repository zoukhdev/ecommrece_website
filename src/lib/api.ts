// API service layer for making HTTP requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  // Products API
  async getProducts(params?: { category?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ products: any[] }>(endpoint);
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/api/products/${id}`);
  }

  async createProduct(product: any) {
    return this.request<{ product: any }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request<{ product: any }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders(params?: { status?: string; customerId?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    
    const queryString = queryParams.toString();
    const endpoint = `/api/orders${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ orders: any[] }>(endpoint);
  }

  async getOrder(id: string) {
    return this.request<{ order: any }>(`/api/orders/${id}`);
  }

  async createOrder(order: any) {
    return this.request<{ order: any }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async updateOrder(id: string, updates: any) {
    return this.request<{ order: any }>(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Analytics API
  async getAnalytics() {
    return this.request<{ analytics: any }>('/api/analytics');
  }

  // Auth API
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Categories API
  async getCategories() {
    return this.request<{ categories: any[] }>('/api/categories');
  }

  async getCategory(id: string) {
    return this.request<{ category: any }>(`/api/categories/${id}`);
  }

  // Customers API
  async getCustomers() {
    return this.request<{ customers: any[] }>('/api/customers');
  }

  async getCustomer(id: string) {
    return this.request<{ customer: any }>(`/api/customers/${id}`);
  }

  async createCustomer(customer: any) {
    return this.request<{ customer: any }>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }
}

export const apiService = new ApiService();
