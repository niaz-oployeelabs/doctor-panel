import { Injectable } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { CanActivate } from '@angular/router';

@Injectable()
export class PrescribeActivateGuardService {

  	constructor(private _pservice:PrescriptionService) { }

  	canActivate()
  	{
  		return (this._pservice.get_step())? true:false;
  	}

}
