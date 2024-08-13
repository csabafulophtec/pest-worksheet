import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataFormComponent } from './dynamic-data-form.component';

describe('DynamicDataFormComponent', () => {
  let component: DynamicDataFormComponent;
  let fixture: ComponentFixture<DynamicDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicDataFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
