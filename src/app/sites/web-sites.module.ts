import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSitesRoutingModule } from './web-sites-routing.module';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FootersSitesComponent } from './pages/footers-sites/footers-sites.component';
import { MenuComponent } from './pages/menu/menu.component';
import { SiteNamePipe } from './pipes/site-name.pipe';
import { MenuNamePipe } from './pipes/menu-name.pipe';
import { LevelMenuPipe } from './pipes/level-menu.pipe';

@NgModule({
  declarations: [
    WebSitesComponent,
    FootersSitesComponent,
    MenuComponent,
    SiteNamePipe,
    MenuNamePipe,
    LevelMenuPipe
  ],
  imports: [
    CommonModule,
    WebSitesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],  
  exports : [
    SiteNamePipe
  ]
})
export class WebSitesModule { }
