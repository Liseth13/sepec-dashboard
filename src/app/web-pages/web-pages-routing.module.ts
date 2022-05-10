import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';

const routes: Routes = [
  {
    path : '',
    component : WebPagesComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }
