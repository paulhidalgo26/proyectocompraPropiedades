import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

    admin=false;
    pedidos=false;
  constructor(private firebaseAuthService: FirebaseAuthService) {
    this.getUid();
  }
//metodo de seguridad //////////////////////////////////////////////
getUid(){
  this.firebaseAuthService.stateAuth().subscribe(res=>{
    if (res!==null) {
      if (res.uid==='6BFdTQiiKTM8xpizUNgAGpstRN42') {
        this.admin=true;
      }else{
        this.admin=false;
        this.pedidos=true;
      }
    }else{
      this.admin=false;
      this.pedidos=false;
    }
  });
}

}
