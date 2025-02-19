import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { LoadingStateService } from './services/loading-state.service';
import { TopbarComponent } from './ui/core/topbar/topbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [TopbarComponent, RouterOutlet, MatProgressBarModule],
})
export class AppComponent {
  constructor(protected loadingStateService: LoadingStateService) {}
}
