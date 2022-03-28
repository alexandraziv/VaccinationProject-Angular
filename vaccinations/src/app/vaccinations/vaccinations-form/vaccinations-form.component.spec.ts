import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationsFormComponent } from './vaccinations-form.component';

describe('VaccinationsFormComponent', () => {
  let component: VaccinationsFormComponent;
  let fixture: ComponentFixture<VaccinationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
