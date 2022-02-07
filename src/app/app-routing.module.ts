import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { HomeComponent } from './pages/home/home.component';
import { MispedidosComponent } from './pages/mispedidos/mispedidos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { map } from 'rxjs/operators';
import { PedidosComponent } from './pages/pedidos/pedidos.component';

//senda forama de seguridad ///////////////////////////////////////////////


 //const isAdmin = (next: any) => map((user: any) => !!user && 'MlzAA61X4AODQqlCm3Alcmswjet2' === user.uid);
//, ...canActivate(isAdmin)
const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'set-productos', component: SetProductosComponent  },
  {path: 'carrito', component: CarritoComponent },
  {path: 'mis-pedidos', component: MispedidosComponent },
  {path: 'pedidos', component: PedidosComponent },
  {path: 'perfil', component: PerfilComponent },
  { path: '', component: HomeComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
