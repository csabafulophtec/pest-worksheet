import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../service/customer.service';

type DynamicDataRow = FormGroup<{
  observation1: FormControl<string | null>;
  observation2: FormControl<string | null>;
  note: FormControl<string | null>;
}>;

type DynamicDataFormGroup = FormGroup<{
  workplace: FormControl<string | null>;
  date: FormControl<string | null>;
  usedAcids: FormControl<string | null>;
  usedItems: FormControl<string | null>;
  rowData: FormArray<DynamicDataRow>;
}>;

@Component({
  selector: 'app-dynamic-data-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './dynamic-data-form.component.html',
  styleUrl: './dynamic-data-form.component.scss',
})
export class DynamicDataFormComponent implements OnInit, OnDestroy {
  id: string = '';
  activatedRouterSub?: Subscription;
  route = inject(ActivatedRoute);
  myForm!: DynamicDataFormGroup;
  customerService = inject(CustomerService);
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
            workplace: new FormControl(resp.address),
            date: new FormControl(''),
            usedAcids: new FormControl(''),
            usedItems: new FormControl(''),
            rowData: new FormArray<DynamicDataRow>([]),
          });
        });
    });
  }

  ngOnDestroy(): void {
    this.activatedRouterSub?.unsubscribe();
    this.sub?.unsubscribe();
  }

  addNewRow() {
    this.myForm.controls.rowData.push(this.generateRowData());
  }

  generateRowData() {
    return new FormGroup({
      observation1: new FormControl(''),
      observation2: new FormControl(''),
      note: new FormControl(''),
    });
  }

  get t() {
    return this.myForm.controls.rowData as FormArray;
  }
  get rowDataFormGroup() {
    return this.t.controls as FormGroup[];
  }

  get rowData() {
    return this.myForm.get('rowData') as FormArray;
  }

  onSubmit() {
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

    doc.setFontSize(20);
    doc.text('Kártevő-ellenőrzési táblázat', 15, 15, { align: 'left' });
    doc.addImage('./assets/logo.png', 130, 15, 70, 20);
    doc.setFontSize(10);
    doc.text(
      'JELMAGYARÁZAT:\nRágcsálóetető szerelvény: Rágásnyom-R Egér-E, Patkány-P\nNincs Fogyasztás-NF Fogyás mértéke: 0-10\nMonitoring szerelmény/Elektromos rovarcsapda:\nCsótánymentes-CS Rovarmentes-RM\nCserélve-CS Ellenőrizve-ELL Telítettség: 0-10',
      15,
      20
    );

    doc.setFontSize(12);
    doc.text('Munkavégzés helye: ' + data.workplace, 15, 50);
    doc.text('Időpontja: ' + data.date, 15, 55);
    doc.text('Szerelvény típusa: ' + data.usedItems, 15, 60);
    doc.text('Felhasznált írtószer: ' + data.usedAcids, 15, 65);

    autoTable(doc, {
      head: [['Sorszám', 'Észlelés-1', 'Észlelés-2', 'Megjegyzés']],
      body: this.getTableBody(),
      startY: 75,
      showHead: 'firstPage',
      theme: 'grid',
    });
    const docBase64String = doc.output('datauristring', {
      filename: `kartevo-ellenorzesi-tablazat-${this.getCurrentFormattedDate()}.pdf`,
    });
    const payload = {
      fileName: `kartevo-ellenorzesi-tablazat-${this.getCurrentFormattedDate()}.pdf`,
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

  getTableBody() {
    const ret = [];
    let idx = 1;
    for (let i of this.myForm.value.rowData ?? []) {
      ret.push([idx, i.observation1 ?? '', i.observation2 ?? '', i.note ?? '']);
    }
    return ret;
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

  navigateBack() {
    this.router.navigate([`/customers/${this.id}`]);
  }
}
