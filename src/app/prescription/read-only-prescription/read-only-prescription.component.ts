import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { FollowUpPrescriptionService } from '../follow-up-prescription.service';
import { CommonService } from '../../common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'doctorola-read-only-prescription',
  templateUrl: './read-only-prescription.component.html',
  styleUrls: ['./read-only-prescription.component.css']
})
export class ReadOnlyPrescriptionComponent implements OnInit {

    private doctor:{};
    private patient:{};
	private p_id:string = '';
	private editable:number = null;

	data_loading:boolean = true;
	private lifestyles:{
        cell_no:string,
        created:string,
        lf_type:string,
        lf_value:string,
        lifestyle:string,
        pat_age:string,
        pat_gender:string,
        pat_id:string,
        pat_name:string,
        pat_type:string
    }[] = [];
	private problem_lists:{}[] = [];
	private medicines:{}[] = [];
	private tests:{}[] = [];
    private observations:{}[] = [];
    private advice:{}[];
    private vaccines:{}[] = [];
    private onsultation_record_id:number = null;

  	constructor(private _service:PrescriptionService, private _activated_route:ActivatedRoute, 
  	private _router:Router, private _f_p_service:FollowUpPrescriptionService,
    private _common:CommonService ) 
    {
        this._f_p_service.reset_prescription_data();
    }

  	ngOnInit() 
  	{      
  		this._activated_route.params.subscribe(params => {
  			this.p_id = params['p_id'];
  			this.editable = params['editable'];
  			//here go to db to fetch all data saved with this pres. id.
  			this._service.get_overall_prescription(this.p_id).subscribe(res=>{
                //console.log(res[0]);
  				this.lifestyles = res[0];
  				this.problem_lists = res[1];
  				this.medicines = res[2];
  				this.tests = res[3];
                this.observations = res[4];
                this.advice = res[5];  
                this.vaccines = res[6];
                  
  				this.data_loading = false;
                this._f_p_service.set_prescription_data(res[0], res[1], res[2], res[3], res[4], res[5], res[6]); 
  			});
  		});
        
        this.doctor = this._common.get_all_info();   
        this.onsultation_record_id = this._service.get_onsultation_record_id();
  	}

    send_prescription_to_onsultation_pat()
    {
        this._service.send_prescription({p_id:this.p_id, onsultation_id:this.onsultation_record_id,
        username:this._common.getConnData().username, password:this._common.getConnData().password})
        .subscribe(res=>{
            if(res == 'success')
            {
                alert('Prescription is Sent');
                this._service.destroy_onsultation_record_id();
                this._router.navigate(['/protected','online-consultation']);
                this._service.sms_medicine_to_patient({
                    cell_no: this.lifestyles[0].cell_no, medicines: this.medicines,
                    username:this._common.getConnData().username, password:this._common.getConnData().password
                }).subscribe(res=>{
                    //console.log(res);
                });               
            }
            else
            {
                alert("Something has gone wrong. Please try again");
            }
        },
            err=>{
                alert(err);   
            }
        );
    }

    nav_to_follow_up(is_update:number)
    {
        this._router.navigate(['/protected','prescription','follow-up', this.p_id, is_update]);
    }
}
