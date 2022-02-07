import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit, OnDestroy {

@Input() producto: Producto;
clientesuscriber: Subscription;
uid=false;
  constructor( public firebaseAuthService: FirebaseAuthService,
               public carritoService: CarritoService,
               public route: Router ) {
                this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
                      if (res) {
                        this.uid=true;
                      }
                    });
               }
  ngOnDestroy() {
    console.log('destroy addproducts');
    this.clientesuscriber.unsubscribe();
  }

  ngOnInit() {
  }
  addCarrito(){
    if (this.uid===false) {
      this.route.navigate(['/perfil']);
    }else{
      this.carritoService.addProductos(this.producto);
    }
  }
}
