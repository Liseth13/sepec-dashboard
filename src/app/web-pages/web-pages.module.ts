import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebPagesRoutingModule } from './web-pages-routing.module';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuillModule } from 'ngx-quill';
import { FeatherModule } from 'angular-feather';


@NgModule({
  declarations: [
    WebPagesComponent
  ],
  imports: [
    CommonModule,
    WebPagesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    NgxChartsModule,
    QuillModule.forRoot(),
    FeatherModule
  ]
})
export class WebPagesModule { }
