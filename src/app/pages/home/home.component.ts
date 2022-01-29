import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

private path='Productos/';
// eslint-disable-next-line @typescript-eslint/member-ordering
productos: Producto[]=[];

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
    this.fireStoreService.getColleccion<Producto>(this.path).subscribe(res=>{
     // console.log(res);
      this.productos=res;
    });
  }

}
