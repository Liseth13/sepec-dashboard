import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';;
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuillModule } from 'ngx-quill';
import { FeatherModule } from 'angular-feather';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PageNamePipe } from './pipes/page-name.pipe';
import { PageContentComponent } from './components/page-content/page-content.component';
import { PostsComponent } from './components/posts/posts.component';
import { BannerComponent } from './pages/banner/banner.component';
import { ItemBannerComponent } from './pages/item-banner/item-banner.component';
import { BannerNamePipe } from './pipes/banner-name.pipe';
import { WebSitesModule } from '../sites/web-sites.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WebPagesComponent,
    PageNamePipe,
    PageContentComponent,
    PostsComponent,
    BannerComponent,
    ItemBannerComponent,
    BannerNamePipe,
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    NgxChartsModule,
    QuillModule.forRoot(),
    FeatherModule,
    HttpClientModule,
    FormsModule,
    NgbModalModule,
    PerfectScrollbarModule,
    WebSitesModule,
    SharedModule
  ],
})
export class WebPagesModule { }
