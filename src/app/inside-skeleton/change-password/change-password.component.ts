import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../common.service';
import { InsideSkeletonComponent } from '../inside-skeleton.component';
import { ChangePasswordService } from './change-password.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    private input_type:string = 'password';

  	constructor(private _common:CommonService, private _inside:InsideSkeletonComponent,
  		private _service:ChangePasswordService) { }

  	ngOnInit() {
  	}

  	submit_change_password(form:NgForm)
  	{
  		//console.log(form.value);
  		this._service.change_password({
  			doc_id: form.value.doc_id, prev_pass: form.value.prev_pass, new_pass: form.value.new_pass,
  			username: this._common.getConnData().username, password: this._common.getConnData().password
  		}).subscribe(res=>{
  			console.log(res);
  			if(res === 'success')
  			{
  				this._inside.successful_msg = true;    
                this._inside.data_updated_msg = 'Password changed successfully';    
                this._inside.data_updated = true;
                setTimeout(()=>this.hide_data_saved_message(), 3000);
  			}
  			else
  			{
  				this._inside.successful_msg = false;    
                this._inside.data_updated_msg = 'Provided data was not accurate';    
                this._inside.data_updated = true;
                setTimeout(()=>this.hide_data_saved_message(), 3000);
  			}
  		}, err=> {
  			alert("Something went wrong. Please try again");
  		}); 
  	}

  	hide_data_saved_message()
    {
        this._inside.data_updated = false;
    }

    switch_input_type()
    {
        if(this.input_type == 'password')
            this.input_type = 'text';
        else
            this.input_type = 'password';
    }

}
