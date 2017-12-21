import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { PrescriptionService } from '../prescription/prescription.service';
import { OnsultationService } from '../onsultation/onsultation.service';

@Component({
  selector: 'doctorola-inside-skeleton',
  templateUrl: './inside-skeleton.component.html',
  styleUrls: ['./inside-skeleton.component.css']
})
export class InsideSkeletonComponent implements OnInit{

    public successful_msg:boolean;
    public data_updated = false;
    public data_updated_msg = '';
    
  	constructor(private _common:CommonService, private _router:Router,
    private _prescription_service:PrescriptionService, private _oservice:OnsultationService) { }

    ngOnInit()
    {
        //load lifestyle, problem list, medicine & test data
        this._prescription_service.get_default_lifestyles();
        this._prescription_service.get_default_problem_lists();
    }

  	signout()
  	{ 
      /***destroying prev set cookies***/     
      document.cookie = "_cred_1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "_cred_2=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = " _cred_1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = " _cred_2=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  		this._common.set_login_status(false);	
  		this._common.nullify_all_info();
        this._prescription_service.reset_step();
        this._prescription_service.reset_prescription_identifier();        
  		this._router.navigate(['']);
  	}

}
