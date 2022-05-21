import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './pages/banner/banner.component';
import { FootersSitesComponent } from './pages/footers-sites/footers-sites.component';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';

const routes: Routes = [
  {
    path : '',
    component : WebSitesComponent
  },
  {
    path : 'footers',
    component : FootersSitesComponent
  },
  {
    
   path : ' banner',
   component : BannerComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSitesRoutingModule { }
