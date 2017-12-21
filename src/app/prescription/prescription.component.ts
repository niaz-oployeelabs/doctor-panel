import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { NgForm } from '@angular/forms';
import { PrescriptionService } from './prescription.service'; 
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'doctorola-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {

	user_subscription:Subscription;
	show_pat_list:boolean = false;
	show_new_pat_insertion:boolean = false;

	loading_patients:boolean = false;
	patients:{}[] = [];
	patient_cell_no:string='';

    form_pat_name:string = '';
    form_pat_age:number;
    form_pat_gender:string = '';
    form_pat_id:number;
    form_pat_type:string = '';

  	constructor(private _service:PrescriptionService, private _common:CommonService, 
  	private _router:Router, private _active_route:ActivatedRoute) { }

  	ngOnInit() 
    {
        this._active_route.params.subscribe(res=>{
            this.patient_cell_no = res['cell_no'];
            this._service.set_onsultation_record_id(res['onsultation_id']);
        });

        this._service.set_prescription_identifier();
        this._service.reset_step();
  		/* when comes from dashboard ...take input of conf app id and grab pat nam and cell and look for 
		him in db, add him in the common service and redirect to the lifestyle component */
  	}

  	find_user(f:NgForm)
  	{
  		this.loading_patients = true;	
  		this.patient_cell_no = f.value.cell_no;	
  		this.user_subscription = this._service.search_patient(f.value.cell_no)
  		.subscribe(res=> {
  			//console.log(res.length);
  			this.loading_patients = false;
  			if(res.length > 0) //users exist..show user list
  			{
  				this.patients = res;
  				this.show_pat_list = true;
  				this.show_new_pat_insertion = false;
  			}
  			else // no user ..new no...show insert user section
  			{
  				this.patients = [];	
  				this.show_new_pat_insertion = true;
  				this.show_pat_list = false;
  			}
  		}); 
  	}

  	open_patient_insertion()
  	{
  		this.show_pat_list = false;
  		this.show_new_pat_insertion = true;
  	}

    edit_pat(name:string, age:number, gender:string, p_id:number, p_type:string)
    {            
       this.form_pat_name = name;
       this.form_pat_age = age;
       this.form_pat_gender = gender;
       this.form_pat_id = p_id;
       this.form_pat_type = p_type;
       this.open_patient_insertion();
    }

  	switch_pat_list()
  	{
  		this.show_pat_list = true;
  		this.show_new_pat_insertion = false;
  	}

  	add_new_pat(f:NgForm) // pat from form
  	{
  		this._service.add_new_patient({
  			cell_no: this.patient_cell_no, name: f.value.name, age: f.value.age, gender: f.value.gender,
            pat_id: f.value.pat_id, pat_type: f.value.pat_type, 
  			username:this._common.getConnData().username, password:this._common.getConnData().password
  		}).subscribe(res=>{
  			// redirection to lifestyle component
        this.save_pat({name: f.value.name, age: f.value.age, 
        gender: f.value.gender, cell_no: this.patient_cell_no, id:res.id, type:res.type});

  			this._router.navigate(['/protected','prescription','vital-stat']);
  		});
  	}

  	select_pat(name:string, age:number, gender:string, id:number, type:string) //pat after select
  	{
        console.log(this.patient_cell_no);
  		this.save_pat({name:name, age:age, gender:gender, cell_no:this.patient_cell_no, id:id, type:type});
  		// redirection to lifestyle component
  		this._router.navigate(['/protected','prescription','vital-stat']);
  	}

  	save_pat(pat:{name, age, gender, cell_no, id, type})
  	{
  		this._service.set_pat_details(pat);
  	}
}
