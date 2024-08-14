import { Component } from '@angular/core';
import { DynamicDataFormComponent } from '../dynamic-data-form/dynamic-data-form.component';

@Component({
  selector: 'app-control-table',
  standalone: true,
  imports: [DynamicDataFormComponent],
  templateUrl: './control-table.component.html',
  styleUrl: './control-table.component.scss',
})
export class ControlTableComponent {}
