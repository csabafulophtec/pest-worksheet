import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataFormComponent } from './component/data-form/data-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataFormComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pest-worksheet';
}
