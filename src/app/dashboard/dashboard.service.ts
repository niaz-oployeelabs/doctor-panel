import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../common.service';
import 'rxjs/Rx';

@Injectable()
export class DashboardService {

  	constructor(private _common:CommonService, private _http:Http) { }

  	get_chambers()
  	{
  		return this._http.get(this._common.getBaseUrl()+"api/information/meta-info/location/id/"+
  			this._common.get_id()+"/username/"+this._common.getConnData().username+"/password/"+
  			this._common.getConnData().password+"/format/json")
  			.map(res => res.json());
  	}

  	get_slots(loc_id:number, date:string)
  	{
  		return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/slot_modified/doc_id/"+
  			this._common.get_id()+"/loc_id/"+loc_id+"/date/"+date+"/username/"+
  			this._common.getConnData().username+"/password/"+
  			this._common.getConnData().password+"/format/json")
  			.map(res => res.json());
  	}

  	add_custom_app(data:Object)
  	{	
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/custom_app_creation_modified/format/json",
        	body, {headers: headers})
        	.map(res => res.json()); 
  	}

  	deactivate_slot(data:{})
  	{
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/slot_cancel_modified/format/json",
        	body, {headers: headers})
        	.map(res => res.json()); 
  	}

  	activate_slot(data:{})
  	{
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/activate_slot_modified/format/json",
        	body, {headers: headers})
        	.map(res => res.json());
  	}

  	get_open_req(loc_id:number, date:string)
  	{
  		return this._http.get(this._common.getBaseUrl()+"open_req_api/doc_loc_date_wise_req/doc_id/"+
  			this._common.get_id()+"/loc_id/"+loc_id+"/date/"+date+"/username/"+
  			this._common.getConnData().username+"/password/"+
  			this._common.getConnData().password+"/format/json")
  			.map(res => res.json());
  	}

}
