import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordUidEditComponent } from './discord-uid-edit.component';

describe('DiscordUidEditComponent', () => {
  let component: DiscordUidEditComponent;
  let fixture: ComponentFixture<DiscordUidEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscordUidEditComponent],
    });
    fixture = TestBed.createComponent(DiscordUidEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
