import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSitesRoutingModule } from './web-sites-routing.module';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';


@NgModule({
  declarations: [
    WebSitesComponent
  ],
  imports: [
    CommonModule,
    WebSitesRoutingModule
  ]
})
export class WebSitesModule { }
