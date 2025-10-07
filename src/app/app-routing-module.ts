import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefAppHome } from './def-app-home/def-app-home';
import { App } from './app';
import { TxnmFeatureModule } from './txnm-feature/txnm-feature-module';

const routes: Routes = [
  { path: '', redirectTo: '/txnm', pathMatch: 'full' },
  { path: 'home', component: DefAppHome },
  { path: 'txnm', loadChildren: () => import('./txnm-feature/txnm-feature-module').then(m => m.TxnmFeatureModule) },
  { path: '**', redirectTo: '/txnm' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
