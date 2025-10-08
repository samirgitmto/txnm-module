import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TxnmFeature } from './txnm-feature';
import { TxnmHome } from './components/txnm-home/txnm-home';
import { TransactionList } from './components/transaction-list/transaction-list';
import { UploadPdf } from './components/upload-pdf/upload-pdf';
import { Individuals } from './components/pages/individuals/individuals';
import { Businesses } from './components/pages/businesses/businesses';
import { Register } from './components/pages/register/register';
import { AboutUs } from './components/pages/about-us/about-us';
import { Analytics } from './components/analytics/analytics';
import { DailyAnalytics } from './components/analytics/daily-analytics/daily-analytics';
import { DataGuard } from './guards/data.guard';

const routes: Routes = [
  {
    path: '', 
    component: TxnmFeature,
    children: [
      { path: '', component: TxnmHome, pathMatch: 'full' },
      { path: 'transactions', component: TransactionList },
      { path: 'upload', component: UploadPdf },
      { path: 'individuals', component: Individuals },
      { path: 'businesses', component: Businesses },
      { path: 'register', component: Register },
      { path: 'about', component: AboutUs },
      { path: 'analytics', component: Analytics, canActivate: [DataGuard] },
      { path: 'analytics/daily', component: DailyAnalytics, canActivate: [DataGuard] },
      { path: '**', redirectTo: '' }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TxnmFeatureRoutingModule { }
