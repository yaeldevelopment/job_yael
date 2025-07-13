import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowEmployeeComponent } from './row-employee.component';

describe('RowEmployeeComponent', () => {
  let component: RowEmployeeComponent;
  let fixture: ComponentFixture<RowEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
