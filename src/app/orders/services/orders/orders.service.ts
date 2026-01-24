import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  getHeaders(): any {
    const apiToken = localStorage.getItem('ApiToken');
    if (apiToken) {
      const token = JSON.parse(apiToken).access_token_local;
      const headersRequest = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
      return headersRequest;
    }
  }

  createOrder(payload: any) {
     return this.http.post<any>(environment.api.URL+`api/orders/create-order`, payload, {
      headers: this.getHeaders(),
    });
  }

  updateOrder(payload: any) {
    return this.http.post(environment.api.URL+`api/orders/update-order`, payload, {
      headers: this.getHeaders(),
    });
  }

  getUserOrders(offset: number, limit: number) {
    return this.http.get<any>(environment.api.URL+`api/orders/getAll?offset=${offset}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }

  delete(orderId: number) {
    return this.http.delete<any>(environment.api.URL+`api/orders/delete/${orderId}`, {
      headers: this.getHeaders(),
    });
  }
}
