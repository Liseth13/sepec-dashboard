import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  //Validación de imagen
  public isImgExtensionValid : boolean = true;
  public isImgSizeValid      : boolean = true;

 // idView: string = '';
  //modal: NgbModalRef;

  public imageUpload : File;

  public tempImg : string;

  pagItems   = new Pagination();
  pagBanners = new Pagination();

 

  constructor
  (
    private formBuilder : FormBuilder, 
    private bannerItemService: BannerItemService,
    private modalService: NgbModal, 
    private bannerService: BannerService,
  ) { 
    this.loadFormCreate();
    this.loadFormEdit();
  }

  ngOnInit(): void {
    this.get();
    this.getBanners();
  }

 

  loadFormCreate(){
    this.formCreate = this.formBuilder.group({ 
      banner:['',[Validators.required]],
      name  :['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url   :['prueba',[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text  :['',[Validators.required, Validators.maxLength(150000),Validators.minLength(3)]],
      img   :[''],
    });
  }

  loadFormEdit( itemBanner? : ItemBanner ){
    this.formEdit = this.formBuilder.group({
      id    :[itemBanner?.id || null, [ Validators.required ]],
      banner:[ itemBanner?.banner || null ],
      name  :[itemBanner?.name || null,[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url   :[itemBanner?.url || null,[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text  :[itemBanner?.text || null,[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      img   :[itemBanner?.img || null],
      is_active:[itemBanner?.is_active, [Validators.required]],
    });
  }

  validateForms = ( form : FormGroup ) : boolean => {  

    if ( form.valid ) {
      if (this.imageUpload ){
        if ( !this.isImgExtensionValid && !this.isImgSizeValid ) {
          Swal.fire('Error','La imagen cargada no es válida','warning');
          return false;
        }
      }
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
        // this.pagBanners.collectionSize = res.length;
        this.showItems( this.tableMode );
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

  create = ( form : FormGroup ) => { 
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      const formData : FormData = this.createFormData( form );
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

  edit = ( form : FormGroup ) => {
    const isValid : boolean = this.validateForms( form );
    if ( isValid ) {
      const formData : FormData = this.createFormData( form );
      this.bannerItemService.updateItemBanner( formData, form.get('id').value )
      .subscribe({
        next  : () => {
          this.get();
          this.closeRightSidebar();
          Swal.fire(' Success','Editado correctamente','success');
        },
        error : ( error  :any ) => { this.errorHandler( error ) }
      });
    }
  }

  createFormData = ( { value } : FormGroup ) : FormData => {
    console.log(value)
    const formData = new FormData();
    for ( let prop in value ) {
      if ( prop === 'img' ){
        this.imageUpload && formData.append('img', this.imageUpload) ;
      } else {
        formData.append(prop,value[prop]);
      } 
      
    }
    return formData;
  }

  selectBanner = ( form : FormGroup, banner : Banner ) => {
    form.get('banner').setValue(banner?.id || '');
    this.closeModals();
  }

  openRightSidebar( mode: string, input : HTMLInputElement, itemBanner? : ItemBanner ) {

    const localUrlImg = '../../../../assets/images/big/no-img.png';
    
    if( (mode !== 'create') && (mode !== 'edit') ){
      return;
    }

    if ( mode === 'edit' && itemBanner ){
      this.sidebarMode = mode;
      this.loadFormEdit( itemBanner );
      this.tempImg = itemBanner.img;
    }
    if ( mode === 'create' ) {
       this.loadFormCreate();
       this.tempImg = localUrlImg;
    }
    this.sidebarMode = mode;
    input.value = '';
    this.imageUpload = null;
   

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


  showItems = ( mode : string ) => {

    if ( mode === 'all' ) {
      this.itemsBannerForTable = this.itemsBanner;
    }

    if ( mode === 'actives' ){
      this.itemsBannerForTable = this.itemsBanner.filter((i:ItemBanner) => i.is_active);
    }

    if ( mode === 'inactives' ){
      this.itemsBannerForTable = this.itemsBanner.filter((i:ItemBanner) => !i.is_active);
    }

    this.pagItems.collectionSize = this.itemsBannerForTable.length;
    this.pagItems.page = 1;
    this.tableMode = mode;
  }



  changeImage( input : HTMLInputElement, form : FormGroup ) {

    const file : File = input.files[0];

    if (!file){
      return;
    }

    //this.deleteImgUpload( input, form );

    this.isImgSizeValid = this.checkFileSize( file );
    this.isImgExtensionValid = this.checkImageExtension( file );
    
    if ( !this.isImgSizeValid || !this.isImgExtensionValid ){
      this.deleteImgUpload( input, false, form );
      return; 
    }

    this.imageUpload = file;

    const reader = new FileReader();

    reader.readAsDataURL( file );

    reader.onloadend = () => {

      const imgUrl = reader.result;

      form.get('img').setValue(imgUrl);
    }
  }

  checkFileSize( file : File ) : boolean {
    if (file.size <= 10485760 ) {   
        return true;
    }
    return false;
  }

  checkImageExtension( file : File ) : boolean {
    const cutName = file.name.split('.'); // wolverine.1.3.jpg
    const fileExtension = cutName[cutName.length - 1];
    // Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    if (validExtensions.includes(fileExtension)) {
        return true;
    }
    return false;
  }

  errorHandler = ( error : any ) => {
    console.log(error)
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

  formReset = ( form : FormGroup, input : HTMLInputElement ) => {
    this.deleteImgUpload( input, true, form);
    form.reset();
    this.isImgSizeValid = true;
    this.isImgExtensionValid = true;
  }

  deleteImgUpload = ( input : HTMLInputElement, resetValidations : boolean = true, form : FormGroup ) => {
    input.value = '';
    this.imageUpload = null;
    if ( resetValidations ){
      this.isImgExtensionValid = true;
      this.isImgSizeValid = true;
    }
    form && form.get('img').setValue( this.sidebarMode === 'create' ? '' : this.tempImg || '' );
  }
}


