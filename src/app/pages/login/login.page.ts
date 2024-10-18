import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    console.log("Login")
  }

  login() {
    let extras: NavigationExtras = {
      state: {
        "correo": this.mdl_correo,
        "contrasena": this.mdl_contrasena
      }, replaceUrl: true
    }

    this.db.loginUsuario(this.mdl_correo, this.mdl_contrasena)
      .then(data => {
        if (data == 1) {
          this.db.almacenarSesion(this.mdl_correo, this.mdl_contrasena);
          this.router.navigate(['principal'], extras);
        } else {
          console.log('PLF: Credenciales inválidas')
        }
      })
      .catch(e => console.log('PLF: Error al Iniciar Sesión' + JSON.stringify(e)));
  }

  signUp() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['signup'], extras)
  }

}
