import { Component, OnInit, ViewChild } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { NgForm } from '@angular/forms';
import { FormComponent } from '../comp-deactive.service';
import { CommonService } from '../../common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'doctorola-lifestyle',
  templateUrl: './lifestyle.component.html',
  styleUrls: ['./lifestyle.component.css','../prescription.component.css']
})
export class LifestyleComponent implements OnInit, FormComponent {
    
    private past_history:string = null;
    private allergy_history:string = null;
    private family_history:string = null;
      
  	current_step:number;
  	pat_details:{};
  	@ViewChild('f') form: NgForm;

    disable_final_button:boolean = false;

    /*********for multiselect of vaccine**********/
    private vaccine_default_val:string = '';
    private vaccine_open_suggestion:boolean = false;
    private vaccine_loading_data:boolean = false;
    private vaccine_shown_items:{id:number, text:string}[] = [];
    private vaccine_selected_items:{id:number, text:string}[] = [];
  /*******************************************/
    
  	private shown_items:{}[] = [];
    private shown_items_on_input:{}[] = []; 

    private show_suggestion:boolean = false; // whether to show suggestion
    private typed:boolean = false; // if user types anything

    private selected:number[] = [];
    private selected_item:{id:number, text:string}[] = [];

    private default_val:string = '';
    private loading_data:boolean = false;
    private disable_personal_history_input:boolean = false;

  	constructor(private _service:PrescriptionService, private _common:CommonService,
  	private _router:Router, private _active_route:ActivatedRoute) 
  	{	  
  		if(!this._active_route.snapshot.params['visit-status']) // comp loaded as step1 ...so set step as 1 
  		{
  			this._service.set_step(1);
  		}
  	}

  	ngOnInit() 
  	{
  		this.pat_details = this._service.get_pat_details();
  		window.scrollTo(0,0);
  		this.shown_items = this._service.lifestyle_master_data; 
  		this.current_step = this._service.get_step();		
  		if(this._active_route.snapshot.params['visit-status']) // if revisited load presviously saved data
  		{
  			this._service.get_prescription_lifestyle().subscribe(res=>{
	  			res.forEach(res=>{
	  				if(res.type == 'past_history')
	  				{
	  					this.past_history = res.term;
	  				}
	  				else if(res.type == 'allergy_history')
	  				{
                        this.allergy_history = res.term;       
	  				}
	  				else if(res.type == 'family_history')
	  				{
	  					this.family_history = res.term;
	  				}	  				
	  				else
	  				{
	  					this.selected.push(res.term);
	  					this.selected_item.push({id:res.term, text:res.lifestyle});
	  				}                    
	  			});
	  		});

            this._service.get_prescription_vaccine().subscribe(res=>{
                this.vaccine_selected_items = res;
            });  
  		}
        else // newly loaded comp...get patient histories
        {
            this._service.get_patient_histories().subscribe(res=>{
                res.forEach(res=>{
                    if(res.type == 'past_history')
                    {
                        this.past_history = res.term;
                    }
                    else if(res.type == 'allergy_history')
                    {
                        this.allergy_history = res.term;       
                    }
                    else if(res.type == 'family_history')
                    {
                        this.family_history = res.term;
                    }                      
                    else if(res.type == 'other_lifestyle')
                    {
                        this.selected.push(res.term);
                        this.selected_item.push({id:res.term, text:res.lifestyle});
                    }
                    else if(res.type == 'vaccine')
                    {
                        this.vaccine_selected_items.push({id:res.term, text:res.vaccine});
                    }
                });
            });
        }    
  	}
  	 
    /**********vaccine adding in multiselect**********/   
    switch_vaccination_suggestion()
    {
        this.vaccine_open_suggestion = !this.vaccine_open_suggestion;
    }  

    vaccine_typed_input(searched_vaccine:string)
    {
        if(searched_vaccine.length > 2)
        {
            this.vaccine_open_suggestion = true;
            this.vaccine_loading_data = true;
            this.vaccine_shown_items = [];
            this._service.get_on_demand_vaccines({
              term:searched_vaccine,
              username:this._common.getConnData().username, password:this._common.getConnData().password
            }).subscribe((res:{id:number, text:string}[])=>{
                //console.log(res);
                this.vaccine_loading_data = false;
                this.vaccine_shown_items = res;
            });
        }
    }

    vaccine_select_item(obj:{id:number, text:string})
    {
        this.vaccine_default_val = '';
        this.switch_vaccination_suggestion();
        this.vaccine_selected_items.push(obj);         
    }

    remove_item_from_selection_vaccine(obj:{id:number, text:string})
    {
      var elementPos = this.vaccine_selected_items.map((x)=>{return x.id; }).indexOf(obj.id);
       this.vaccine_selected_items.splice(elementPos,1);
    }
    /**************************/

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

    add_new_personal_history(value:string)
    {
        this.disable_personal_history_input = true;
        this.add_new_personal_history_promise(value).then( rec_id => {
            var obj:{id:number, text:string} = {id: Number(rec_id), text:value};
            this.select_item(obj);
            this.disable_personal_history_input = false;
        }).catch(err => {
            console.log(err);
            alert("Something wrong has happened. Try again");
        });
    }

    add_new_personal_history_promise(value:string)
    {   
        return new Promise((resolve, reject)=>{
            this._service.add_new_keyword_personal_history({
                value: value, sp:this._common.get_all_info().sp_id, insert_into:'personal_history',
                username:this._common.getConnData().username, password:this._common.getConnData().password
            }).subscribe(res=>resolve(res), err=>reject(err));
         });      
    }

    typed_input(val:string)
    {     
    	this.loading_data = false;   
        this.shown_items_on_input = [];      
        this.show_suggestion = true;
        this.typed = true;
      
        this.search_in_shown_items(val).then(res=>{
            if(res < 1)
            {
                console.log('no data found');
                this.loading_data = true;
                this._service.get_on_demand_lifestyles({
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

    search_in_shown_items(val:string)
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

	add_vital_stat(form:NgForm)
	{
    this.disable_final_button = true;
		this._service.save_prescription_with_lifestyle({
			past_history:form.value.past_history, allergy_history:form.value.allergy_history, 
			family_history:form.value.family_history, lifestyles:this.selected,
			cell_no:this._service.get_pat_details().cell_no, name:this._service.get_pat_details().name,
            age: this._service.get_pat_details().age, gender:this._service.get_pat_details().gender,
            vaccines:this.vaccine_selected_items,
			prescription_identifier:this._service.get_prescription_identifier(),
			doctor_id:this._common.get_id(),
			pat_id:this._service.get_pat_details().pat_id, pat_type:this._service.get_pat_details().pat_type,
			username:this._common.getConnData().username, password:this._common.getConnData().password
		}).subscribe(res=>{
			//console.log(res);
            this.disable_final_button = false;
            if(this._active_route.snapshot.params['visit-status'])
            {
                this._router.navigate(['/protected','prescription','problem-list','revisit']);  
            }
            else
            {
                this._router.navigate(['/protected','prescription','problem-list']);
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
		if(step == 2)
		{
			this._router.navigate(['/protected','prescription','problem-list','revisit']);
		}
		else
		{
			// navigate to the revisit link of prescribe (step 3) 
            this._router.navigate(['/protected','prescription','prescribe','revisit']);
		}
	}

}
