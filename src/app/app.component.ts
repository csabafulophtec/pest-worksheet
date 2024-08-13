import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataFormComponent } from './component/worksheet/data-form/data-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pest-worksheet';
}
