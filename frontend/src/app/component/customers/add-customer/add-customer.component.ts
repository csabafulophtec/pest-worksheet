import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss',
})
export class AddCustomerComponent implements OnDestroy {
  customerService = inject(CustomerService);
  sub?: Subscription;
  router = inject(Router);
  success = false;

  customerForm = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
  });

  onSubmit() {
    const customerFormValue = this.customerForm.value;
    this.sub = this.customerService
      .addCustomers({
        name: customerFormValue.name ?? '',
        address: customerFormValue.address ?? '',
      })
      .subscribe((resp) => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate([`/customers`]);
        }, 2000);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  navigateBack() {
    this.router.navigate([`/customers`]);
  }
}
