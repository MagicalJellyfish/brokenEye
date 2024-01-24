import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDialogTabComponent } from './stat-dialog-tab.component';

describe('StatDialogTabComponent', () => {
  let component: StatDialogTabComponent;
  let fixture: ComponentFixture<StatDialogTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatDialogTabComponent]
    });
    fixture = TestBed.createComponent(StatDialogTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
