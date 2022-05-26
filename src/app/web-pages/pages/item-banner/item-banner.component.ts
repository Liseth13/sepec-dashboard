import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BannerItemService } from '../../services/banner-item.service';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-item-banner',
  templateUrl: './item-banner.component.html',
  styleUrls: ['./item-banner.component.scss']
})
export class ItemBannerComponent implements OnInit {
  public totalWebItemBanner : number = 0;
  formItemBannerCreate:  FormGroup;
  formItemBannerEdit:  FormGroup;
  public formSubmitted = false;

  public charging : boolean = true;

  public webItemBanner: Array <any> = [];
  private webItemBannerId: number = 0;
  banners :  Array <any> = []; 

  idView: string = '';
  modal: NgbModalRef;

  public imageUpload!: File;

  //Este validImageExtension para indicar si una extensión es valida o no, true es valida y false es no valida
  public validImageExtension: boolean = true;

  //Variable donde se comprobara el tamaño de un archivo a subir, true es permitido y false es que supera el tamaño
  public allowedFileSize: boolean = true;

  public tempImg: any = null;
  
  //Paginación
  page =1;
  pageSize = 8;
  pageP = 1;
  pageSizeP = 8;
  collectionSize = 0;
  collectionSizePage = 0;
  
  _searchTerm = '';

  dataForm: any = null;
 


  closeResult = '';
  constructor(
    private formBuilder : FormBuilder, private bannerItemService: BannerItemService,
    private modalService: NgbModal, private bannerService: BannerService,private activeModal: NgbActiveModal
  ) { this.loadformItemBannerCreate(); this.loadformItemBannerEdit();}

  ngOnInit(): void {
    this.getWebItemBanner();
    this.getWebBanner();
  }

  getWebItemBanner = () =>{
    Swal.fire({
      title: 'Cargando',
      html: 'Por favor espera un momento...',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
    this.bannerItemService.getItemBanner().subscribe(
      (res:any) =>{
        this.webItemBanner = res;
        this.totalWebItemBanner = res.length;
        this.collectionSize = this.webItemBanner.length;
        this.charging = false;
        Swal.close();
      },
    (error:any) =>{})
  }

  loadformItemBannerCreate(){
    this.formItemBannerCreate = this.formBuilder.group({ 
      banner:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      name:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url:['',[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      img:[null],
    })
  }

  loadformItemBannerEdit(){
    this.formItemBannerEdit = this.formBuilder.group({
      banner:[0],
      name:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      url:['',[Validators.required, Validators.maxLength(300),Validators.minLength(3)]],
      text:['',[Validators.required, Validators.maxLength(100),Validators.minLength(3)]],
      img:[null],
      is_active:[null,[Validators.required]],
    })
  }
  
  edit(){

    this.formSubmitted = true;

    if(this.formItemBannerEdit.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning');
    }else{
      if( !this.validImageExtension || !this.allowedFileSize ){
        return Swal.fire('Error','Verifica la extensión y el tamaño de la imagen','warning');
      }

      const { ...data } = this.formItemBannerEdit.value;
      const dataForm = new FormData();
      for (var key in data) {
        if(key === 'img' && this.imageUpload !== null){
          dataForm.append('img', this.imageUpload);
        }else{
          if(key !== 'img'){
            dataForm.append(key, data[key]);
          }
        }
      }
      this.bannerItemService.updateItemBanner(dataForm, this.webItemBannerId).subscribe(
        (res:any)=>{
          this.getWebItemBanner();
          Swal.fire(' Success','Editado correctamente','success');
        },
        (error:any)=>{
          Swal.fire('Error','vuelva a intentarlo','error');
        }
      )
    }
  }

   create(){ 
    this.formSubmitted = true;
    if(this.formItemBannerCreate.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{
      if( this.imageUpload === null ){
        return Swal.fire('Error','Debes seleccionar una imagen','warning');
      }
      if( !this.validImageExtension || !this.allowedFileSize ){
        return Swal.fire('Error','Verifica la extensión y el tamaño de la imagen','warning');
      }
      const { ...data } = this.formItemBannerCreate.value;
      const dataForm = new FormData();
      for (var key in data) {
        if(key === 'img'){
          dataForm.append('img', this.imageUpload);
        }else{
          dataForm.append(key, data[key]);
        }
      }
      
      this.bannerItemService.createItemBanner(dataForm).subscribe(
        (res:any)=>{
          
          this.getWebItemBanner()
          this.closeRightMenu();
          Swal.fire('Guardado','Guardado correctamente','success')
        },
        (error:any)=>{
          Swal.fire('Error','vuelva a intentarlo','error')
        }
      );
    }
  }

  openModal(content1: string, data: any) {
    this.imageUpload = null;
    this.formSubmitted = false; 
    if(data === 0){
      this.idView = 'create';
      this.formItemBannerCreate.patchValue({
        banner: '',
        name: '',
        url: '',
        text: '',
        img: null,
        is_active: null
      });
    }

    this.tempImg = data.img;
    if(data !== 0){
      this.formItemBannerEdit.patchValue({
        banner: data.banner,
        name: data.name,
        url: data.url,
        text: data.text,
        img: data.img,
        is_active: data.is_active
      });
      this.webItemBannerId = data.id;
    }
    
		this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

  private getDismissReason(reason: ModalDismissReasons): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
  }

  closeRightMenu() {
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '0';
  }

  getWebBanner = () =>{
    this.bannerService.getBanner().subscribe(
      (res:any) =>{
        this.banners = res;
      },
    (error:any) =>{})
  }

  seleccionar(banner:any){
    if (this.idView == 'create') {
      this.formItemBannerCreate.get('banner').setValue(banner.id);
    } else {
      var x = 1
      this.formItemBannerEdit.get('banner').setValue(banner.id);
    }
  }

  changeImage( file: File ){
    
    this.imageUpload = file;

    //Validamos si no existe el archivo, es decir no se selecciono ningún archivo
    if ( !file ) { 
      return this.tempImg = null;
    }

    this.formItemBannerEdit.patchValue({
      img: file
    });

    this.checkImageExtension( file );
    this.checkFileSize( file );

    if( this.validImageExtension === false ){
       return this.tempImg = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.tempImg = reader.result;
    }

    return this.tempImg;

  }

  checkFileSize( file: File ){
    // Validar tamaño del archivo a subir
    if (file.size > 5242880 ) {
        //False es para indicar que el tamaño del archivo subido no es permitido
        this.allowedFileSize = false;
    } else {
        //True es para indicar que el tamaño del archivo subido si es permitido
        this.allowedFileSize = true;
    }
  }

  checkImageExtension( file: File ){
    const cutName = file.name.split('.'); // wolverine.1.3.jpg
    const fileExtension = cutName[cutName.length - 1];

    // Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    if (!validExtensions.includes(fileExtension)) {
        //False es para indicar que la extensión no es permitida
        this.validImageExtension = false;
    } else {
        //True es para indicar que la extensión si es permitida
        this.validImageExtension = true;
    }
  }

  
}


