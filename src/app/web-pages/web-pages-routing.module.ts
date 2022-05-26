import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';
import { BannerComponent } from '../sites/pages/banner/banner.component';
import { ItemBannerComponent } from '../sites/pages/item-banner/item-banner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages',
  },
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
