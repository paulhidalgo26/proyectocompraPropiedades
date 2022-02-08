import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Propiedad } from 'src/app/models';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

private path='Propiedades/';
// eslint-disable-next-line @typescript-eslint/member-ordering
propiedades: Propiedad[]=[];

  constructor(public menucontrol: MenuController,
              public fireStoreService: FireStoreService) {
                this.loadproductos();
               }

  ngOnInit() {}

  openMenu(){
    console.log('abrir el menu');
    this.menucontrol.toggle('principal');
  }
  loadproductos(){
    this.fireStoreService.getColleccion<Propiedad>(this.path).subscribe(res=>{
     // console.log(res);
      this.propiedades=res;
    });
  }

}
