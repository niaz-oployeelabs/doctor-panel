import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CommonService } from '../common.service';

@Injectable()
export class PrescriptionGuardService implements CanActivate {

  	constructor(private _common:CommonService) { }

  	canActivate()
  	{
  		//console.log(this._common.get_all_info().prescription_active);
  		return (this._common.get_all_info().prescription_active == 1)? true:false;
  	}

}
