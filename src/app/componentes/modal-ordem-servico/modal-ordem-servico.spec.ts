import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrdemServico } from './modal-ordem-servico';

describe('ModalOrdemServico', () => {
  let component: ModalOrdemServico;
  let fixture: ComponentFixture<ModalOrdemServico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOrdemServico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOrdemServico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});