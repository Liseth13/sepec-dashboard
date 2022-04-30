import { Routes } from '@angular/router';

import { StaticPageComponent } from './static-page/static-page.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'static-page',
        component: StaticPageComponent,
        data: {
          title: 'Páginas Estáticas',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Páginas Estáticas' }
          ]
        }
      }
    ]
  }
];
