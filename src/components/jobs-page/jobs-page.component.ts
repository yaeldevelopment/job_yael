import { Component } from '@angular/core';
import { JobsComponent } from "../jobs/jobs.component";

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [JobsComponent],
  templateUrl: './jobs-page.component.html',
  styleUrl: './jobs-page.component.scss'
})
export class JobsPageComponent {

}
