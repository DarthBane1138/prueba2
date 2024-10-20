import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  correo: string = '';
  contrasena: string = '';
  mdl_actual: string = '';
  mdl_nueva: string = '';
  mdl_confirmacion: string = '';
  v_visible = false;
  v_mensaje = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    let extras = this.router.getCurrentNavigation()?.extras;
    if (extras?.state) {
      this.correo = extras?.state['correo']
      this.contrasena = extras?.state['contrasena']
    } else {
      console.log("No se recibieron parámetros")
    }
  }

  cambiarContrasena() {
    this.db.loginUsuario(this.correo, this.mdl_actual)
      .then(data => {
        if(data == 0) {
          this.v_visible = true;
          this.v_mensaje = 'La Contraseña Actual no es Correcta'
        } else {
          if(this.mdl_nueva != this.mdl_confirmacion) {
            this.v_visible = true;
            this.v_mensaje = 'Las Contraseñas Ingresadas no coinciden';
          } else {
            this.db.cambiarContrasena(this.correo, this.mdl_actual, this.mdl_nueva);
              this.router.navigate(['login'], { replaceUrl: true })
            }
        }
      })
    }
}
