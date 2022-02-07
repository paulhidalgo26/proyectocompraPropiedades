import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Pedido } from 'src/app/models';
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

  pedido: Pedido;
  cariitosuscriber: Subscription;
  clientesuscriber: Subscription;
  total: number;
  cantidad: number;



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
    this.pedido=res;
    this.getTotal();
    this.getCantidad();
  });
  }
  initCarrito(){
    this.pedido={
      id: '',
      cliente: null,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }

  getTotal(){
    this.total=0;
  this.pedido.productos.forEach(producto => {
    this.total=(producto.producto.precioReducido)*producto.cantidad + this.total;
  });

  }
  getCantidad(){
    this.cantidad=0;
    this.pedido.productos.forEach(producto => {
      this.cantidad=producto.cantidad + this.cantidad;
    });
  }

  async pedir(){
    if (!this.pedido.productos.length) {
      console.log('Añadir items al carrito');
      return;
    }
    this.pedido.fecha=new Date();
    this.pedido.precioTotal=this.total;
    this.pedido.id=this.fireStoreService.getId();
    const uid= await this.firebaseAuthService.getUid();
    const path='Clientes/'+ uid+'/pedidos/';
    this.fireStoreService.createDoc(this.pedido,path,this.pedido.id).then
    (()=>{
        console.log('guardado con exito');
        this.carritoService.clearCarrito();
    });
    this.route.navigate(['/mis-pedidos']);
}
}
