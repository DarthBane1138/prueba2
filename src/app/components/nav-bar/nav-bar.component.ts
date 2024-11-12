import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar', //selector para el html
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

     // Navegación a página de sedes
     irSedes() {
      this.router.navigate(['sedes'], { replaceUrl: true })
    }
  
      // Navegación a Perfil
    irPerfil() {
      this.router.navigate(['profile'], { replaceUrl: true })
    }
    
    // Navegación a página principal
    irHome(){
      this.router.navigate(['principal'], { replaceUrl: true })
    }

  //Navegacion a asignaturas
  irAsignaturas(){
    this.router.navigate(['asignaturas'], { replaceUrl: true });
  }
}
