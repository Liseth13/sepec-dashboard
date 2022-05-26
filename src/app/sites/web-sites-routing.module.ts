import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FootersSitesComponent } from './pages/footers-sites/footers-sites.component';
import { MenuComponent } from './pages/menu/menu.component';
import { WebSitesComponent } from './pages/web-sites/web-sites.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sites',
  },
  {
	path: '',
	children: [
		{
			path: 'sites',
			component: WebSitesComponent,
		},
		{
			path: 'footers',
			component: FootersSitesComponent,
		},
		{
			path: 'menu',
			component: MenuComponent,
		},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSitesRoutingModule { }
