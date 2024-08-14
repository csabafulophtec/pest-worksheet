import { Routes } from '@angular/router';
import { ControlTableComponent } from './component/control-table/control-table.component';
import { DataFormComponent } from './component/data-form/data-form.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'work', component: DataFormComponent },
  { path: 'control-table', component: ControlTableComponent },
];
