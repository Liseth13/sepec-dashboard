import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSitesRoutingModule } from './web-sites-routing.module';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FootersSitesComponent } from './pages/footers-sites/footers-sites.component';
import { BannerComponent } from './pages/banner/banner.component';
import { ItemBannerComponent } from './pages/item-banner/item-banner.component';
import { BannerNamePipe } from './pipes/banner-name.pipe';

@NgModule({
  declarations: [
    WebSitesComponent,
    FootersSitesComponent,
    BannerComponent,
    ItemBannerComponent,
    BannerNamePipe
  ],
  imports: [
    CommonModule,
    WebSitesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],  
})
export class WebSitesModule { }
