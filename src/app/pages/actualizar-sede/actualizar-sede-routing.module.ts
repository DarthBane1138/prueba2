import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarSedePage } from './actualizar-sede.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarSedePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarSedePageRoutingModule {}
