import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpCardComponent } from './hp-card.component';

describe('HpCardComponent', () => {
  let component: HpCardComponent;
  let fixture: ComponentFixture<HpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HpCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HpCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
