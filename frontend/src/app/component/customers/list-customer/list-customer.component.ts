import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
  Subscription,
} from 'rxjs';
import { Customer } from '../../../model/customer';
import { CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.scss',
})
export class ListCustomerComponent implements OnInit, OnDestroy {
  customerService = inject(CustomerService);

  model: any;

  allCustomer: Customer[] = [];
  customers: Customer[] = [];

  filteredCustomers = this.customers;

  searchControl = new FormControl('');

  serviceSub?: Subscription;
  valueChangeSub?: Subscription;

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => {
        if (term.length < 2) {
          this.customers = this.allCustomer;
          return [];
        } else {
          return this.customers
            .map((m) => m.name)
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10);
        }
      })
    );

  ngOnInit(): void {
    this.getCustomers();
    this.valueChangeSub = this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) => this.filterCustomers(term ?? ''))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
    this.valueChangeSub?.unsubscribe();
  }

  getCustomers() {
    this.serviceSub = this.customerService.getCustomers().subscribe((resp) => {
      this.allCustomer = resp;
      this.customers = resp;
    });
  }

  filterCustomers(term: string): void {
    if (term) {
      this.filteredCustomers = this.customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.address.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.filteredCustomers = this.customers;
    }
  }

  onItemSelected(evt: any) {
    this.customers = this.customers.filter((f) =>
      f.name.toLowerCase().includes(evt.item.toLowerCase())
    );
  }
}
