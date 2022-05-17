import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { footerSiteService } from '../../services/footers-sites.service';



@Component({
  selector: 'app-footers-sites',
  templateUrl: './footers-sites.component.html',
  styleUrls: ['./footers-sites.component.scss']
})
export class FootersSitesComponent implements OnInit {
  public footers  : Array <any> = [];
  public charging : boolean = true;
  private totalFooterSite:number = 0;
  formFooterCreate: any;
  formFooterEdit: any;
  websiteId: any;
  closeResult: string;

    //Paginación
    page =1;
    pageSize = 8;
    collectionSize = 0;
    _searchTerm = '';

  constructor(
    private formBuilder : FormBuilder, private footerSiteService : footerSiteService ,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
   this.getWebFooters()
  }

  loadformSiteCreate(){
    this.formFooterCreate = this.formBuilder.group({ 
      sitio:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      email:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      direccion:['',[Validators.required, Validators.maxLength(40),Validators.minLength(5)]],
      telefono:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
    })
  }

  loadformSiteEdit(){
    this.formFooterEdit = this.formBuilder.group({
      sitio:['',[Validators.required, Validators.maxLength(20),Validators.minLength(3)]],
      email:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      direccion:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      telefono:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      is_active:[null,[Validators.required,]],
    })
  }

  validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    // this.alerts.basic('error', 'Error!', 'Los datos del formulario no son validos');
    return false
  };

  getWebFooters = () =>{
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
    this.footerSiteService.getFootersSites().subscribe(
      (res:any) =>{
    this.footers = res;
    this.totalFooterSite = res.length;
    this.collectionSize = this.footers.length;
    this.charging = false;
    Swal.close();
    console.log(res);
    },
    (error:any) =>{})
  }

  openModal(content1: string, data) {
    if(data != 0){
      this.formFooterEdit.patchValue({
        sitio: data.sitio,
        email: data.email,
        direccion: data.direccion,
        telefono: data.telefono,
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
}

