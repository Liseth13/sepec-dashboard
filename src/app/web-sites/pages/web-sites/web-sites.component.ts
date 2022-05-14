import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { WebSitesService }  from '../../services/web-sites.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-web-sites',
  templateUrl: './web-sites.component.html',
  styleUrls: ['./web-sites.component.scss']
})

export class WebSitesComponent implements OnInit {
  private webSites    : Array <any> = [];
  private totalWebSites : number = 0;
  public charging : boolean = true;
  private formSiteCreate      : FormGroup;
  private formSiteEdit        : FormGroup;
  alerts: any;
  public imageUpload!: File;
  public uploadPdf!: File;
  public tempImg: any = null;
  private websiteId: number = 0;

  //Este validImageExtension para indicar si una extensión es valida o no, true es valida y false es no valida
  public validImageExtension: boolean = true;

  //Variable donde se comprobara el tamaño de un archivo a subir, true es permitido y false es que supera el tamaño
  public allowedFileSize: boolean = true;

  closeResult = '';

  constructor(
   private formBuilder : FormBuilder, private webSiteService: WebSitesService,
   private modalService: NgbModal
  ){this.loadformSiteCreate(); this.loadformSiteEdit();}

  ngOnInit(): void {
    this.getWebSite();
  }


  loadformSiteCreate(){
    this.formSiteCreate = this.formBuilder.group({ 
      name:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      slogan:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:['']
    })
  
  }


  loadformSiteEdit(){
    this.formSiteEdit = this.formBuilder.group({
      name:['name',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      slogan:['slogan',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:['icon'],
      is_active:[null,[Validators.required,]],
    })
  }

  changeImage( file: File ){
    
    this.imageUpload = file;

    //Validamos si no existe el archivo, es decir no se selecciono ningún archivo
    if ( !file ) { 
      return this.tempImg = null;
    }

    //LLamamos a la función checkImageExtension para verificar la extensión del archivo subido
    this.checkImageExtension( file );
    //LLamamos también a la función de verificar el tamaño del archivo
    this.checkFileSize( file );

    /**
     * Verificamos que si la extensión del archivo subido no es valida entonces ponemos la imagen que estaba subida originalmente
     * en la base de datos y también como validImageExtension es false ya que la extensión no es valida deshabilotamos en el html el 
     * botón de cambiar imagen para que no se pueda subir nada
     * El return es para que no pase de esta condición si la extensión no es valida, y de esta manera evitamos errores que salen en consola
     */
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


  edit(){
    if(this.formSiteEdit.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{

      console.log(this.formSiteEdit.value);
      const { ...data } = this.formSiteEdit.value;
      // is_active === 'true' ? data.is_active = true : data.is_active = false;
      console.log(data);

      this.webSiteService.updateWebSite(data, this.websiteId).subscribe(
        (res:any)=>{
          console.log(res);
          this.getWebSite();
          this.closeModal();
          Swal.fire(' Success','Editado correctamente','success');
        },
        (error:any)=>{
          console.log(error)
          Swal.fire('Error','vuelva a intentarlo','error');
        }
      )
    }
  }

   create(){
      
        console.log (this.formSiteCreate.value)
        if(this.formSiteCreate.invalid){
          Swal.fire('Error','Faltan Campos Por Validar','warning')
        }else{
          
          this.webSiteService.createWebSite(this.formSiteCreate.value).subscribe(
            (res:any)=>{
              console.log(res)
              this.getWebSite()
              this.closeModal()
              Swal.fire(' Success','Guardado correctamente','success')
            },
            (error:any)=>{
              console.log(error)
              Swal.fire('Error','vuelva a intentarlo','error')
            }
          )
        }
   }


   validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    // this.alerts.basic('error', 'Error!', 'Los datos del formulario no son validos');
    return false
  };



  getWebSite = () =>{
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
    this.webSiteService.getWebSites().subscribe(
      (res:any) =>{
        this.webSites = res;
        this.totalWebSites = res.length;
        this.charging = false;
        Swal.close();
        console.log(res);
      },
    (error:any) =>{})
  }

  openModal(content1: string, data) {
    if(data != 0){
      this.formSiteEdit.patchValue({
        name: data.name,
        slogan: data.slogan,
        is_active: data.is_active
      });

      this.websiteId = data.id;

      // console.log(this.formSiteEdit.value);
      
    }
		this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

  
  closeModal(){
    this.modalService.dismissAll()
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

  uploadImage(event) {
    console.log(event.target.files);
    if (event.target.files.length > 0){
      this.formSiteEdit.get('icon').setValue(event.target.files[0])
    }else{
      this.formSiteEdit.get('icon').setValue('')
    }
    console.log(this.formSiteEdit.value)
  }
}

