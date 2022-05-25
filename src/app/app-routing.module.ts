import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FullComponent } from "./BASE/layouts/full/full.component";
import { BlankComponent } from "./BASE/layouts/blank/blank.component";

export const Approutes: Routes = [
  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path : '',
        redirectTo : 'authentication',
        pathMatch : 'full'
      },
      {
        path: "authentication",
        loadChildren: () =>
          import("./auth/auth.module").then(
            (m) => m.AuthModule
          ),
      },
    ],
  },
  {
    path: "",
    component: FullComponent,
    children: [
      {
        path : 'dash',
        children : [
          {
            path : '',
            redirectTo : 'sites',
            pathMatch : 'full'
          },
          {
            path : '',
            children : [
              {
                path : 'sites',
                loadChildren : () => import("./sites/web-sites.module").then((m) => m.WebSitesModule)
              },
              {
                path : 'web-pages',
                loadChildren : () => import("./web-pages/web-pages.module").then((m) => m.WebPagesModule)
              }
            ]
          }
        ]
      }
    ],
  },
  
  {
    path: "**",
    redirectTo: "authentication",
  },
  
];
