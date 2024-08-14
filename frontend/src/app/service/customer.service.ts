import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { DocumentFile } from '../model/document-file';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http = inject(HttpClient);

  API_URL = 'http://localhost:3000/';

  getCustomers() {
    return this.http.get<Customer[]>(this.API_URL + 'customers');
  }

  getCustomerById(id: string) {
    return this.http.get<Customer>(this.API_URL + 'customers/' + id);
  }

  addCustomers(customer: Customer) {
    return this.http.post<Customer>(this.API_URL + 'customers', customer);
  }

  savePdfToCustomer(
    id: string,
    payload: { fileName: string; docBase64String: string }
  ) {
    console.log(payload);
    return this.http.post(this.API_URL + `customers/${id}/files`, payload);
  }

  getDocumentFiles(id: string) {
    return this.http.get<DocumentFile[]>(
      this.API_URL + `customers/${id}/files`
    );
  }
}
