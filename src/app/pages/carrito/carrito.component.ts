import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Compra, Propiedad } from 'src/app/models';
import { FireStoreService } from 'src/app/services/fire-store.service';
import {CarritoService} from 'src/app/services/carrito.service';
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit,OnDestroy {

  propiedad: Compra;
  cariitosuscriber: Subscription;
  clientesuscriber: Subscription;




  constructor(public menucontroler: MenuController,
    public fireStoreService: FireStoreService,
    public carritoService: CarritoService,
    public firebaseAuthService: FirebaseAuthService,
    public route: Router) {

      this.initCarrito();
      this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
        console.log(res);
        if (res !== null) {
          this.loadPedidos();
        }
      });
  }

ngOnDestroy() {
  console.log('carrito componecte destroy');
  if (this.cariitosuscriber) {
    this.cariitosuscriber.unsubscribe();
    this.clientesuscriber.unsubscribe();
}
}
  ngOnInit() {
   this.initCarrito();
  }

 openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }
  loadPedidos(){
  this.cariitosuscriber= this.carritoService.getCarrito().subscribe(res=>{
    this.propiedad=res;
  });
  }
  initCarrito(){
    this.propiedad={
      id: '',
      cliente: null,
      productos: [],
      estado: 'enviado',
      fecha: new Date(),
    };
  }



  async pedir(){
    if (!this.propiedad.productos.length) {
      console.log('Añadir items al carrito');
      return;
    }
    this.propiedad.fecha=new Date();
    this.propiedad.id=this.fireStoreService.getId();
    const uid= await this.firebaseAuthService.getUid();
    const path='Clientes/'+ uid+'/compras/';
    this.fireStoreService.createDoc(this.propiedad,path,this.propiedad.id).then
    (()=>{
        console.log('guardado con exito');
        this.carritoService.clearCarrito();
    });
    this.route.navigate(['/mis-pedidos']);
}
}
