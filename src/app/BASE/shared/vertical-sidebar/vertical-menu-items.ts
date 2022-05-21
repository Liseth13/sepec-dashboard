import { RouteInfo } from "./vertical-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "/dash/sites",
    title: "Sitios webs",
    icon: "Layout",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [
      {
        path: "/dash/sites/sites",
        title: "Sitios",
        icon: "Layout",
        class: "",
        label: "",
        labelClass: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "/dash/sites/footers",
        title: "Footer",
        icon: "Layout",
        class: "",
        label: "",
        labelClass: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  {
    path: "/dash/web-pages",
    title: "Páginas webs",
    icon: "Book",
    class: "",
    label: "",
    labelClass: "",
    extralink: false,
    submenu: [
      {
        path: "/dash/web-pages/pages",
        title: "Páginas",
        icon: "",
        class: "",
        label: "",
        labelClass: "",
        extralink: false,
        submenu: [],
      },
      {
        path: "./dash/web-pages/banner",
        title: "Banner",
        icon: "",
        class: "",
        label: "",
        labelClass: "",
        extralink: false,
        submenu: [],
      },
    ],
  },
  
  
  
  // {
  //   path: "../../dash/sites/",
  //   title: "Sitio Web",
  //   icon: "Layout",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // }
  // {
  //   path: "/apps/tasks",
  //   title: "Tasks",
  //   icon: "Layout",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
  // {
  //   path: "../../../pages/static-page",
  //   title: "Páginas",
  //   icon: "Layout",
  //   class: "",
  //   label: "",
  //   labelClass: "",
  //   extralink: false,
  //   submenu: [],
  // },
];