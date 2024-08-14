import { Routes } from '@angular/router';
import { ControlTableComponent } from './component/control-table/control-table.component';
import { AddCustomerComponent } from './component/customers/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './component/customers/customer-details/customer-details.component';
import { ListCustomerComponent } from './component/customers/list-customer/list-customer.component';
import { DataFormComponent } from './component/data-form/data-form.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customers', component: ListCustomerComponent },
  { path: 'add-customer', component: AddCustomerComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  { path: 'worksheet/:id', component: DataFormComponent },
  { path: 'control-table/:id', component: ControlTableComponent },
];
