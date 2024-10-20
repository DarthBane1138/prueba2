import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarSedePage } from './actualizar-sede.page';

describe('ActualizarSedePage', () => {
  let component: ActualizarSedePage;
  let fixture: ComponentFixture<ActualizarSedePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarSedePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
