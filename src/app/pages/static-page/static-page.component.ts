import { Component, OnInit } from '@angular/core';
import {
  NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Pages } from './Pages.structure';

import { CustomAdapter, CustomDateParserFormatter } from './static-pages-date.service';
import { StaticPagesService } from './static-pages.service';
import { SocialMedia } from './SocialMedia.structure';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class StaticPageComponent implements OnInit {
  /**
   * Control información de Páginas Estáticas y Sitio Web
   */
  arrayPage: Pages[] = [];

  arrayPageFilter: Pages [];

  arrayPageWeb: Pages[] = [];

  socialMediaArray: SocialMedia[] = [];

  selectedAP: Pages;

  // Control de vistas
  id_view = 0;

  infoLocalStorage = null;

  // Contador de páginas habilitadas
  totalPages = 0;

  // Páginas habilitadas totales
  completedcount = 0;

  // Sección o Página
  titleTaskSection = '';

  borderClass = false;

  /**
   * Controlador de pagination
   */
  page = 0;

  pageTotalData = 0;

  pageSize = 6;

  // Campos necesarios para los modal
  posModal = 0;

  // Array info de Modal
  dataModal = [
    {
      icon: 'fas fa-pencil-alt',
      title: 'Esquema de colores',
    },
    {
      icon: 'fas fa-pencil-alt',
      title: 'Redes Sociales',
    },
  ];

  pageForm: FormGroup;

  webForm: FormGroup;

  colorForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public pagesService: StaticPagesService,
    public fb: FormBuilder,
    public routes: Router,
  ) {
    // Carga de data del storage
    this.infoLocalStorage = this.dataPages();
    this.refrescarDataTotal(0, 0, 50, 50, true);
    this.initForms();
    // if (this.infoLocalStorage != null) {
    //   this.arrayPage = this.infoLocalStorage;
    // } else {
    //   this.arrayPage = [];
    // }
  }

  /**
   * Limita la cantidad de sitios web que puede crear
   *
   * @returns Botón de agregar sitios Web desactivado
   */
  buttonWebIsDisabled() {
    const size:number = this.arrayPage.filter((st) => st.domain !== undefined).length;
    if (size >= 3) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
  }

  /**
   * Agrega en la base de datos los sitios o páginas web
   *
   * @param funtion Campo que distbingue entre página o sitio web
   * @returns Página o sitio web creado
   */
  addPages(funtion: string) {
    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '360px') {
      this.closeRightMenu();
      return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '360px';

    if (funtion === 'page') {
      this.titleTaskSection = 'Página';

      const page = new Pages();

      page.title = 'Página';
      page.body = '<h1>Hello World</h1>';

      if (this.totalPages === 0) {
        page.slug = '/pagina';
      } else {
        page.slug = `/pagina-${this.totalPages}`;
      }

      
      console.log(this.arrayPage);
      page.site_id = this.arrayPage[0].idSite;

      this.arrayPage?.push(page);
      
      this.selectedAP = this.arrayPage?.find((tk) => tk === page);

      // this.pagesService.createWebPage(page).subscribe(
      //   (result: any) => {
      //     this.pageForm.patchValue({
      //       _id: result._id,
      //       title: page.title,
      //       slug: page.slug,
      //       body: page.body,
      //       site_id: page.site_id,
      //     });
      //     Swal.fire({
      //       title: 'Procesando petición!!',
      //       html: result.message,
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       allowOutsideClick: false,
      //       didOpen: () => {
      //         Swal.showLoading();
      //       },
      //       timer: 2000,
      //     });
      //     this.showSucces();
      //     this.refrescarDataTotal(0, 0, 50, 50, true);
      //   },
      //   (error) => {
      //     if (error.status === 401) {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       }).then(() => {
      //         this.routes.navigate(['/login']);
      //       });
      //     } else {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: error.message,
      //         showCancelButton: false,
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       });
      //     }
      //   },
      // );
      page.is_active = false;
      page.pageTypeCreate = 'page';
    } else {
      this.titleTaskSection = 'Sitio Web';

      const web: Pages = new Pages();

      // Información de sitio
      web.title = `Sitio web ${this.pageTotalData}`;
      web.slogan = 'the winter is coming';
      web.phone = '+583024012910';
      web.email = 'example@email.com';
      web.footer = 'footer here';
      web.domain = 'www.example.com';
      web.idSite = `SitioPrincipal${this.pageTotalData}`;

      const colores = {
        primary: 'FFFFFF',
        secondary: 'FFFFFF',
        hover: 'FFFFFF',
        link_visited: 'FFFFFF',
        background_primary: 'FFFFFF',
        background_secondary: 'FFFFFF',
      };

      this.socialMediaArray.push({
        id: 1,
        title: 'Facebook',
        text: 'lorem',
        icon: 'lorem',
        url: 'http://sepec.aunap.gov.co/',
        is_active: true,
      });

      this.socialMediaArray.push({
        id: 2,
        title: 'youtube',
        text: 'lorem',
        icon: 'lorem',
        url: 'htt://sepec.aunap.gov.co/',
        is_active: true,
      });

      web.color_schemes = colores;
      web.social_links = this.socialMediaArray;

      this.arrayPage.push(web);
      this.selectedAP = this.arrayPage.find((sec) => sec === web);

      // this.pagesService.createWebSite(web).subscribe(
      //   (result: any) => {
      //     this.webForm.patchValue({
      //       _id: result._id,
      //       title: web.title,
      //       slogan: web.slogan,
      //       phone: web.phone,
      //       email: web.email,
      //       idSite: web.idSite,
      //       footer: web.footer,
      //       domain: web.domain,
      //       color_schemes: web.color_schemes,
      //       social_links: web.social_links,
      //     });
      //     Swal.fire({
      //       title: 'Procesando petición!!',
      //       html: result.message,
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       allowOutsideClick: false,
      //       didOpen: () => {
      //         Swal.showLoading();
      //       },
      //       timer: 2000,
      //     });
      //     this.showSucces();
      //     this.refrescarDataTotal(0, 0, 50, 50, true);
      //   },
      //   (error) => {
      //     if (error.status === 401) {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       }).then(() => {
      //         this.routes.navigate(['/login']);
      //       });
      //     } else {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: error.message,
      //         showCancelButton: false,
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       });
      //     }
      //   },
      // );
      web.is_active = false;
      web.border = false;
    }

    this.remainingTasks();
  }

  /**
   * Selecciona la información necesaria para el formulario
   *
   * @param selected Datos que se asignarán a los respectivos formularios
   * @returns Formulario cargado
   */
  sectionTaskSelected(selected) {
    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '360px') {
      this.closeRightMenu();
      return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '360px';

    if (selected.domain !== undefined) {
      this.titleTaskSection = 'Sitio Web';
      this.selectedAP = selected;
      this.selectedAP.border = true;

      this.pageForm.reset();

      this.webForm.patchValue({
        _id: this.selectedAP._id,
        title: this.selectedAP.title,
        slogan: this.selectedAP.slogan,
        phone: this.selectedAP.phone,
        email: this.selectedAP.email,
        idSite: this.selectedAP.idSite,
        footer: this.selectedAP.footer,
        domain: this.selectedAP.domain,
        color_schemes: this.selectedAP.color_schemes,
        social_links: this.selectedAP.social_links,
      });
    } else {
      this.titleTaskSection = 'Página';
      this.selectedAP = selected;
      const data = typeof selected.site_id;
      if (data === 'object') {
        this.selectedAP.site_id = selected.site_id._id;
      }
      this.selectedAP.border = true;
      this.selectedAP.slug = selected.slug;

      this.pageForm.reset();

      this.pageForm.patchValue({
        _id: this.selectedAP._id,
        title: this.selectedAP.title,
        slug: this.selectedAP.slug,
        body: this.selectedAP.body,
        site_id: this.selectedAP.site_id,
      });
    }
  }

  /**
   * Método para capturar los cambios en el select
   *
   * @param selectValue Opción escogida del select
   */
  onChange(selectValue) {
    this.arrayPageWeb.forEach((element) => {
      if (element._id === selectValue) {
        this.selectedAP.site_id = selectValue;
      }
    });
  }

  /**
   * Controla el cierre de la vista de edición
   */
  closeRightMenu() {
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '0';
    if (this.selectedAP !== undefined) {
      this.selectedAP.border = false;
    }
    this.selectedAP = undefined;
  }

  /**
   * Guarda los cambios realizados a las páginas o sitios web
   *
   * @param selected Formulario rellenado
   * @returns Cambios guardados con éxito o el mensaje de error
   * predeterminado
   */
  saveSettings(selected) {
    if (selected.domain !== undefined) {
      if (selected.title === '' || selected.title === null) {
        this.showError();
        return;
      }
      // this.pagesService.updateWebSite(selected).subscribe(
      //   (result: any) => {
      //     Swal.fire({
      //       title: 'Procesando petición!!',
      //       html: result.message,
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       allowOutsideClick: false,
      //       didOpen: () => {
      //         Swal.showLoading();
      //       },
      //       timer: 2000,
      //     });
      //     this.showSucces();
      //   },
      //   (error) => {
      //     if (error.status === 401) {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       }).then(() => {
      //         this.routes.navigate(['/login']);
      //       });
      //     } else {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: error.message,
      //         showCancelButton: false,
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       });
      //     }
      //   },
      // );
    } else {
      if (selected.title === '' || selected.title === null) {
        this.showError();
      } else if (selected.body === '' || selected.body === null) {
        this.showError();
      } else {
        // this.pagesService.updateWebPage(selected).subscribe(
        //   (result: any) => {
        //     Swal.fire({
        //       title: 'Procesando petición!!',
        //       html: result.message,
        //       showCancelButton: false,
        //       showConfirmButton: false,
        //       allowOutsideClick: false,
        //       didOpen: () => {
        //         Swal.showLoading();
        //       },
        //       timer: 2000,
        //     });
        //     this.showSucces();
        //   },
        //   (error) => {
        //     if (error.status === 401) {
        //       Swal.fire({
        //         title: 'Error!!',
        //         icon: 'error',
        //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
        //         showConfirmButton: true,
        //         confirmButtonText: 'Aceptar',
        //         allowOutsideClick: false,
        //       }).then(() => {
        //         this.routes.navigate(['/login']);
        //       });
        //     } else {
        //       Swal.fire({
        //         title: 'Error!!',
        //         icon: 'error',
        //         html: error.message,
        //         showCancelButton: false,
        //         showConfirmButton: true,
        //         confirmButtonText: 'Aceptar',
        //         allowOutsideClick: false,
        //       });
        //     }
        //   },
        // );
      }
    }
    this.refrescarDataTotal(0, 0, 50, 50, true);
    this.closeRightMenu();
  }

  /**
   * Actualiza el contador de páginas estáticas y sitios web
   */
  remainingTasks() {
    this.totalPages = this.arrayPage.filter((data) => data.pageTypeCreate === 'page').length;
    this.completedcount = this.totalPages;
  }

  /**
   * Habilita o inhabilita la página o el sitio web seleccionado
   *
   * @param $event Evento del checkbox
   * @param st Página o sitio web escogido
   */
  checkboxIsActive($event: any, st: Pages) {
    // eslint-disable-next-line no-param-reassign

    if (st.domain === undefined) {
      // this.pagesService.disableWebPage({
      //   id: st._id,
      //   is_active: $event.currentTarget.checked,
      // }).subscribe(
      //   (result: any) => {
      //     Swal.fire({
      //       title: 'Procesando petición!!',
      //       html: result.message,
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       allowOutsideClick: false,
      //       didOpen: () => {
      //         Swal.showLoading();
      //       },
      //       timer: 2000,
      //     });
      //     this.showSucces();
      //     this.refrescarDataTotal(0, 0, 50, 50, true);
      //   },
      //   (error) => {
      //     if (error.status === 401) {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       }).then(() => {
      //         this.routes.navigate(['/login']);
      //       });
      //     } else {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: error.message,
      //         showCancelButton: false,
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       });
      //     }
      //   },
      // );
    } else {
      // this.pagesService.disableWebSite({
      //   id: st._id,
      //   is_active: $event.currentTarget.checked,
      // }).subscribe(
      //   (result: any) => {
      //     Swal.fire({
      //       title: 'Procesando petición!!',
      //       html: result.message,
      //       showCancelButton: false,
      //       showConfirmButton: false,
      //       allowOutsideClick: false,
      //       didOpen: () => {
      //         Swal.showLoading();
      //       },
      //       timer: 2000,
      //     });
      //     this.showSucces();
      //     this.refrescarDataTotal(0, 0, 50, 50, true);
      //   },
      //   (error) => {
      //     if (error.status === 401) {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       }).then(() => {
      //         this.routes.navigate(['/login']);
      //       });
      //     } else {
      //       Swal.fire({
      //         title: 'Error!!',
      //         icon: 'error',
      //         html: error.message,
      //         showCancelButton: false,
      //         showConfirmButton: true,
      //         confirmButtonText: 'Aceptar',
      //         allowOutsideClick: false,
      //       });
      //     }
      //   },
      // );
    }
    st.is_active = $event.currentTarget.checked;
    this.remainingTasks();
    this.closeRightMenu();
  }

  /**
   * Trae la información de localStorage, exactamente
   * la de las páginas estáticas y sitio web
   *
   * @returns Array del localStorage
   */
  dataPages() {
    const guardado = localStorage.getItem('pages');
    return JSON.parse(guardado);
  }

  /**
   * Trae los datos de la base de datos inactivos
   */
  giveDataOff(data) {
    this.arrayPage = [];
    this.refrescarDataTotal(0, 0, 50, 50, data);
    this.remainingTasks();
    if (data === false) {
      this.id_view = 1;
    } else {
      this.id_view = 0;
    }
  }

  /**
   * Crea un slug amigable de la página estática
   *
   * @param slug Elemento que se captura para crear el slug
   */
  crearURL(slug) {
    let slugString:string = slug.srcElement.value;

    slugString = `/${slugString.toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').trim()
      .replace(/[^\w- ]+/g, '')
      .replace(/ /g, '-')
      .replace(/[-]+/g, '-')}`;

    this.pageForm.patchValue({
      slug: slugString,
    });
    document.getElementById('texto-url').innerHTML = slugString;
  }

  /**
   * Controlador para mensajes de error
   */
  showError() {
    this.toastr.error('Verifique que las páginas estén nombradas!', 'Oops!', { timeOut: 2000 });
  }

  /**
   * Controlador para mensajes de emergencia
   */
  showWarning() {
    this.toastr.warning('Puede que algunas páginas no tengan contenido por el momento', 'Alert!', { timeOut: 2000 });
  }

  /**
   * Controlador para mensajes informativos
   */
  showInfo() {
    this.toastr.info('Continue rellenando la información necesaria', '', { timeOut: 1000 });
  }

  /**
   * Controlador para mensajes de éxito
   */
  showSucces() {
    this.toastr.success('Cambios guardados con éxito!', 'Success!', { timeOut: 1000 });
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '0';
    if (this.selectedAP !== undefined) {
      this.selectedAP.border = false;
    }
    this.selectedAP = undefined;
  }

  /**
   * Controlador de modals
   *
   * @param targetModal Modal específico para su funcionamiento
   */
  openModal(targetModal: NgbModal, body: number) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
    this.colorForm.reset();

    if (body === 0) {
      this.colorForm.patchValue({
        primary: this.selectedAP.color_schemes.primary,
        secondary: this.selectedAP.color_schemes.secondary,
        hover: this.selectedAP.color_schemes.hover,
        link_visited: this.selectedAP.color_schemes.link_visited,
        background_primary: this.selectedAP.color_schemes.background_primary,
        background_secondary: this.selectedAP.color_schemes.background_secondary,
      });
    }
    this.posModal = body;
  }

  /**
   * Botón de cierre del modal
   */
  closeBtnClick() {
    this.modalService.dismissAll();
  }

  /**
   * Método para traer los datos actualizados de los sitios web
   * y páginas estáticas
   */
  refrescarDataTotal(
    fromWebPage: number,
    fromWebSite: number,
    limitWebPage: number,
    limitWebSite: number,
    active: boolean,
  ) {
    // this.pagesService.getWebSite(fromWebSite, limitWebSite, active).subscribe(
    //   (e: any) => {
    //     this.arrayPage = e.items;
    //     if (this.pageTotalData === 0) {
    //       this.pageTotalData = e.total;
    //     } else {
    //       this.pageTotalData += 1;
    //     }
    //     this.arrayPageWeb = this.arrayPage.filter((st) => st.domain !== undefined);

    //     this.pagesService.getWebPage(fromWebPage, limitWebPage, active).subscribe(
    //       (f: any) => {
    //         f.items.forEach((element) => {
    //           this.arrayPage.push(element);
    //         });
    //         this.arrayPageFilter = this.arrayPage;

    //         this.remainingTasks();

    //         this.totalPages = this.arrayPage.filter((st) => st.domain === undefined
    //         || st.domain === null).length;

    //         this.completedcount = this.arrayPage.filter((st) => (st.domain === undefined
    //         || st.domain === null) && st.is_active).length;
    //       },
    //       (error) => {
    //         if (error.status === 401) {
    //           Swal.fire({
    //             title: 'Error!!',
    //             icon: 'error',
    //             html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
    //             showConfirmButton: true,
    //             confirmButtonText: 'Aceptar',
    //             allowOutsideClick: false,
    //           }).then(() => {
    //             this.routes.navigate(['/login']);
    //           });
    //         } else {
    //           Swal.fire({
    //             title: 'Error!!',
    //             icon: 'error',
    //             html: error.message,
    //             showCancelButton: false,
    //             showConfirmButton: true,
    //             confirmButtonText: 'Aceptar',
    //             allowOutsideClick: false,
    //           });
    //         }
    //       },
    //     );
    //   },
    //   (error) => {
    //     if (error.status === 401) {
    //       Swal.fire({
    //         title: 'Error!!',
    //         icon: 'error',
    //         html: 'Tiempo de sesión expirado, inicie sesión nuevamente',
    //         showConfirmButton: true,
    //         confirmButtonText: 'Aceptar',
    //         allowOutsideClick: false,
    //       }).then(() => {
    //         this.routes.navigate(['/login']);
    //       });
    //     } else {
    //       Swal.fire({
    //         title: 'Error!!',
    //         icon: 'error',
    //         html: error.message,
    //         showCancelButton: false,
    //         showConfirmButton: true,
    //         confirmButtonText: 'Aceptar',
    //         allowOutsideClick: false,
    //       });
    //     }
    //   },
    // );
    this.id_view = 0;
  }

  /**
   * Inicializa los formatos para su crud
   */
  initForms() {
    this.pageForm = this.fb.group({
      _id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      body: ['', [Validators.required]],
      site_id: ['', [Validators.required]],
    });

    this.webForm = this.fb.group({
      _id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      slogan: ['', [Validators.required]],
      idSite: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      color_schemes: ['', [Validators.required]],
      social_links: [SocialMedia, [Validators.required]],
    });

    this.colorForm = this.fb.group({
      primary: ['', [Validators.required]],
      secondary: ['', [Validators.required]],
      hover: ['', [Validators.required]],
      link_visited: ['', [Validators.required]],
      background_primary: ['', [Validators.required]],
      background_secondary: ['', [Validators.required]],
    });
  }

  /**
   * @ignore
   * Controlará la carga de data (Develop)
   * @param paginator Componente de paginación
   */
  chargePage(paginator: NgbPagination) {
    if (this.arrayPageWeb.length === 0) {
      this.arrayPageWeb = this.arrayPage.filter((st) => st.domain !== undefined);
    }
    const limit = 6 * paginator.page;
    if (limit === 6) {
      this.refrescarDataTotal(0, 0, 3, 3, true);
    } else {
      this.refrescarDataTotal(limit, limit, 6, 3, true);
    }

    const pagina = document.querySelector('ngb-pagination').getAttribute('ng-reflect-page');
    document.querySelector('ngb-pagination').setAttribute('ng-reflect-page', pagina);
  }

  /**
   * Controla lo que la persona puede escribir;
   *
   * @param event Tecla digitada
   * @returns Caracteres de texto permitidos
   */
  keyboardDisabled(event) {
    return (event >= 48 && event <= 57)
    || (event >= 65 && event <= 90)
    || (event >= 97 && event <= 122);
  }

  /**
   * Guarda el formulario de esquemas en el de web actual
   *
   * @param colorForm Formulario de esquemas de colores
   * @param webForm Formulario web
   */
  saveColor(colorForm, webForm: FormGroup) {
    webForm.patchValue({ color_schemes: colorForm });
  }

  /**
   * la función es para filtrar los users listados
   * @param event es un evento cuando hay una entrada en campo
   */
  filterUsers(event:any) {
    const wordFilter:string = event.srcElement.value;
    this.arrayPage = this.arrayPageFilter.filter((arrayPage) => arrayPage.title
      .toLocaleLowerCase().indexOf(wordFilter.toLocaleLowerCase()) !== -1);
  }
}
