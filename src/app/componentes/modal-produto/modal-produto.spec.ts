import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProduto } from './modal-produto';

describe('ModalProduto', () => {
  let component: ModalProduto;
  let fixture: ComponentFixture<ModalProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
