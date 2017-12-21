import { Injectable } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { CanActivate } from '@angular/router';

@Injectable()
export class LifestyleActivateGuardService implements CanActivate {

  	constructor(private _pservice:PrescriptionService) { }

  	canActivate()
  	{
  		return (this._pservice.get_step() && this._pservice.get_step() > 1)? false:true;
  	}
}
