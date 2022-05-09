import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';


@NgModule({
  declarations: [
    WebPagesComponent
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule
  ]
})
export class WebPagesModule { }
