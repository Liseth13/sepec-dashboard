import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';

const routes: Routes = [
  {
    path : '',
    component : WebSitesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSitesRoutingModule { }
