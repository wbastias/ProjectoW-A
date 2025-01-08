import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterPage } from './enter.page';

describe('EnterPage', () => {
  let component: EnterPage;
  let fixture: ComponentFixture<EnterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
