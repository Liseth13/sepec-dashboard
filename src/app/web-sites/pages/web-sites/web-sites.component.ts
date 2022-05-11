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
  private formsiteEdit        : FormGroup;
  alerts: any;

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
      name:['',[Validators.required, Validators.maxLength(5),Validators.minLength(3)]],
      slogan:['',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:[''],
      isactive:['',[Validators.required,]],
    })
  
  }


  loadformSiteEdit(){
    this.formsiteEdit = this.formBuilder.group({
      name:['name',[Validators.required, Validators.maxLength(5),Validators.minLength(3)]],
      slogan:['slogan',[Validators.required, Validators.maxLength(40),Validators.minLength(8)]],
      icon:['icon'],
      isactive:['',[Validators.required,]],
    })
  }


   create(){
      
        console.log (this.formSiteCreate.value) 
     
    
   }


   validateForms = ( form : FormGroup ) : boolean => {
    if ( form.valid ) {
      return true;
    }
    this.alerts.basic('error', 'Error!', 'Los datos del formulario no son validos');
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
        //  this.formSiteCreate.patchValue({
        //    name: res[0].name,
        //  });
      },
    (error:any) =>{})
  }

  openModal(content1: string) {
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
}
