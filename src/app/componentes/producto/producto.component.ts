import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

@Input() producto: Producto;

  uid='';
  constructor( public firebaseAuthService: FirebaseAuthService,
               public carritoService: CarritoService ) { }

  ngOnInit() {
   // console.log('el producto es',this.producto);
  }
  addCarrito(){
    this.firebaseAuthService.getUid().then(res=>{
      console.log(res);
      this.uid=res;
    });
    setTimeout(()=>{
      this.carritoService.addProductos(this.producto);
    },100);
  }
}
