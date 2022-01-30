import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit ,OnDestroy{

  nuevosSuscriber: Subscription;
  entrgadosSuscriber: Subscription;
  pedidos: Pedido[]=[];


  constructor(public menucontroler: MenuController,
    public fireStoreService: FireStoreService,
    public carritoService: CarritoService,
    public firebaseAuthService: FirebaseAuthService,) {


    }

    ngOnInit() {
    this.getPedidosNuevos();
  }

  ngOnDestroy() {
    if (this.nuevosSuscriber) {
      this.nuevosSuscriber.unsubscribe();
    }
    if (this.entrgadosSuscriber) {
      this.entrgadosSuscriber.unsubscribe();
    }
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
const uid= await this.firebaseAuthService.getUid();
  const path='Clientes/'+ uid+'/pedidos/';
  this.nuevosSuscriber=this.fireStoreService.getCollectionQuery<Pedido>(path,'estado','==','enviado').subscribe(res=>{
      if (res.length) {
        this.pedidos=res;
      }
  });
}

async getPedidosCulminados(){
  console.log('Entregados');
  const uid= await this.firebaseAuthService.getUid();
    const path='Clientes/'+ uid+'/pedidos/';
    this.entrgadosSuscriber=this.fireStoreService.getCollectionQuery<Pedido>(path,'estado','==','entregado').subscribe(res=>{
        if (res.length) {
          this.pedidos=res;
        }
    });
}

}
