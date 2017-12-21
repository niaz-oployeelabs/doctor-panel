import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'doctorola-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

	chamber_loading:boolean = true;
	no_chamber:boolean = false;
	chambers:{id:number, address:string, short_address:string}[] = [];
	subscription: Subscription;

  	constructor(private _service:DashboardService, private _router:Router, private _common:CommonService) { }

  	ngOnInit() 
  	{
  		this.subscription = this._service.get_chambers().subscribe(
  			res => {
  				if(!res.error)
  				{	
	  				res.forEach((item, index) => {
	  					this.chambers.push({id: item.id, 
	  						address: (item.center)? item.center+", "+item.area+", "+item.city : item.address_note+", "+item.area+", "+item.city,
	  						short_address: item.area+", "+item.city
	  					});  					
	  				});	  				
	  				this._router.navigate(['/protected','dashboard','slots', res[0].id]);
	  			}	
	  			else
	  			{
	  				this.no_chamber = true;
	  			}
	  			this.chamber_loading = false;
	  			this._common.set_all_chambers(res);
  			}
  		);
  	}

  	ngOnDestroy()
  	{
  		this.subscription.unsubscribe();
  	}

}
