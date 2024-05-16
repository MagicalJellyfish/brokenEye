import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTabComponent } from './template-tab.component';

describe('TemplateTabComponent', () => {
  let component: TemplateTabComponent;
  let fixture: ComponentFixture<TemplateTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateTabComponent],
    });
    fixture = TestBed.createComponent(TemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
