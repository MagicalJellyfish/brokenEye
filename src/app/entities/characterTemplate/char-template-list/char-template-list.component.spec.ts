import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharTemplateListComponent } from './char-template-list.component';

describe('CharTemplateListComponent', () => {
  let component: CharTemplateListComponent;
  let fixture: ComponentFixture<CharTemplateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharTemplateListComponent]
    });
    fixture = TestBed.createComponent(CharTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
