import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from '../../../model/customer';
import { DocumentFile } from '../../../model/document-file';
import { CustomerService } from '../../../service/customer.service';
import { DocumentFileService } from '../../../service/document-file.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss',
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  customerService = inject(CustomerService);
  documentFileService = inject(DocumentFileService);
  route = inject(ActivatedRoute);
  activatedRouterSub?: Subscription;
  sub?: Subscription;
  customer?: Customer;
  router = inject(Router);
  documentsSub?: Subscription;
  documentFileSub?: Subscription;
  documentFiles: DocumentFile[] = [];
  id: string = '';

  ngOnInit(): void {
    this.activatedRouterSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.sub = this.customerService
        .getCustomerById(this.id)
        .subscribe((customer) => {
          this.customer = customer;
        });
    });
    this.documentsSub = this.customerService
      .getDocumentFiles(this.id)
      .subscribe((resp) => {
        this.documentFiles = resp;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.activatedRouterSub?.unsubscribe();
    this.documentFileSub?.unsubscribe();
  }

  goToWorksheet(id?: string) {
    this.router.navigate([`/worksheet/${id}`]);
  }

  goToTable(id?: string) {
    this.router.navigate([`/control-table/${id}`]);
  }

  viewPdf(fileName: string) {
    //const pdfUrl = `http://localhost:3000/uploads/${fileName}`;

    // Open the PDF in a new window
    //window.open(pdfUrl, '_blank');

    this.documentFileSub = this.documentFileService
      .getFileByFileName(fileName)
      .subscribe((resp) => {
        const url = window.URL.createObjectURL(resp);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url); // Clean up URL object after opening
      });
  }

  navigateBack() {
    this.router.navigate([`/customers`]);
  }
}
