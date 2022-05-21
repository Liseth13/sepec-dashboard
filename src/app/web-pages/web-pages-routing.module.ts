import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from '../sites/pages/banner/banner.component';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';

const routes: Routes = [
  {
		path: '',
		children: [
			{
				path: 'pages',
				component: WebPagesComponent,
			},
			{
				path: 'banner',
				component: BannerComponent,
			},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }
