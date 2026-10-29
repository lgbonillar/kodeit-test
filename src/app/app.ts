import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RulesComponent } from '../components/rules.component';

@Component({
  imports: [ RulesComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ReglasNotificacion');
}
