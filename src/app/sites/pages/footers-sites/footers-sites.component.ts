import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import Swal from 'sweetalert2';
import { Footer } from '../../interfaces/footer';
import { Site } from '../../interfaces/Site';
import { footerSiteService } from '../../services/footers-sites.service';
import { WebSitesService } from '../../services/web-sites.service';



@Component({
  selector: 'app-footers-sites',
  templateUrl: './footers-sites.component.html',
  styleUrls: ['./footers-sites.component.scss']
})
export class FootersSitesComponent implements OnInit {

  public sites    : Array <Site> = [];
  public footers  : Array <Footer> = [];
  footersForTable : Array <Footer> = [];

  private formCreate: FormGroup;
  private formEdit  : FormGroup;

  sidebarMode : 'create' | 'edit' | string = 'create';

  //Paginación
  pagination = new Pagination();
  pagSites   = new Pagination();

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';

    

  constructor(
    private formBuilder : FormBuilder, private footerSiteService : footerSiteService,
    private modalService: NgbModal, private webSiteService: WebSitesService
  ) { }

  ngOnInit(): void {
   this.get( true );
   this.loadFormCreate();
   this.getSites();  
  }

  loadFormCreate(){
    this.formCreate = this.formBuilder.group({ 
      site    :['',[Validators.required]],
      email   :['',[Validators.required, Validators.maxLength(150),Validators.minLength(5)]],
      address :['',[Validators.required, Validators.maxLength(200),Validators.minLength(2)]],
      phone   :['',[Validators.required, Validators.maxLength(100),Validators.minLength(2)]],
    })
  }

  loadFormEdit( footer : Footer ){
    this.formEdit = this.formBuilder.group({
      id     :[ footer.id, [Validators.required,]],
      site   :[ footer.site ,[Validators.required]],
      email  :[ footer.email ,[Validators.required, Validators.maxLength(150),Validators.minLength(5)]],
      address:[ footer.address ,[Validators.required, Validators.maxLength(200),Validators.minLength(2)]],
      phone  :[ footer.phone ,[Validators.required, Validators.maxLength(100),Validators.minLength(2)]],
      is_active:[ footer.is_active ,[Validators.required]],
    });
    console.log(this.formEdit.value);
    
  }

  validateForms = ( form : FormGroup ) : boolean => {
    console.log(form.value)
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error','Faltan Campos Por Validar','warning')
    return false;
  };


  get = ( isShowLoading : boolean = false ) => {

    if ( isShowLoading ) {
      Swal.fire({
        title: 'Cargando',
        html: 'Por favor espera un momento...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
    }

   this.footerSiteService.get().subscribe(
    ( res : Footer[] ) => { this.footers = res ; this.showFooters( this.tableMode ) },
    ( error : any ) => { this.errorHandler( error ) },
    () => { 
      this.showFooters( this.tableMode );
      isShowLoading && Swal.close() ;
    });
  }

  getSites = () => {
    this.webSiteService.get().subscribe(
    ( res : Site[] ) =>{
      this.sites = res;
      this.pagSites.collectionSize = this.sites.length;
    },
    ( error : any ) => { this.errorHandler(error) });
  }

  create = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if( isValid ) { 
      this.footerSiteService.create( form.value ).subscribe(
      ( res : Footer ) => {  
        this.get();
        this.closeRightSidebar();
        Swal.fire('Exito!','Footer creado correctamente','success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  edit( form : FormGroup ){
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      this.footerSiteService.update( form.value ).subscribe(
      ( res : any )=>{
        this.get();
        this.closeRightSidebar();
        Swal.fire(' Success','Editado correctamente','success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  showFooters = ( mode : string ) => {

    if ( mode === 'all' ) {
      this.footersForTable = this.footers;
    }

    if ( mode === 'actives' ){
      this.footersForTable = this.footers.filter((f:Footer) => f.is_active);
    }

    if ( mode === 'inactives' ){
      this.footersForTable = this.footers.filter((f:Footer) => !f.is_active);
    }

    this.pagination.collectionSize = this.footersForTable.length;
    this.pagination.page = 1;
    this.tableMode = mode;
  }

  selectSite = ( form : FormGroup, site : Site ) => {
    form.get('site').setValue(site?.id || '');
    this.closeModals();
    
  }

  openRightSidebar( mode: string, footer? : Footer ) {
    if ( mode === 'edit' && footer ){
      this.sidebarMode = mode;
      this.loadFormEdit( footer );
    } else if ( mode === 'create' ) {
      this.sidebarMode = mode;
      this.loadFormCreate();
    } else {
      this.sidebarMode = 'create';
      return;
    }

    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    
    if ( rightMenu.style.width === '285px' ) {
      this.closeRightSidebar();
      return;
    }
    rightMenu.style.width = '285px';
  }

  closeRightSidebar() {
    const rightMenu : HTMLFormElement = document.getElementById('rightMenu') as HTMLFormElement ;
    rightMenu.style.width = '0px';
  }

  openModal( targetModal: NgbModal, size : string = 'md', ) {  
    this.modalService.open( targetModal , {
      size : size ,
      centered: true,
      backdrop: 'static',
    });
  }

  closeModals = () => {
    this.modalService.dismissAll();
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

  // openModal(content1: string, data: any) {
    
  //   if (data != 0) {
  //     this.formEdit.patchValue({
  //       id: data.id,
  //       site: data.site,
  //       email: data.email,
  //       address: data.address,
  //       phone: data.phone,
  //       is_active: data.is_active,
  //     })
  //   } 
    
  //   this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
	// 		this.closeResult = `Closed with: ${result}`;
	// 	}, (reason) => {
	// 		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	// 	});
  // }

  // closeModal() { 
  //   this.modalService.dismissAll()
  // }


  // getDismissReason(reason: ModalDismissReasons) : string {
  //   if (reason === ModalDismissReasons.ESC) {
	// 		return 'by pressing ESC';
	// 	} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	// 		return 'by clicking on a backdrop';
	// 	} else {
	// 		return `with: ${reason}`;
	// 	}
  // }



  // edit(){
  //   if(this.formEdit.invalid){
  //     Swal.fire('Error','Faltan Campos Por Validar','warning')
  //   }else{

  //     this.footerSiteService.updateFootersSites('dsfdsf',4).subscribe(
  //       (res:any)=>{
  //         this.get();
  //         Swal.fire(' Success','Editado correctamente','success');
  //       },
  //       (error:any)=>{
  //         Swal.fire('Error','vuelva a intentarlo','error');
  //       }
  //     )
  //   }
  // }

  // create(){
      
  //   if(this.formCreate.invalid){
  //     Swal.fire('Error','Faltan Campos Por Validar','warning')
  //   }else{
      
  //     this.footerSiteService.createFootersSites(this.formCreate.value).subscribe(
  //       (res:any)=>{
          
  //         this.get()
  //         // this.closeRightMenu();
  //         Swal.fire(' Success','Guardado correctamente','success')
  //       },
  //       (error:any)=>{
  //         Swal.fire('Error','vuelva a intentarlo','error')
  //       }
  //     )
  //   }
}

