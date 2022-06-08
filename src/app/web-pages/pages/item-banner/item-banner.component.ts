import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import Swal from 'sweetalert2';
import { Banner } from '../../interfaces/banner';
import { ItemBanner } from '../../interfaces/item-banner';
import { BannerItemService } from '../../services/banner-item.service';
import { BannerService } from '../../services/banner.service';


@Component({
  selector: 'app-item-banner',
  templateUrl: './item-banner.component.html',
  styleUrls: ['./item-banner.component.scss']
})
export class ItemBannerComponent implements OnInit {
  formCreate:  FormGroup;
  formEdit:  FormGroup;

  itemsBanner: Array <ItemBanner> = [];
  itemsBannerForTable : Array<ItemBanner> = [];
  banners :  Array <Banner> = []; 

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';
  sidebarMode : 'create' | 'edit' | string = 'create';

 // idView: string = '';
  //modal: NgbModalRef;

  public imageUpload!: File;

  //Este validImageExtension para indicar si una extensión es valida o no, true es valida y false es no valida
  public validImageExtension: boolean = true;

  //Variable donde se comprobara el tamaño de un archivo a subir, true es permitido y false es que supera el tamaño
  public allowedFileSize: boolean = true;

  public tempImg: any = null;
  
  //Paginación
  pagItems    = new Pagination();
  pagBanners = new Pagination();

 

  constructor
  (
    private formBuilder : FormBuilder, 
    private bannerItemService: BannerItemService,
    private modalService: NgbModal, 
    private bannerService: BannerService
  ) { this.loadFormCreate()}

  ngOnInit(): void {
    this.get();
    this.getBanners();
  }

 

  loadFormCreate(){
    this.formCreate = this.formBuilder.group({ 
      banner:['',[Validators.required]],
      name  :['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url   :['',[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text  :['',[Validators.required, Validators.maxLength(150000),Validators.minLength(3)]],
      img   :[null],
    })
  }

  loadFormEdit( itemBanner : ItemBanner ){
    this.formEdit = this.formBuilder.group({
      banner:[ itemBanner.banner ],
      name  :[itemBanner.name,[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url   :[itemBanner.url ,[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text  :[itemBanner.text,[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      img   :[itemBanner.img],
      is_active:[itemBanner.is_active,[Validators.required]],
    })
  }

  validateForms = ( form : FormGroup  ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error','Faltan Campos Por Validar','warning');
    return false;
  };
  
  get = ( isShowLoading : boolean = false ) =>{

    if ( isShowLoading ) {
      Swal.fire({
        title: 'Cargando',
        html: 'Por favor espera un momento...',
        didOpen: () => {
          Swal.showLoading()
        }
      });
    }
    
    this.bannerItemService.getItemBanner()
    .subscribe({ 
      next : ( res : ItemBanner[] ) => {
        this.itemsBanner = res;
        this.showItemsBanner( this.tableMode );
      },
      error : ( error : any ) => { this.errorHandler( error ) },
      complete : () => { isShowLoading && Swal.close() }
    });
  }

  getBanners = () => {
    this.bannerService.getBanner()
    .subscribe({
      next : ( res : Banner[] ) => {
        this.banners = res;
        this.pagBanners.collectionSize = res.length;
      },
      error : ( error : any ) => { this.errorHandler( error ) }
    });
  }

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    // if ( isValid ){
    //   const validExtension : boolean;
    //   const validSizeFile : boolean;

    //   if ( validExtension && validSizeFile ) {

    //   }
    // }

    //   const { ...data } = this.formEdit.value;
    //   const dataForm = new FormData();
    //   for (var key in data) {
    //     if(key === 'img' && this.imageUpload !== null){
    //       dataForm.append('img', this.imageUpload);
    //     }else{
    //       if(key !== 'img'){
    //         dataForm.append(key, data[key]);
    //       }
    //     }
    //   }
    //   this.bannerItemService.updateItemBanner(dataForm, this.webItemBannerId).subscribe(
    //     (res:any)=>{
    //       this.get();
    //       Swal.fire(' Success','Editado correctamente','success');
    //     },
    //     (error:any)=>{
    //       Swal.fire('Error','vuelva a intentarlo','error');
    //     }
    //   )
    // }
  }

  create = ( form : FormGroup ) => { 
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      const formData = this.createFormData( form );
      this.bannerItemService.createItemBanner( formData )
      .subscribe({
        next : ( res : ItemBanner ) => {
          this.get();
          this.closeRightSidebar();
          Swal.fire('Exito!', 'Banner creado exitosamente', 'success');
        },
        error : ( error : any ) => { this.errorHandler( error ) }
      });
    }
  }

  createFormData = ( form : FormGroup ) : FormData => {
    const formData = new FormData();
    for ( let prop in form.value ) {
      if ( prop === 'img' ){
        formData.append('img', this.imageUpload);
      } else {
        formData.append(prop, form.value[prop]);
      } 
    }

    return formData;
  }

  openRightSidebar( mode: string, itemBanner? : any ) {
    if ( mode === 'edit' && itemBanner ){
      this.sidebarMode = mode;
      this.loadFormEdit( itemBanner );
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


  showItemsBanner = ( mode : string ) => {

    if ( mode === 'all' ) {
      this.itemsBannerForTable = this.itemsBanner;
    }

    if ( mode === 'actives' ){
      this.itemsBannerForTable = this.itemsBanner.filter((i:ItemBanner) => i.is_active);
    }

    if ( mode === 'inactives' ){
      this.itemsBannerForTable = this.itemsBanner.filter((i:ItemBanner) => !i.is_active);
    }

    this.pagBanners.collectionSize = this.itemsBannerForTable.length;
    this.pagBanners.page = 1;
    this.tableMode = mode;
  }



  changeImage( file: File ) : FileReader{
    
    // this.imageUpload = file;

    //Validamos si no existe el archivo, es decir no se selecciono ningún archivo
    // if ( !file ) { 
    //   return this.tempImg = null;
    // }

    // this.formEdit.patchValue({
    //   img: file
    // });

    // this.checkImageExtension( file );
    // this.checkFileSize( file );

    // if( this.validImageExtension === false ){
    //    return this.tempImg = null;
    // }


    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.tempImg = reader.result;
    }

    return reader;

  }

  checkFileSize( file: File ) : boolean {
    if (file.size <= 10485760 ) {
        return true;
    }
    return false;
  }

  checkImageExtension( file: File ) : boolean {
    const cutName = file.name.split('.'); // wolverine.1.3.jpg
    const fileExtension = cutName[cutName.length - 1];
    // Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    if (validExtensions.includes(fileExtension)) {
        //False es para indicar que la extensión no es permitida
        return true;
    }
    return false;
  }

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

  
}


