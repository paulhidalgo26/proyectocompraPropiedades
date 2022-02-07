import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
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
  pedidos: Pedido[]=[];
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
      const path='pedidos';
      this.nuevosSuscriber=this.fireStoreService.getCollectionAlll<Pedido>(path,'estado','==','enviado').subscribe(res=>{
          if (res.length) {
            this.pedidos=res;
          }
      });


    }
    async getPedidosCulminados(){
      console.log('Entregados');
        const path='pedidos';
        this.entrgadosSuscriber=this.fireStoreService.getCollectionAlll<Pedido>(path,'estado','==','entregado').subscribe(res=>{
            if (res.length) {
              this.pedidos=res;
            }
        });
    }
}
