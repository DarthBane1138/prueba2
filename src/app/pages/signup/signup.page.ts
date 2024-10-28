import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApisService } from 'src/app/services/apis.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_contrasena_conf: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';
  mdl_escuela: string = ''; //
  mdl_sede: string = '';
  v_visible = false;
  v_mensaje: string = '';
  isAlertOpen = false;
  alertButtons = ['OK'];

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
  carrerasDispo: string[] = []; //carga de carreras

  constructor(private router: Router, private db: DbService, private api: ApisService) { }

  ngOnInit() {
  }

  //Funcion para devolver la carrera seleccionada segun su escuela
  opEscuela() {
    this.carrerasDispo = this.carreras[this.mdl_escuela] || []; //una carrera disponible o una lista vacia
  }

  // Redirección a página de inicio
  inicio() {
    this.router.navigate(['login'], { replaceUrl: true })
  }

  // Función para registrar (API y BD)
  async registrar() {
    // Registro de datos en API
    let datos = this.api.creacionUsuario(
      this.mdl_correo, this.mdl_contrasena,
      this.mdl_nombre, this.mdl_apellido,
      this.mdl_carrera
    );

    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    if(json.status == "success") {
      this.v_mensaje = json.message;
      this.isAlertOpen = true;
      /*console.log("PLF: Usuario Creado")
      console.log("PLF: Correo: " + this.mdl_correo)
      console.log("PLF: Contraseña: " + this.mdl_contrasena)
      console.log("PLF: Nombre: " + this.mdl_nombre)
      console.log("PLF: Apellido: " + this.mdl_apellido)
      console.log("PLF: Carrera: " + this.mdl_carrera)
      console.log("PLF: Sede: " + this.mdl_sede)*/
      // Registro de Usuarios en Base de datos local
      this.db.almacenarUsuario(
        this.mdl_correo,
        this.mdl_contrasena,
        this.mdl_nombre,
        this.mdl_apellido,
        this.mdl_carrera,
        this.mdl_sede
      );
      setTimeout(() => {
          this.isAlertOpen = false;
          this.router.navigate(['login'], { replaceUrl: true })
      }, 3000);
    } else {
      console.log("PLF: Error al Crear Usuario: " + json.message)
      this.v_visible = true;
      this.v_mensaje =  json.message;
    }
  }

  // Función para abrir Toast
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

}
