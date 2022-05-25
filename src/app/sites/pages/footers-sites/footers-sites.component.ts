import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Footer } from './footer';
import Swal from 'sweetalert2';
import { footerSiteService } from '../../services/footers-sites.service';
import { WebSitesService } from '../../services/web-sites.service';



@Component({
  selector: 'app-footers-sites',
  templateUrl: './footers-sites.component.html',
  styleUrls: ['./footers-sites.component.scss']
})
export class FootersSitesComponent implements OnInit {

  selectedST: Footer | undefined = Object.create(null);
  titleTaskSection = '';

  public webSites : Array <any> = [];
  public footers  : Array <any> = [];
  public charging : boolean = true;
  public totalFooterSite:number = 0;
  private webFooterId: number = 0;
  private formFooterCreate: FormGroup;
  private formFooterEdit: FormGroup;
  websiteId: any;
  closeResult: string;
  count = 0;
  sectionTask: Footer[] | null = null;

    //Paginación
    page =1;
    pageSize = 8;
    collectionSize = 0;
    _searchTerm = '';
    

  constructor(
    private formBuilder : FormBuilder, private footerSiteService : footerSiteService,
    private modalService: NgbModal, private webSiteService: WebSitesService
  ) { }

  ngOnInit(): void {
   this.getWebFooters();
   this.loadformSiteCreate();
   this.loadformSiteEdit();
   this.getWebSite();
   
  }

  loadformSiteCreate(){
    this.formFooterCreate = this.formBuilder.group({ 
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      email:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      address:['',[Validators.required, Validators.maxLength(40),Validators.minLength(5)]],
      phone:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
    })
  }

  loadformSiteEdit(){
    this.formFooterEdit = this.formBuilder.group({
      id:[null,[Validators.required,]],
      site:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      email:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      address:['',[Validators.required, Validators.maxLength(40),Validators.minLength(2)]],
      phone:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      is_active:[null,[Validators.required,]],
    })
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    return false
  };

  getWebFooters = () =>{
    this.footerSiteService.getFootersSites().subscribe(
      (res:any) =>{
    this.footers = res;
    this.totalFooterSite = res.length;
    this.collectionSize = this.footers.length;
    this.charging = false;
    Swal.close();

    },
    (error:any) =>{})
  }

  getWebSite = () => {
    this.webSiteService.getWebSites().subscribe(
      (res:any) =>{
        this.webSites = res;
      },
      (error) => {
        
      }
    )
  }


  openModal(content1: string, data: any) {
    
    if (data != 0) {
      this.formFooterEdit.patchValue({
        id: data.id,
        site: data.site,
        email: data.email,
        address: data.address,
        phone: data.phone,
        is_active: data.is_active,
      })
    } 
    
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
  }

  closeModal() { 
    this.modalService.dismissAll()
  }


  getDismissReason(reason: ModalDismissReasons) : string {
    if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
  }

  addTaskSection() {

    this.formFooterCreate.reset();

    if ((document.getElementById('rightMenu')as HTMLFormElement).style.width === '300px') {
        this.closeRightMenu();
        return;
    }
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '300px';

    this.titleTaskSection = 'Task';

    const footer = new Footer();
    footer.email = 'bla@bla.com';
    footer.address = 'bla@bla.com';
    footer.phone = 'bla@bla.com';
    footer.status = true;

  }
  closeRightMenu() {
    (document.getElementById('rightMenu')as HTMLFormElement).style.width = '0';
  }

  edit(){
    if(this.formFooterEdit.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{
      this.webFooterId=this.formFooterEdit.value.id;
      const { ...data } = this.formFooterEdit.value;

      this.footerSiteService.updateFootersSites(data, this.webFooterId).subscribe(
        (res:any)=>{
          this.getWebFooters();
          this.closeModal();
          Swal.fire(' Success','Editado correctamente','success');
        },
        (error:any)=>{
          Swal.fire('Error','vuelva a intentarlo','error');
        }
      )
    }
  }

  create(){
      
    if(this.formFooterCreate.invalid){
      Swal.fire('Error','Faltan Campos Por Validar','warning')
    }else{
      
      this.footerSiteService.createFootersSites(this.formFooterCreate.value).subscribe(
        (res:any)=>{
          
          this.getWebFooters()
          this.closeRightMenu();
          Swal.fire(' Success','Guardado correctamente','success')
        },
        (error:any)=>{
          Swal.fire('Error','vuelva a intentarlo','error')
        }
      )
    }
}
  seleccionar(site){
    
      this.formFooterCreate.get('site').setValue(site.id);
      this.closeModal()

  }

  getName(siteId) {
    let siteName = '';

    if (siteId != '' && siteId != null) {
      const siteName = this.webSites.find(site => site.id === siteId);
      return siteName.name
    } else {
      return siteName;
    }
  }
}

