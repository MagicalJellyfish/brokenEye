import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscInfoCardComponent } from './misc-info-card.component';

describe('MiscInfoCardComponent', () => {
  let component: MiscInfoCardComponent;
  let fixture: ComponentFixture<MiscInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
