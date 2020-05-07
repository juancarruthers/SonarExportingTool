import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectsTabComponent } from './update-projects-tab.component';

describe('UpdateProjectsTabComponent', () => {
  let component: UpdateProjectsTabComponent;
  let fixture: ComponentFixture<UpdateProjectsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProjectsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProjectsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
