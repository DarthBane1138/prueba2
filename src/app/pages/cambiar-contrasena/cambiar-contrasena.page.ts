import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
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
  mdl_contrasena_nueva: string = '';
  mdl_confirmacion: string = '';
  v_visible = false;
  v_mensaje = '';
  mdl_carrera_nueva: string = '';
  mdl_correo_actual: string = '';
  isAlertOpen = false;
  alertButtons = ['OK'];
  mdl_escuela: string = '';
  carrerasDispo: string[] = []; //carga de carreras

  //Lista de carreras filtradas por escuela
  carreras: { [key: string]: string[] } = {
    'Administracion y Negocios': ['Técnico En Operaciones Logísticas', 'Administración Pública', 'Técnico En Gestión Logística', 'Técnico En Comercio Exterior', 'Ingeniería En Comercio Exterior', 'Técnico En Administración', 'Ingeniería En Gestión Logística', 'Ingeniería En Marketing Digital', 'Auditoría', 'Administración De Empresas', 'Contabilidad Tributaria', 'Ingeniería En Administración Mención Finanzas', 'Ingeniería En Administración Mención Innovación Y Emprendimiento'],
    'Comunicacion': ['Relaciones Públicas Y Comunicación Organizacional', 'Publicidad', 'Ingeniería En Sonido', 'Comunicación Audiovisual', 'Animación Digital', 'Tecnología En Sonido E Iluminación', 'Técnico Audiovisual', 'Actuación'],
    'Construccion': ['Técnico En Prevención De Riesgos Laborales', 'Ingeniería En Prevención De Riesgos', 'Ingeniería En Construcción', 'Restauración De Bienes Patrimoniales', 'Técnico Tipógrafo Geomático', 'Técnico En Construcción', 'Técnico En Instalaciones Y Proyectos Eléctricos', 'Dibujo Y Modelamiento Arquitectónico Y Estructural', 'Técnico En Prevención De Riesgos'],
    'Diseño': ['Diseño Gráfico', 'Diseño Industrial', 'Diseño De Vestuario', 'Diseño De Ambientes', 'Ilustración', 'Desarrollo Y Diseño Web'],
    'Gastronomia': ['Gastronomia', 'Gastronomia Internacional'],
    'Informatica y Telecomunicaciones': ['Ingeniería En Informática', 'Técnico En Redes Y Telecomunicaciones', 'Ingeniería En Redes Y Telecomunicaciones', 'Desarrollo De Aplicaciones', 'Ingeniería En Infraestructura Tecnológica', 'Analista Programador', 'Analista Programador Computacional', 'Ingeniería En Desarrollo De Software'],
    'Ingenieria y Recursos Naturales': ['Técnico en Operación y Supervisión de Procesos Mineros', 'Ingeniería en Mantenimiento Industrial', 'Técnico en Control y Monitoreo Remoto de Procesos Mineros', 'Técnico Veterinario y Pecuario', 'Técnico en Maquinaria y Vehículos Pesados', 'Técnico en Geología', 'Técnico en Electricidad y Automatización Industrial', 'Técnico en Calidad de Alimentos', 'Ingeniería en Medio Ambiente', 'Ingeniería en Mecánica Automotriz y Autotrónica', 'Ingeniería en Maquinaria y Vehículos Pesados', 'Ingeniería en Electricidad y Automatización Industrial', 'Ingeniería Agrícola', 'Técnico Agrícola', 'Técnico en Mantenimiento Industrial' ],
    'Salud': ['Técnico de Radiodiagnóstico y Radioterapia', 'Técnico en Química y Farmacia', 'Informática Biomédica', 'Técnico de Laboratorio Clínico y Banco de Sangre', 'Técnico en Odontología', 'Técnico de Enfermería', 'Preparador Físico'],
    'Turismo y Hospitalidad': ['Tecnico en Turismo y Hospitalidad', 'Administración en Turismo y Hospitalidad Mención Gestión de Destinos Turísticos', 'Administración en Turismo y Hospitalidad Mención Hospitality Management', 'Administración en Turismo y Hospitalidad Mención Gestión para el Ecoturismo', 'Administración en Turismo y Hospitalidad Mención Administración Hotelera']
  };

  constructor(private router: Router, private api: ApisService, private db: DbService) { }

  ngOnInit() {
    this.db.obtenerSesion().then(data => {
      this.correo = data.correo;
      this.contrasena = data.contrasena;
      console.log("PLF: Credenciales Obtenidas de de tabla usuario: ")
      console.log("PLF: Correo:  " + this.correo)
      console.log("PLF: Contraseña: " + this.contrasena)
      this.mdl_correo_actual = this.correo
    })
  }

  // Actualización API y BD
  async actualizarUsuario() {
    let datos = this.api.modificacionUsuario(
      this.mdl_correo_actual,
      this.mdl_contrasena_nueva,
      this.mdl_carrera_nueva
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      this.v_visible = false;
      this.isAlertOpen = true;
      this.v_mensaje = json.message;
      await this.db.verificarUsuario(this.correo);
      this.db.actualizarDatos(this.mdl_contrasena_nueva, this.mdl_carrera_nueva, this.correo, this.contrasena)
      /* console.log("Datos actualizados en la base de datos") */
      setTimeout(() => {
        this.isAlertOpen = false;
        this.router.navigate(['login'], { replaceUrl: true});
      }, 3000)
      this.cerrarSesion();
    } else {
      this.v_visible = true;
      this.v_mensaje = json.message;
      }
  }

  // Función para cerrar sesión
  cerrarSesion() {
    this.db.eliminarSesion()
    this.router.navigate(['login'], { replaceUrl: true })
  }

  // Función para abrir alerta
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  //Funcion para devolver la carrera seleccionada segun su escuela
  opEscuela() {
    this.carrerasDispo = this.carreras[this.mdl_escuela] || []; //una carrera disponible o una lista vacia
  }

}
