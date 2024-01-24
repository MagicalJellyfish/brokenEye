import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsEditComponent } from './stats-edit.component';

describe('StatsEditComponent', () => {
  let component: StatsEditComponent;
  let fixture: ComponentFixture<StatsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsEditComponent]
    });
    fixture = TestBed.createComponent(StatsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
