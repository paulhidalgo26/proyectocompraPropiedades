import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscriber, Subscription } from 'rxjs';
import { Cliente } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FireStorageService } from 'src/app/services/fire-storage.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente={
    uid:'',
    email:'',
    nombre:'',
    celular:'',
    foto:'',
    referencia:'',
    ubicacion:null

  };

  newFile: any;
  uid='';
  suscriberUserInfo: Subscription;
  ingresarEnable=false;


  constructor(public menucontroler: MenuController,
    public firebaseAuthService: FirebaseAuthService,
    public fireStoreService: FireStoreService,
    public fireStorageService: FireStorageService,
    public carritoService: CarritoService) {

      this.firebaseAuthService.stateAuth().subscribe(res=>{
        if (res !== null) {
          this.uid=res.uid;
           this.getuserUid(this.uid);
        }else{
          this.initCliente();
        }
      });
    }

  async ngOnInit() {

    const id=await this.firebaseAuthService.getUid();
    console.log(id);

  }

  initCliente(){

    this.uid='';
    this.cliente={
      uid:'',
      email:'',
      nombre:'',
      celular:'',
      foto:'',
      referencia:'',
      ubicacion:null
    };
  }


  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }
  async newImageUp(event: any){

    if(event.target.files && event.target.files[0]){
      this.newFile=event.target.files[0];
      const reader=new FileReader();
      reader.onload=((image)=>{
       this.cliente.foto= image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  async registrarse(){

      const credenciales={
        email:this.cliente.email,
        password:this.cliente.celular,
      };

     const res= await this.firebaseAuthService.registrar(credenciales.email,credenciales.password).catch(error=>{
       console.log('error =>',error);
     });

     const uid=await this.firebaseAuthService.getUid();
     this.cliente.uid=uid;
     this.guardarUser();
  }

  async guardarUser(){


    const path='Clientes';
    const name=this.cliente.nombre;
    if (this.newFile !== undefined) {
      const res= await this.fireStorageService.uploadImage(this.newFile, path,name);

      this.cliente.foto=res;
    }


    this.fireStoreService.createDoc(this.cliente,path,this.cliente.uid).then(
    res => {
          console.log('guardado con exito');

    }).catch(error =>{

  });
  }

  async salir(){

      this.firebaseAuthService.logout();
      this.suscriberUserInfo.unsubscribe();
    ;
  }

  getuserUid(uid: string){
    const path='Clientes';
    this.suscriberUserInfo=  this.fireStoreService.getDoc<Cliente>(path,uid).subscribe(res=>{
      this.cliente=res ;
    });
  }

  ingresar(){
    const credenciales={
      email:this.cliente.email,
      password:this.cliente.celular,
    };
    this.firebaseAuthService.login(credenciales.email,credenciales.password).then(res=>{
      console.log('ingreso con exito');
    });
  }

}
