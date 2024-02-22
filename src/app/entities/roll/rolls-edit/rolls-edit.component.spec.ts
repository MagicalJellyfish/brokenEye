import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollsEditComponent } from './rolls-edit.component';

describe('RollsEditComponent', () => {
  let component: RollsEditComponent;
  let fixture: ComponentFixture<RollsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollsEditComponent]
    });
    fixture = TestBed.createComponent(RollsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
