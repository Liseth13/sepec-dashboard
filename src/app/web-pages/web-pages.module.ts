import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';;
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuillModule } from 'ngx-quill';
import { FeatherModule } from 'angular-feather';
import { HttpClientModule } from '@angular/common/http';
import { SiteNamePipe } from './pipes/site-name.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ContentPagesComponent } from './pages/content-pages/content-pages.component';


@NgModule({
  declarations: [
    WebPagesComponent,
    SiteNamePipe,
    ContentPagesComponent
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
  ]
})
export class WebPagesModule { }
