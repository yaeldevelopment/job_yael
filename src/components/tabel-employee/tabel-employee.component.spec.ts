import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelEmployeeComponent } from './tabel-employee.component';

describe('TabelEmployeeComponent', () => {
  let component: TabelEmployeeComponent;
  let fixture: ComponentFixture<TabelEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
