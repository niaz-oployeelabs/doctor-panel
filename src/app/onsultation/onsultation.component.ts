import { Component, OnInit } from '@angular/core';
import { OnsultationService } from './onsultation.service';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'doctorola-onsultation',
  templateUrl: './onsultation.component.html',
  styleUrls: ['./onsultation.component.css']
})
export class OnsultationComponent implements OnInit {

	data = [];
	data_loading:boolean = true;
    video_call_window:any = null;
    doctor_online:number = null;
    switch_online_status:boolean = false;

  	constructor(private _oservice:OnsultationService, private _router:Router,
    private _common:CommonService) 
    { 
        this.doctor_online = this._common.get_all_info().doctor_online;
    }

	ngOnInit() {
		this.fetch_data();
        //console.log(this.doctor_online);
	}

    fetch_data(){
        this._oservice.getData().subscribe(res=>{
              this.data = res;
              this.data_loading = false;
              console.log(res);
          }, err =>{
            alert("Error has occurred"); 
        });
    }

    go_for_video_call(id:number, session_id:string, token:string, index:number)
    {   
        console.log(index);
        this.data[index].end_onsultation_enabled = '1';
        let window_options = `top=0,left=0,height=300,width=400,menubar=0,toolbar=0,
        location=0,status=no,titlebar=no,resizable=1`;     
        
        //this.video_call_window = window.open('http://localhost/doctorola/doctorola-client/video_call?id='+id+'&s_id='+session_id+'&token='+token, '_blank', window_options);       
        this.video_call_window = window.open(this._common.getDoctorolaUrl()+'video_call?id='+id+'&s_id='+session_id+'&token='+token, '_blank', window_options);
        this.video_call_window.open();
    }

    finish_call(id:number, onsultation_charge:number, total_balance:any)
    {
        total_balance = (total_balance)? total_balance : 0;
        if(this.video_call_window)
        {    
            this.video_call_window.close();
        }    
        this._oservice.finish_call(id, onsultation_charge, total_balance).subscribe(res=>{
            alert("Call ended");
            //this._router.navigate(['/protected','online-consultation', '1']);
            this.fetch_data();
        },
        err=>{
            alert("Something wrong has occurred. Please try again.");
            this.fetch_data();
        });
    }

    switch_doctor_online_status(to_be_stat:number)
    {
        this.switch_online_status = true;
        this._oservice.switch_doctor_online_status(to_be_stat).subscribe(res=>{
            this.switch_online_status = false;
            this.doctor_online = to_be_stat;
        }, err=>{
            console.log(err);
            alert("Something wrong has occured. Please reload and try again");
        });

    }
}
