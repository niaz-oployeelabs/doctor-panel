import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class InsideGuardService implements CanActivate {

  	constructor(private _common:CommonService, private _router:Router) { }

  	canActivate()
  	{
  		if(!this._common.get_login_status())
  		{
  			this._router.navigate(['/']);
  		}
  		return this._common.get_login_status();
  	}
}
