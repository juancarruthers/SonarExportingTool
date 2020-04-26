import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoOptionModalComponent } from './two-option-modal.component';

describe('TwoOptionModalComponent Test', () => {
  let component: TwoOptionModalComponent;
  let fixture: ComponentFixture<TwoOptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoOptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoOptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
