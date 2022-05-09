import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSitesComponent } from './web-sites.component';

describe('WebSitesComponent', () => {
  let component: WebSitesComponent;
  let fixture: ComponentFixture<WebSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
