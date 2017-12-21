import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../../common.service';

@Injectable()
export class ChangePasswordService {

  	constructor(private _http:Http, private _common:CommonService) { }

  	change_password(data:Object)
  	{	
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/change_password/format/json",
        	body, {headers: headers})
        	.map(res => res.json()); 
  	}

}
