import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { async } from '@firebase/util';
import { AlertController, LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';
import { Propiedad } from 'src/app/models';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';


@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit, OnDestroy {

  propiedades: Propiedad[]=[];
  newPropiedad: Propiedad;
  loading: any;
  newfile='';
  newimage='';
  enableNewProducto= false;
  editar=false;
  private path= 'Propiedades/';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clientesuscriber: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  uid='';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  uidadmin='';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  productosuscribe: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  getproductosSuscriber: Subscription;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  admin=false;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  boton=false;

  constructor(public menucontrol: MenuController,
              public toastController: ToastController,
              public fireStoreService: FireStoreService,
              public fireStorageService: FireStorageService,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public firebaseAuthService: FirebaseAuthService,
              public modalController: ModalController,
              public rote: Router) {

                this.clientesuscriber= this.firebaseAuthService.stateAuth().subscribe(res=>{
                  console.log(res);
                  if (res !== null) {
                    if (res.uid==='') {
                      this.boton=true;
                      console.log(this.uid);
                        this.admin=true;
                        this.uidadmin=res.uid;
                        this.getProductos();
                    }else{
                      this.boton=true;
                      this.uid=res.uid;
                      this.getProductosCliente();
                    }
                  }else{
                    this.boton=false;
                    if (this.clientesuscriber) {
                      this.clientesuscriber.unsubscribe();
                    }
                    if (this.getproductosSuscriber) {
                      this.getproductosSuscriber.unsubscribe();
                    }
                    if (this.productosuscribe) {
                      this.productosuscribe.unsubscribe();
                    }
                  }
                });
              }


  ngOnDestroy(){
    console.log('destroy producto');
  }

  ngOnInit() {}

  openMenu(){
    console.log('abrir el menu');
    this.menucontrol.toggle('principal');
  }

  async guaradarproducto(){
    this.presentLoading();
    const path='Propiedades/';
    const name=this.newPropiedad.ciudad;
    if (this.editar===false) {
      console.log('false');
      const res= await this.fireStorageService.uploadImage(this.newfile,path,name);
    this.newPropiedad.foto=res;
    console.log('fin de la funcion');
    this.fireStoreService.createDoc(this.newPropiedad,this.path,this.newPropiedad.id).then(resp=>{
    this.loading.dismiss();

    this.presentToast('Guaradado con exito');
    }).catch(err=>{
      this.presentToast('error al guardar');
    });
  }else{
    console.log('true');
    this.fireStoreService.createDoc(this.newPropiedad,this.path,this.newPropiedad.id).then(resp=>{
      console.log(resp);
      this.loading.dismiss();
      this.presentToast('Guaradado con exito');
      }).catch(err=>{
        this.presentToast('error al guardar');
      });
  }

  }

  getProductos(){
    this.getproductosSuscriber= this.fireStoreService.getColleccion<Propiedad>(this.path).subscribe(res=>{
        console.log(res);
       this.propiedades=res;
      });
  }


   getProductosCliente(){
    console.log('productos del cliente');
      this.productosuscribe=this.fireStoreService.getCollectionQueryProductos<Propiedad>(this.path,'idc','==',this.uid).subscribe(res=>{
        console.log(this.uid);
          if (res.length) {
            this.propiedades=res;
          }
      });
    }



  async deleteProducto(propiedad: Propiedad){

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
            this.fireStoreService.deleteDoc(this.path,propiedad.id).then(res=>{
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
  if (this.boton===false) {
    this.rote.navigate(['/perfil']);
    return;
  }
  this.enableNewProducto=true;
  this.newPropiedad={
    direccion: '',
    ciudad: '',
    ubicacion: null,
    precio: null,
    telefono: null,
    descripcion: '',
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
     this.newPropiedad.foto= image.target.result as string;
    });
    reader.readAsDataURL(event.target.files[0]);

  }

}

async addDireccion(){
  const ubicacion=this.newPropiedad.ubicacion;
  // eslint-disable-next-line prefer-const
  let positioninput={
    lat:-2.898116,
    lng: -78.9995814999
  };
  console.log('posicion por defecto', ubicacion);
  if (ubicacion !== null) {
    positioninput=ubicacion;
  }

  const modalAdd = await this.modalController.create({
    component: GooglemapsComponent,
    mode: 'ios',
    swipeToClose:true,
    componentProps: {posicion: positioninput}
  });
  await modalAdd.present();
  const {data}=await modalAdd.onWillDismiss();
  if (data) {
    console.log('data => ',data);
    this.newPropiedad.ubicacion=data.pos;
    console.log('propiedad', this.newPropiedad);
  }
}

}
