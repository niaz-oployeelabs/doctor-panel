import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'doctorola-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	private active_prescription:number = null;

  	constructor(private _common:CommonService) { 
  		this.active_prescription = this._common.get_all_info().prescription_active;
  	}

	ngOnInit() {
	}

}
