import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../common.service';

@Injectable()
export class WalletService {

  	constructor(private _common:CommonService, private _http:Http) { }

  	getData()
  	{
  		return this._http.get(this._common.getBaseUrl()+"onsultation_api/wallet_for_doctor/id/"+this._common.get_id()+"/username/"+
		this._common.getConnData().username+"/password/"+this._common.getConnData().password+
		"/format/json")
		.map(res=>res.json());
  	}
  	

}
