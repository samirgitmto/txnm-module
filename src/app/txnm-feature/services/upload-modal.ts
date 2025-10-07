import { Injectable } from '@angular/core';
import { TxnmFeatureModule } from '../txnm-feature-module';

@Injectable({
  providedIn: TxnmFeatureModule // Modern way
})
export class UploadModal {

  constructor() { }
}
