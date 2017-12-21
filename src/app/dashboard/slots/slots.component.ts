import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { Subscription } from 'rxjs/Rx';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../common.service';

@Component({
  selector: 'doctorola-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit, OnDestroy {

  	slot_subscription:Subscription;
  	slot_add_subscription:Subscription;
  	slot_cancel_subscription:Subscription;
  	open_req_subscription:Subscription;

  	show_slots:boolean = true;
  	show_open_req:boolean = false;

  	date:Date; 
  	chamber_id:number;
  	datepicker:boolean = false;
  	dp_date:string;	

  	slots:{}[] = [];
  	load_slots:boolean = false;
  	no_slot:boolean = false;

  	open_req:{}[] = [];
  	load_open_req:boolean = false;
  	no_open_req:boolean = false;

  	add_new_app:boolean = false;
  	add_new_app_slot_id:number;
  	add_new_app_time:string;

    disable_final_button:boolean = false;

  	constructor(private _route:ActivatedRoute, private _service:DashboardService,
  	private _common:CommonService) 
  	{
  		this.date = new Date();
  		this.dp_date = this.date.getDate()+"/"+(this.date.getMonth()+1)+"/"+this.date.getFullYear();
  	}

  	ngOnInit() 
  	{
  		this._route.params.subscribe(params => {
  			this.chamber_id = params['id'];
  			this.fetch_slot_on_change_date();
  		});
  	}

  	operate_dp()
  	{
  		this.datepicker = !this.datepicker;
  	}

  	received_date($event)
  	{
  		this.operate_dp();
  		this.dp_date = $event;
  		this.fetch_slot_on_change_date();
  	}

  	fetch_slot_on_change_date()
  	{
  		//dont worry ...we r sending get req...so date needed to reformatted..date with (/) can't be sent.
  		this.add_new_app = false; 	
  		this.load_slots = true;
  		this.slots = [];
  		this.load_open_req = true;
  		this.open_req = [];

  		this.slot_subscription = this._service.get_slots(
  			this.chamber_id, this.dp_date.split("/")[0]+"-"+this.dp_date.split("/")[1]+"-"+this.dp_date.split("/")[2] 			
  			).subscribe(res=>{
  				(typeof res == 'string')? this.no_slot = true : this.slots = res;
  				this.load_slots = false;
  		});

  		//fetch open req here	
  		this.open_req_subscription = this._service.get_open_req(
  				this.chamber_id, this.dp_date.split("/")[0]+"-"+this.dp_date.split("/")[1]+"-"+this.dp_date.split("/")[2]
  			).subscribe(res=>{
  				(typeof res == 'string')? this.no_open_req = true : this.open_req = res;
  				this.load_open_req = false;
  			});
  	}

  	open_add_new_app_panel(sl_id:number, from_data:string, from_merid:string)
  	{
  		this.add_new_app = true;
  		this.add_new_app_slot_id = sl_id;
  		this.add_new_app_time = from_data+" "+from_merid;
  		window.scrollTo(0,0);
  	}

  	close_add_new_app_panel()
  	{
  		this.add_new_app = false;
  	}

  	add_appointment_submit(form:NgForm)
  	{
      this.disable_final_button = true;  
  		this.slot_add_subscription = this._service.add_custom_app({
  			date:this.dp_date, slot_id:this.add_new_app_slot_id, loc_id:this.chamber_id,
  			p_name:form.value.name, p_reg_no:form.value.reg_no, p_cell_no:form.value.cell_no,
  			p_type:form.value.type, p_age:form.value.age, p_gender:form.value.gender,
  			p_time:this.add_new_app_time, doc_id:this._common.get_id(),
  			username:this._common.getConnData().username, password:this._common.getConnData().password
  		}).subscribe(res=>{
  			this.disable_final_button = false;
        if(res == 'occupied') 
  			{
  				alert('Sorry! This slot is already occupied');
  			}
  			this.fetch_slot_on_change_date();
  		});  	
  	}

  	deactivate_this_slot(sl_id:number)
  	{
  		this.slot_cancel_subscription = this._service.deactivate_slot({
  			slot_id: sl_id, date: this.dp_date,
  			username:this._common.getConnData().username, password:this._common.getConnData().password
  		}).subscribe(res=>{
  			if (res == 'occupied') 
  			{
  				alert('Sorry! This slot is already occupied');
  			}
  			this.fetch_slot_on_change_date();
  		});
  	}

  	activate_this_slot(sl_id:number)
  	{
  		this._service.activate_slot({
  			slot_id: sl_id, date: this.dp_date,
  			username:this._common.getConnData().username, password:this._common.getConnData().password
  		}).subscribe(res=>{
  			this.fetch_slot_on_change_date();
  		});
  	}

  	switch_view()
  	{
  		this.show_slots = !this.show_slots;
  		this.show_open_req = !this.show_open_req;
  	}

  	ngOnDestroy()
  	{
  		this.slot_subscription.unsubscribe();
  		this.open_req_subscription.unsubscribe();
  	/*	this.slot_add_subscription.unsubscribe();
  		this.slot_cancel_subscription.unsubscribe(); */
  	}
}
