import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscCharCardComponent } from './misc-char-card.component';

describe('MiscCharCardComponent', () => {
  let component: MiscCharCardComponent;
  let fixture: ComponentFixture<MiscCharCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscCharCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscCharCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
