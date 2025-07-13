import { Component, EventEmitter, Input, Output } from '@angular/core';
import  { Job } from '../../models/Jobs';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-row-employee',
  imports: [],
  templateUrl: './row-employee.component.html',
  styleUrl: './row-employee.component.scss'
})
export class RowEmployeeComponent {
  @Input() job!: Job;
  @Output() edit = new EventEmitter<Job>();
  @Output() delete = new EventEmitter<Job>();

  emitEdit() {
 
    this.edit.emit(this.job);
  }

  deleteJobObj() {

    this.delete.emit(this.job);
  }
}
