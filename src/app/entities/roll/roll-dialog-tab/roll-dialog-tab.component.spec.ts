import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollDialogTabComponent } from './roll-dialog-tab.component';

describe('RollDialogTabComponent', () => {
  let component: RollDialogTabComponent;
  let fixture: ComponentFixture<RollDialogTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollDialogTabComponent]
    });
    fixture = TestBed.createComponent(RollDialogTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
