import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { CommonService } from '../../common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponent } from '../comp-deactive.service';
import { NgForm } from '@angular/forms';
 
@Component({
  selector: 'doctorola-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css','../lifestyle/lifestyle.component.css']
})
export class ProblemListComponent implements OnInit, FormComponent, OnDestroy {

  	@ViewChild('f') form: NgForm;
    disable_final_button:boolean = false;
    show_prev_data:boolean = false;

  	private remarks:string = null;

  	pat_details:{};
  	lifestyles:{term:string, type:string, lifestyle:string}[] = [];
    observations:{name:string, data:string, id:string}[] = [];  
  	data_loading:boolean = true;
    vaccine_data_loading:boolean = true;
    vaccine_items:{id:number, text:string}[] = [];  
  	private current_step:number;

  	/************for multiselect**********/
  	private shown_items:{}[] = [];
    private shown_items_on_input:{}[] = []; 

    private show_suggestion:boolean = false; // whether to show suggestion
    private typed:boolean = false; // if user types anything

    private selected:number[] = [];
    private selected_item:{id:number, text:string}[] = [];

    private default_val:string = '';
    private loading_data:boolean = false;
	/*************************************/

  	constructor(private _service:PrescriptionService, private _common:CommonService,
  	private _router:Router, private _active_route:ActivatedRoute) 
  	{
  		if(!this._active_route.snapshot.params['visit-status']) // comp loaded as step1 ...so set step as 1 
  		{
  			this._service.set_step(2);
  		}	
  		//console.log(this._service.get_step());
  	}

  	ngOnInit() 
  	{
  		this.pat_details = this._service.get_pat_details();
  		window.scrollTo(0,0);
  		this._service.get_prescription_lifestyle().subscribe(res=>{
  			this.lifestyles = res;
  			this._service.set_pat_lifestyle(res);
  			this.data_loading = false;
  		});
        this._service.get_prescription_vaccine().subscribe(res=>{
            this.vaccine_items = res;
            this.vaccine_data_loading = false;
            this._service.set_prescription_vaccines(res);
        });  
  		this.shown_items = this._service.problem_list_master_data; 
  		this.current_step = this._service.get_step();
  		
  		this._service.get_prescription_problem_lists().subscribe(res=>{
  			res.forEach(data=>{
  				if(data.type == 'remarks')
  				{
  					this.remarks = data.term;
  				}
  				else
  				{
  					this.selected.push(data.term);
  					this.selected_item.push({id:data.term, text:data.problems});
  				}
  			})
  		});
  		
        this._service.get_prescription_general_exams().subscribe(res=>{
            res.forEach(data=>{
                this._service.set_observation_status(data.type, false);
                this.observations.push({name:data.type, data:data.term, id:data.id});
            });
        });  
  	}

    toggle_prev_data()
    {
        this.show_prev_data = !this.show_prev_data;
    }  

    add_observation(event:any)
    {
        this.observations.push({name:event.name, data:'', id:event.id});      
    }  

    remove_item_from_selection_obs(observation:string)
    {
        var elementPos = this.observations.map((x)=>{return x.name; }).indexOf(observation);
        this.observations.splice(elementPos,1);
        this._service.set_observation_status(observation, true);
    }

  	/********lifestyle adding in multi select or select2 ******/
	open_suggestion()
    {
        this.loading_data = false;
        this.show_suggestion = !this.show_suggestion;
    }

    select_item(selected_obj:{id:number, text:string})
    {
        this.selected.push(selected_obj.id);
        this.selected_item.push({id:selected_obj.id, text:selected_obj.text});

        this.shown_items = this.shown_items.filter(( obj:{id:number, text:string} ) => {
            return (obj.id != selected_obj.id)?  obj:'';
        });

        this.shown_items_on_input = [];
        this.typed = false;
        this.open_suggestion();
        this.default_val = '';
    }

    typed_input(val:string)
    {     
    	this.loading_data = false;   
        this.shown_items_on_input = [];      
        this.show_suggestion = true;
        this.typed = true;
        
        this.search_shown_items(val).then(res=>{
            if(res < 1)
            {
                console.log('no data found');
                this.loading_data = true;
                this._service.get_on_demand_problems({
                    term:val, 
                    username:this._common.getConnData().username, password:this._common.getConnData().password
                }).subscribe((res:{id:number, text:string}[]) => {
                    this.loading_data = false;
                    res.forEach((obj)=>{                    
                        this.shown_items.push(obj);
                        this.shown_items_on_input.push(obj);
                    });  
                    //this._service.add_lifestyle_master_data(res);
                });       
            }
        });         
    }

    search_shown_items(val:string)
    {
        return new Promise((resolve, reject)=>{
            this.shown_items_on_input = this.shown_items.filter((obj:{id:number, text:string}) => {
                return (obj.text.indexOf(val) > -1)? obj:'';           
            });

            resolve(this.shown_items_on_input.length);
        });
    }

    remove_item_from_selection(obj:{id:number, text:string})
    {
        this.shown_items.push({id:obj.id, text:obj.text});
        var elementPos = this.selected_item.map((x)=>{return x.id; }).indexOf(obj.id);
        this.selected_item.splice(elementPos,1);
        this.selected.splice(elementPos,1);
    }
	/**********************************************************/

	add_problems(form:NgForm)
	{
		//console.log(form.value);
		//console.log(this.selected);
        this.disable_final_button = true;
		this._service.save_prescription_with_problems({
			problems:this.selected, remarks:form.value.remarks,
			prescription_identifier:this._service.get_prescription_identifier(),
            pat_id:this._service.get_pat_details().pat_id, pat_type:this._service.get_pat_details().pat_type,
            observations:this.observations,
			username:this._common.getConnData().username, password:this._common.getConnData().password
		}).subscribe(res=>{
			//console.log(res);
			//this is where we navigate to 3rd step
            this.disable_final_button = false;
			if(this._active_route.snapshot.params['visit-status'])
			{
				this._router.navigate(['/protected','prescription','prescribe','revisit']);
			}
			else
			{
				this._router.navigate(['/protected','prescription','prescribe']);
			}
		}, err=>{
			alert("Something went wrong. Please try again.");
			console.log(err);
		});
	}

	form_status()
	{
		// if form submitted no need to stop any navigation...else if form is dirty stop navigation and ask	
		return (this.form.submitted)? false:(this.form.dirty || this.selected)? true:false; 
	}

	switch_step(step:number)
	{
        this._service.reset_observation_status(true);
		if(step == 1)
		{
			this._router.navigate(['/protected','prescription','vital-stat','revisit']);
		}
		else
		{
			// navigate to the revisit link of prescribe (step 3) 
			this._router.navigate(['/protected','prescription','prescribe','revisit']);
		}
	}

    ngOnDestroy()
    {
        this._service.reset_observation_status(true);
    }	
}
