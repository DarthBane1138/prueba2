import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("Perfil")
  }

  irSedes() {
    let extras: NavigationExtras ={
      replaceUrl: true
    }
    this.router.navigate(['sedes'], extras)
  }

  irHome(){
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['principal'])
  }
}
