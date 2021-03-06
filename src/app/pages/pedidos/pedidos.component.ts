import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Compra } from 'src/app/models';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  nuevosSuscriber: Subscription;
  entrgadosSuscriber: Subscription;
  pedidos: Compra[]=[];
  constructor(public menucontroler: MenuController,
    public firebaseAuthService: FirebaseAuthService,
    public fireStoreService: FireStoreService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegmet(ev: any){
    const opc=ev.detail.value;
    if (opc==='entregados') {
            this.getPedidosCulminados();
    }
    if (opc==='nuevos') {
           this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos(){
    console.log('Nuevos');
      const path='compras';
      let startAt=null;
      console.log(this.pedidos.length);
      if (this.pedidos.length) {
        startAt=this.pedidos[this.pedidos.length -1].fecha;
      }

      this.nuevosSuscriber=this.fireStoreService.getCollectionAlll<Compra>(path,'estado','==','visto',startAt).subscribe(res=>{
        console.log(res);
        if (res.length) {
            res.forEach(compra=>{
              this.pedidos.push(compra);
            });
          }
      });


    }
    async getPedidosCulminados(){
      console.log('Entregados');
        const path='compras';
        const startAt=null;
        this.entrgadosSuscriber=this.fireStoreService.getCollectionAlll<Compra>(path,'estado','==','entregado',startAt).subscribe(res=>{
            if (res.length) {
              this.pedidos=res;
            }
        });
    }


    cargarmas(){
      this.getPedidosNuevos();

    }
}
