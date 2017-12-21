import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'doctorola-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	basic_info:{};
	chambers:{}[] = [];
	no_chamber:boolean = false;

  	constructor(private _common:CommonService) { }

	ngOnInit() {	
		this.basic_info = this._common.get_all_info();
		if(this._common.get_all_chambers().error) // no chamber found
		{
			this.no_chamber = true;
		}
		else //chambers found
		{
			this.chambers = this._common.get_all_chambers();			
		}
	}

}
