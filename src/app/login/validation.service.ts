import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../common.service';
import 'rxjs/Rx';

@Injectable()
export class ValidationService {

  	constructor(private _http:Http, private _common:CommonService) { }

  	validation(data:{})
  	{
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');
        //headers.append('X-HTTP-Method-Override', 'POST');
        
        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/validation_modified/format/json",
        	body, {headers: headers})
        	.map(res => res.json()); 
  	}

}
