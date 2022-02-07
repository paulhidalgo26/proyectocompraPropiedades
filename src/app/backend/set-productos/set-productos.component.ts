import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models';
import { FireStorageService } from 'src/app/services/fire-storage.service';


import { FireStoreService } from 'src/app/services/fire-store.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';


@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[]=[];
  newProducto: Producto;
  loading: any;
  newProduct= '';
  newfile='';
  newimage='';
  enableNewProducto= false;
  editar=false;
  private path= 'Productos/';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clientesuscriber: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  uid='';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  uidadmin='';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  productosuscribe: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  admin=false;

  constructor(public menucontrol: MenuController,
              public toastController: ToastController,
              public alertController: AlertController,
              public fireStoreService: FireStoreService,
              public fireStorageService: FireStorageService,
              public loadingController: LoadingController,
              public firebaseAuthService: FirebaseAuthService) {
                this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
                  console.log(res);
                  if (res !== null) {
                    if (res.uid==='phTnOHMce5TCgF662tXyLK3EPp52') {
                      console.log(this.uid);
                        this.admin=true;
                        this.uidadmin=res.uid;
                        this.getProductos();
                    }else{
                      this.uid=res.uid;
                      this.getProductosCliente();
                    }
                  }else{
                    this.clientesuscriber.unsubscribe();
                  }
                });
              }

  ngOnInit() {
  //  this.getProductosCliente();
  }

  openMenu(){
    console.log('abrir el menu');
    this.menucontrol.toggle('principal');
  }

  async guaradarproducto(){
    this.presentLoading();

    const path='Productos';
    const name=this.newProducto.nombre;
    if (this.editar===false) {
      console.log('false');
      const res= await this.fireStorageService.uploadImage(this.newfile, path,name);
    this.newProducto.foto=res;
    console.log('fin de la funcion');
    this.fireStoreService.createDoc(this.newProducto,this.path,this.newProducto.id).then(resp=>{
    this.loading.dismiss();

    this.presentToast('Guaradado con exito');
    }).catch(err=>{
      this.presentToast('error al guardar');
    });
  }else{
    console.log('true');
    this.fireStoreService.createDoc(this.newProducto,this.path,this.newProducto.id).then(resp=>{
      this.loading.dismiss();

      this.presentToast('Guaradado con exito');
      }).catch(err=>{
        this.presentToast('error al guardar');
      });
  }

  }

  getProductos(){
      this.fireStoreService.getColleccion<Producto>(this.path).subscribe(res=>{
        console.log(res);
       this.productos=res;
      });
  }


   getProductosCliente(){
    console.log('productos del cliente');
      this.productosuscribe=this.fireStoreService.getCollectionQueryProductos<Producto>(this.path,'idc','==',this.uid).subscribe(res=>{
        console.log(this.uid);
          if (res.length) {
            this.productos=res;
          }
      });
    }



  async deleteProducto(producto: Producto){

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea Eliminar <strong>text</strong> este producto',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ok',
          handler: () => {
            console.log('Confirm Okay');
            this.fireStoreService.deleteDoc(this.path,producto.id).then(res=>{
              this.presentToast('Eliminado con exito');
              this.alertController.dismiss();
            }).catch(rerror=> {
              this.presentToast('No se pudo eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
}

nuevo(){
  this.enableNewProducto=true;
  this.newProducto={
    nombre: '',
    precioNormal: null,
    precioReducido: null,
    foto: '',
    id: this.fireStoreService.getId(),
    idc: this.uid,
    fecha: new Date(),
  };
}


async presentLoading() {
this.loading = await this.loadingController.create({
    cssClass: 'normal',
    message: 'Guardando...',
    duration: 2000
  });
  await this.loading.present();

}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    cssClass: 'normal',
    color:'success',
    message: msg,
    duration: 2000
  });
  toast.present();

}

async newimageupload(event: any){

  if(event.target.files && event.target.files[0]){
    this.newfile=event.target.files[0];
    const reader=new FileReader();
    reader.onload=((image)=>{
     this.newProducto.foto= image.target.result as string;
    });
    reader.readAsDataURL(event.target.files[0]);

  }

}



}
