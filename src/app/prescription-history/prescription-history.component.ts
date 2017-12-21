import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../prescription/prescription.service';
import { CommonService } from '../common.service'; 
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'doctorola-prescription-history',
  templateUrl: './prescription-history.component.html',
  styleUrls: ['./prescription-history.component.css']
})
export class PrescriptionHistoryComponent implements OnInit {

	  prescriptions:{}[] = [];
	  data_loading:boolean = true;

    private search_cell_no:string = null;
    private search_name:string = null;
    private search_condition:string = "";
    disable_search_button:boolean = false;

  	constructor(private _service:PrescriptionService, private _router:Router, 
    private _common:CommonService) { }

  	ngOnInit() {
  		this._service.get_latest_prescriptions().subscribe(res=>{
  			this.data_loading = false;
  			this.prescriptions = res;
  		});
  	}

  	watch_read_only_prescription(p_id:string)
  	{
  		this._router.navigate(['/protected','prescription','overall', p_id, 1]);
  	}

    search(form:NgForm)
    {
        this.disable_search_button = true;
        this.data_loading = true;
        this.shape_condition_string().then(condition=>{
            //console.log(condition);
            this._service.get_searched_prescription({
                condition: condition, doc_id: this._common.get_id(),
                username:this._common.getConnData().username, password:this._common.getConnData().password
            }).subscribe(res=>{
                this.disable_search_button = false;
                this.data_loading = false;
                this.prescriptions = res;
                this.search_condition = '';
            });
        });
    }

    shape_condition_string()
    {        
        return new Promise((resolve, reject)=>{
            this.search_condition += (this.search_cell_no)? " and cell_no='"+this.search_cell_no+"'":"";
            this.search_condition += (this.search_name)? " and name like '%"+this.search_name+"%' ":""
            resolve(this.search_condition);
        });
    }
}
