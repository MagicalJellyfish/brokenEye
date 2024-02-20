import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesViewTabComponent } from './templates-view-tab.component';

describe('TemplatesViewTabComponent', () => {
  let component: TemplatesViewTabComponent;
  let fixture: ComponentFixture<TemplatesViewTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesViewTabComponent]
    });
    fixture = TestBed.createComponent(TemplatesViewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
