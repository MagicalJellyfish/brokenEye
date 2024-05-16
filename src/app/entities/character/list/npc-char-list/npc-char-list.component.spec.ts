import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcCharListComponent } from './npc-char-list.component';

describe('NpcCharListComponent', () => {
  let component: NpcCharListComponent;
  let fixture: ComponentFixture<NpcCharListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NpcCharListComponent],
    });
    fixture = TestBed.createComponent(NpcCharListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
