import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../service/customer.service';
import { SignaturePadComponent } from '../shared/signature-pad/signature-pad.component';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SignaturePadComponent,
    RouterModule,
  ],
  templateUrl: './data-form.component.html',
  styleUrl: './data-form.component.scss',
})
export class DataFormComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  customerService = inject(CustomerService);
  myForm!: FormGroup;
  clientSignature: string = '';
  workerSignature: string = '';
  activatedRouterSub?: Subscription;
  id: string = '';
  sub?: Subscription;
  customerSub?: Subscription;
  router = inject(Router);
  success = false;

  ngOnInit(): void {
    this.activatedRouterSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.customerSub = this.customerService
        .getCustomerById(this.id)
        .subscribe((resp) => {
          this.myForm = new FormGroup({
            clientName: new FormControl(resp.name),
            workplace: new FormControl(resp.address),
            date: new FormControl(''),
            subject: new FormControl(''),
            usedAcids: new FormControl(''),
            usedItems: new FormControl(''),
            other: new FormControl(''),
          });
        });
    });
  }

  ngOnDestroy(): void {
    this.activatedRouterSub?.unsubscribe();
    this.sub?.unsubscribe();
    this.customerSub?.unsubscribe();
  }

  onSubmit(): void {
    this.generatePDF();
  }

  generatePDF() {
    const data = this.myForm.value;

    var doc = new jsPDF();

    doc.addFont(
      './assets/AbhayaLibre-Regular.ttf',
      'AbhayaLibre-Regular',
      'normal'
    );
    doc.setFont('AbhayaLibre-Regular');

    doc.setFontSize(40);
    doc.text('Munkalap', 105, 30, { align: 'center' });
    doc.addImage('./assets/logo.png', 145, 15, 50, 18);

    doc.setFontSize(16);
    doc.text('Megrendelő: ' + data.clientName, 25, 60);
    doc.text('Munkavégzés helye: ' + data.workplace, 25, 80);
    doc.text('Időpontja: ' + data.date, 25, 100);
    doc.text('Tárgya: ' + data.subject, 25, 120);
    doc.text('Felhasznált írtószer: ' + data.usedAcids, 25, 140);
    doc.text('Kihelyezett szerelvény: ' + data.usedItems, 25, 160);
    doc.text('Megjegyzés, munka utáni teendők: ' + data.other, 25, 180);

    doc.setFontSize(12);

    doc.addImage(this.clientSignature, 15, 250, 50, 18);
    doc.text('Megrendelő (munkavégzést igazoló)', 40, 280, { align: 'center' });

    doc.addImage(this.workerSignature, 145, 250, 50, 18);
    doc.text('Munkavégző', 170, 280, { align: 'center' });

    const docBase64String = doc.output('datauristring', {
      filename: `munkalap-${this.getCurrentFormattedDate()}.pdf`,
    });
    const payload = {
      fileName: `munkalap-${this.getCurrentFormattedDate()}.pdf`,
      docBase64String,
    };
    this.sub = this.customerService
      .savePdfToCustomer(this.id, payload)
      .subscribe((resp) => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate([`/customers/${this.id}`]);
        }, 2000);
      });

    //doc.save(`munkalap-${this.getCurrentFormattedDate()}-.pdf`);
  }

  onClientSignatureCreated(base64Data: string) {
    this.clientSignature = base64Data;
  }

  onWorkerSignatureCreated(base64Data: string) {
    this.workerSignature = base64Data;
  }

  getCurrentFormattedDate(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }

  isFormValid() {
    const isFormValid =
      this.workerSignature?.length > 0 && this.clientSignature?.length > 0;
    return isFormValid;
  }

  navigateBack() {
    this.router.navigate([`/customers/${this.id}`]);
  }
}
