import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnterPage } from './enter.page';

const routes: Routes = [
  {
    path: '',
    component: EnterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterPageRoutingModule {}
