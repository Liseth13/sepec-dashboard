import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// import { AgmCoreModule } from '@agm/core';

import { PagesRoutes } from './pages.routing';
import { StaticPageComponent } from './static-page/static-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { StaticPagesService } from './static-page/static-pages.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    QuillModule.forRoot(),
    CommonModule, RouterModule.forChild(PagesRoutes)],
  declarations: [StaticPageComponent],
  providers: [
    StaticPagesService,
  ],
})
export class PagesModule {}
