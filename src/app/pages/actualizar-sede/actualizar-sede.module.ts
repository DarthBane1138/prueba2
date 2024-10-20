import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarSedePageRoutingModule } from './actualizar-sede-routing.module';

import { ActualizarSedePage } from './actualizar-sede.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizarSedePageRoutingModule
  ],
  declarations: [ActualizarSedePage]
})
export class ActualizarSedePageModule {}
