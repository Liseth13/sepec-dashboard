import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FullComponent } from "./BASE/layouts/full/full.component";
import { BlankComponent } from "./BASE/layouts/blank/blank.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { LoginGuard } from "./auth/guards/login.guard";

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
        canActivate : [ LoginGuard ]
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
                loadChildren : () => import("./sites/web-sites.module").then((m) => m.WebSitesModule),
                canActivate : [ AuthGuard ]
              },
              {
                path : 'web-pages',
                loadChildren : () => import("./web-pages/web-pages.module").then((m) => m.WebPagesModule),
                canActivate : [ AuthGuard ]
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
