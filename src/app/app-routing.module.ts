import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FullComponent } from "./BASE/layouts/full/full.component";
import { BlankComponent } from "./BASE/layouts/blank/blank.component";

export const Approutes: Routes = [
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/dashboard/dashboard1", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./BASE/dashboards/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "starter",
        loadChildren: () =>
          import("./BASE/starter/starter.module").then((m) => m.StarterModule),
      },
      {
        path: "component",
        loadChildren: () =>
          import("./BASE/component/component.module").then(
            (m) => m.ComponentsModule
          ),
      },
      {
        path: "cards",
        loadChildren: () =>
          import("./BASE/cards/cards.module").then((m) => m.CardsModule),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./BASE/icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("./BASE/form/forms.module").then((m) => m.FormModule),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./BASE/table/tables.module").then((m) => m.TablesModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./BASE/charts/charts.module").then((m) => m.ChartModule),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./BASE/widgets/widgets.module").then((m) => m.WidgetsModule),
      },
      {
        path: "ecom",
        loadChildren: () =>
          import("./BASE/ecommerce/ecom.module").then((m) => m.EcomModule),
      },
      {
        path: "timeline",
        loadChildren: () =>
          import("./BASE/timeline/timeline.module").then((m) => m.TimelineModule),
      },
      {
        path: "extra-component",
        loadChildren: () =>
          import("./BASE/extra-component/extra-component.module").then(
            (m) => m.ExtraComponentModule
          ),
      },
      {
        path: "apps",
        loadChildren: () =>
          import("./BASE/apps/apps.module").then((m) => m.AppsModule),
      },

      {
        path: "maps",
        loadChildren: () =>
          import("./BASE/maps/maps.module").then((m) => m.MapsModule),
      },
      // {
      //   path: "pages",
      //   loadChildren: () =>
      //     import("./pages/pages.module").then((m) => m.PagesModule),
      // },
      {
        path: "sample-pages",
        loadChildren: () =>
          import("./BASE/sample-pages/sample-pages.module").then(
            (m) => m.SamplePagesModule
          ),
      },
      {
        path: "sub-child",
        loadChildren: () =>
          import("./BASE/sub-child/sub-child.module").then((m) => m.SubchildModule),
      },
      {
        path : 'dash',
        children : [
          {
            path : '',
            redirectTo : 'web-sites',
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
                path : 'posts',
                loadChildren : () => import("./posts/posts.module").then(m => m.PostsModule)
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
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./BASE/authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/authentication/404",
  },
];
