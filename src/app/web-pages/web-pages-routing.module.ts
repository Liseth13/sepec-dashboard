import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPagesComponent } from './pages/web-pages/web-pages.component';
import { BannerComponent } from './pages/banner/banner.component';
import { ItemBannerComponent } from './pages/item-banner/item-banner.component';

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
		{
			path : 'items-banner',
			component : ItemBannerComponent
		}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebPagesRoutingModule { }
