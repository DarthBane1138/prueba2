import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';



@NgModule({
  declarations: [NavBarComponent], //declarar cada componente
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ //seccion creada para exportar los componentes 
    NavBarComponent
  ]
})
export class ComponentsModule { }
