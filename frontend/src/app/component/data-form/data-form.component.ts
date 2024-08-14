import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import { SignaturePadComponent } from '../shared/signature-pad/signature-pad.component';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SignaturePadComponent,
    RouterModule,
  ],
  templateUrl: './data-form.component.html',
  styleUrl: './data-form.component.scss',
})
export class DataFormComponent {
  myForm!: FormGroup;
  clientSignature: string = '';
  workerSignature: string = '';

  ngOnInit(): void {
    this.myForm = new FormGroup({
      clientName: new FormControl(''),
      workplace: new FormControl(''),
      date: new FormControl(''),
      subject: new FormControl(''),
      usedAcids: new FormControl(''),
      usedItems: new FormControl(''),
      other: new FormControl(''),
    });
  }

  onSubmit(): void {
    console.log('Form Data:', this.myForm.value);
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
    doc.save(`munkalap-${this.getCurrentFormattedDate()}-.pdf`);
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
    console.log(isFormValid);
    return isFormValid;
  }
}
