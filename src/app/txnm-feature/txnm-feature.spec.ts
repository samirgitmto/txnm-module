import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnmFeature } from './txnm-feature';

describe('TxnmFeature', () => {
  let component: TxnmFeature;
  let fixture: ComponentFixture<TxnmFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxnmFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxnmFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
