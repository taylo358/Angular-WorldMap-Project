import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient} from '@angular/common/http'
/*import { MapComponent } from './map/map.component';*/


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Angular-Files');
}
