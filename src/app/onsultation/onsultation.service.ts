import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../common.service';

@Injectable()
export class OnsultationService {

  	constructor(private _http:Http, private _common:CommonService) { }

  	getData()
  	{
  		return this._http.get(this._common.getBaseUrl()+"onsultation_api/records_from_doctor_side/id/"+this._common.get_id()+"/username/"+
		this._common.getConnData().username+"/password/"+this._common.getConnData().password+
		"/format/json")
		.map(res=>res.json());
  	}

  	finish_call(id:number, charge:number, total:number)
  	{
  		return this._http.get(this._common.getBaseUrl()+"onsultation_api/finish_onsultation_call/id/"+id+"/is_pat/0/charge/"+charge+"/total_balance/"+total+"/doc_id/"+this._common.get_id()+"/username/"+
		this._common.getConnData().username+"/password/"+this._common.getConnData().password+
		"/format/json")
		.map(res=>res.json());
  	}

    switch_doctor_online_status(status:number)  
    {
        return this._http.get(this._common.getBaseUrl()+"onsultation_api/switch_doctor_online_status/doc_id/"+this._common.get_id()+"/online_status/"+status+"/username/"+
        this._common.getConnData().username+"/password/"+this._common.getConnData().password+
        "/format/json")
        .map(res=>res.json());
    }

}
