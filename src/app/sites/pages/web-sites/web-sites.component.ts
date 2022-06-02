import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { WebSitesService }  from '../../services/web-sites.service';
import Swal from 'sweetalert2';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import { Site } from '../../interfaces/Site';


@Component({
  selector: 'app-web-sites',
  templateUrl: './web-sites.component.html',
  styleUrls: ['./web-sites.component.scss']
})

export class WebSitesComponent implements OnInit {

  public sites : Array <Site> = [];
  sitesForTable: Array <Site> = [];

  public formCreate : FormGroup;
  private formEdit  : FormGroup;

  alerts: any;

  public imageUpload!: File;
  public uploadPdf!: File;
  public tempImg: any = null;

  sidebarMode : 'create' | 'edit' | string = 'create';

  //Paginación
  pagination = new Pagination();

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';


  //Este validImageExtension para indicar si una extensión es valida o no, true es valida y false es no valida
  public validImageExtension: boolean = true;

  //Variable donde se comprobara el tamaño de un archivo a subir, true es permitido y false es que supera el tamaño
  public allowedFileSize: boolean = true;


  constructor
  (
   private formBuilder    : FormBuilder, 
   private webSiteService : WebSitesService
  )
  {
    this.loadFormCreate();
  }

  ngOnInit(): void {
    this.get();
  }


  loadFormCreate(){
    this.formCreate = this.formBuilder.group({ 
      name:['',[Validators.required, Validators.maxLength(60),Validators.minLength(3)]],
      slogan:['',[Validators.required, Validators.maxLength(200),Validators.minLength(8)]],
      icon:['icon']
    });
  }

  loadFormEdit( site : any ){
    this.formEdit = this.formBuilder.group({
      id    : [ site?.id, [ Validators.required ] ],
      name  : [ site?.name ,[Validators.required, Validators.maxLength(60),Validators.minLength(3)]],
      slogan: [ site?.slogan ,[Validators.required, Validators.maxLength(200),Validators.minLength(8)]],
      // icon  : [ site?.icon ],
      is_active : [ site?.is_active ,[ Validators.required] ],
    });
  }

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

    this.webSiteService.get().subscribe(
    ( res : Site[] ) => { this.sites = res ; this.showSites(this.tableMode)},
    ( error : any ) => { this.errorHandler( error ) },
    () => { 
      this.showSites( this.tableMode );
      isShowLoading && Swal.close() ;
    });
  }

  showSites = ( mode : string ) => {

    if ( mode === 'all' ) {
      this.sitesForTable = this.sites;
    }

    if ( mode === 'actives' ){
      this.sitesForTable = this.sites.filter((s:any) => s.is_active);
    }

    if ( mode === 'inactives' ){
      this.sitesForTable = this.sites.filter((s:any) => !s.is_active);
    }

    this.pagination.collectionSize = this.sitesForTable.length;
    this.pagination.page = 1;
    this.tableMode = mode;
  }

  create( form : FormGroup ){
    const isValid : boolean = this.validateForms( form );
    if( isValid ) { 
      this.webSiteService.create(this.formCreate.value).subscribe(
      ( res : any ) => {  
        this.get()
        this.closeRightSidebar();
        Swal.fire('Exito!','Guardado correctamente','success')
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  edit( form : FormGroup ){
    const isValid : boolean = this.validateForms( form );
    if ( isValid ){
      this.webSiteService.update( form.value ).subscribe(
      ( res : any )=>{
        this.get();
        this.closeRightSidebar();
        Swal.fire(' Success','Editado correctamente','success');
      }, ( error : any ) => { this.errorHandler( error ) });
    }
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    Swal.fire('Error','Faltan Campos Por Validar','warning')
    return false;
  };

  errorHandler = ( error : any ) => {
    Swal.fire('Error', "Ha ocurrido un error, reintentar operación", 'error');
  }

  openRightSidebar( mode: string, site? : any ) {
    if ( mode === 'edit' && site ){
      this.sidebarMode = mode;
      this.loadFormEdit( site );
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

  uploadImage(event) {
    if (event.target.files.length > 0){
      this.formEdit.get('icon').setValue(event.target.files[0])
    }else{
      this.formEdit.get('icon').setValue('')
    }
  }

  changeImage( file : File ){
    
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

  checkFileSize( file : File ){
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

