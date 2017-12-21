import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PrescriptionService } from '../prescription.service';
import { CommonService } from '../../common.service';
import { FormComponent } from '../comp-deactive.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'doctorola-prescribe',
  templateUrl: './prescribe.component.html',
  styleUrls: ['./prescribe.component.css','../problem-list/problem-list.component.css']
})
export class PrescribeComponent implements OnInit, FormComponent, OnDestroy {

	pat_details:{};
	pat_lifestyles:{}[] = [];
	pat_problem_list:{}[] = [];
	data_loading:boolean = true;
    observations:{name:string, data:string, id:string}[] = [];   
    loading_observations:boolean = true;  
    show_prev_data:boolean = false;

	show_product_selection_input:boolean = false; // if generic selected..show product input
	product_list:{}[] = []; 
	product_list_on_input:{}[] = [];
	product_data_loading:boolean = false; 
	show_suggestion_product:boolean = false;
	product_data_typed:boolean = false;

    additional_advice:string = null;

	/************for multiselect of medicine**********/
    private shown_items_on_input:{}[] = []; 

    private show_suggestion:boolean = false; // whether to show suggestion
    private typed:boolean = false; // if user types anything

    private selected_items:{id:number, product:string, category:string, type:string,
      dose:string, instruction:string, generated_dose:string, day_time:string, meal:string, 
      days:number, continue:number}[] = [];

    private selected_generic:{id:number, text:string, type:string} = {id:null, text:null, type:null};
    private selected_product:{id:number, text:string, type:string, category:string} = {id:null, text:null, type:null, category:null};

    private default_val:string = '';
    private default_val_product = '';
    private loading_data:boolean = false;
	/*************************************/

  /*********for multiselect of test**********/

    private default_val_test:string = '';
    private show_suggestion_test:boolean = false;
    private loading_data_test:boolean = false;
    private shown_items_test:{id:number, text:string}[] = [];
    private selected_items_test:{id:number, text:string}[] = [];
  /*******************************************/
    @ViewChild('f') form: NgForm;
    private disable_final_button:boolean = false;
    private vaccines:{}[] = [];

  	constructor(private _service:PrescriptionService, private _common:CommonService,
  	private _router:Router, private _active_route:ActivatedRoute) 
  	{  		
  		this._service.set_step(3);  		
  	}

  	ngOnInit() 
  	{
  		this.pat_details = this._service.get_pat_details();	
  		this.pat_lifestyles = this._service.get_pat_lifestyle();
        this.vaccines = this._service.get_prescription_vaccines(); 
  		window.scrollTo(0,0);	 		
  		this._service.get_prescription_problem_lists().subscribe(res=>{
  			this.data_loading = false;
  			this.pat_problem_list = res;
  		});

        this._service.get_prescription_general_exams().subscribe(res=>{
            this.loading_observations = false;
            res.forEach(data=>{
                this.observations.push({name:data.type, data:data.term, id:data.id});
            });
        });  
  	}

    toggle_prev_data()
    {
        this.show_prev_data = !this.show_prev_data;
    }  
      
  	/********lifestyle adding in multi select or select2 ******/
	open_suggestion()
    {
        this.loading_data = false;
        this.show_suggestion = !this.show_suggestion;
    }

    open_suggestion_product()
    {
    	this.show_suggestion_product = !this.show_suggestion_product;
    }

    select_item(selected_obj:{id:number, text:string, type:string, category:string})
    {    	
      	this.open_suggestion();
        this.product_data_typed = false;
      	this.product_list = [];
      	this.default_val = selected_obj.text;
      	this.default_val_product = '';
        this.selected_generic = selected_obj;
        this.selected_product = {id:null, text:null, type:null, category:null};

        if(selected_obj.type == 'generic')
        {
          this.product_list = [];
        	this.show_suggestion_product = true;
        	this.show_product_selection_input = true;
        	this.product_data_loading = true;
        	this._service.get_category_wise_medicine_list({
            	category:selected_obj.text, 
            	username:this._common.getConnData().username, password:this._common.getConnData().password
        	}).subscribe((res:{id:number, text:string}[]) => {
            	this.product_data_loading = false;
            	res.forEach((obj)=>{                    
                	this.product_list.push(obj);
              });  
          }); 
        }
        else
        {
        	this.select_product(selected_obj);
        }
    }

    input_in_product_box(val:string)
    {
    	this.product_data_typed = true;
      this.show_suggestion_product = true;

    	this.product_list_on_input = this.product_list.filter((obj:{id:number, text:string, type:string}) => {
            return (obj.text.toLowerCase().search(val.toLowerCase()) != -1)? obj:'';           
      });
    }

    typed_input(val:string)
    {    
	    if(val.length > 2)
	    {	
	    	  this.show_product_selection_input = false;
	    	  this.loading_data = true;   
	        this.shown_items_on_input = [];      
	        this.show_suggestion = true;
	        this.typed = true;
	            
	        this._service.get_on_demand_medicines({
	            term:val, 
	            username:this._common.getConnData().username, password:this._common.getConnData().password
	        }).subscribe((res:{id:number, text:string}[]) => {
	            this.loading_data = false;
              this.shown_items_on_input = res;	          
	        }); 
	    }            
    }

    select_product(obj:{id:number, text:string, type:string, category:string})
    {
    	//console.log(obj);
    	this.default_val_product = obj.text;
    	this.open_suggestion_product();
      this.selected_product = obj;
    }

    remove_item_from_selection(obj:{id:number, text:string, type:string})
    {
        var elementPos = this.selected_items.map((x)=>{return x.id; }).indexOf(obj.id);
        this.selected_items.splice(elementPos,1);
    }

    add_item_in_queue()
    {
        this.selected_items.push({
          id:(this.selected_product.id)? this.selected_product.id:this.selected_generic.id,
          product: this.selected_product.text,
          category: (this.selected_product.id)? this.selected_product.category: this.selected_generic.text,
          type: (this.selected_product.type)? this.selected_product.type:this.selected_generic.type,
          dose:'',
          instruction:'',
          generated_dose:'',
          day_time:'', 
          meal:'', 
          days:0, 
          continue:0         
        });

        this.default_val = '';
        this.show_product_selection_input = false;
        this.selected_product = {id:null, text:null, type:null, category:null};
        this.selected_generic = {id:null, text:null, type:null};
        //console.log(this.selected_items); 
    }

	/**********************************************************/

  /***********test multiselect************************/

  switch_view_test_suggestion()
  {
      this.loading_data_test = false;
      this.show_suggestion_test = !this.show_suggestion_test;
  }

  typed_input_test(val:string)
  {
      if(val.length > 2)
      {  
          this.show_suggestion_test = true;
          this.loading_data_test= true;
          this.shown_items_test = [];
          this._service.get_on_demand_tests({
              term:val,
              username:this._common.getConnData().username, password:this._common.getConnData().password
          }).subscribe((res:{id:number, text:string}[])=>{
              //console.log(res);
              this.loading_data_test = false;
              this.shown_items_test = res;
          });
      }    
  }

  select_item_test(obj:{id:number, text:string})
  {
      this.default_val_test = '';
      this.switch_view_test_suggestion();
      this.selected_items_test.push(obj);         
  }

  remove_item_from_selection_test(obj:{id:number, text:string})
  {
      var elementPos = this.selected_items_test.map((x)=>{return x.id; }).indexOf(obj.id);
       this.selected_items_test.splice(elementPos,1);
  }
  /*************************/

  save_prescription(form:NgForm)
  {    
      this.disable_final_button = true;  
    //  console.log(form.value);
      this.reshaping_selected_item(form).then((res)=>{
          //console.log(res);
          //here we'll send data to db 
          this._service.save_prescription_medicine_test({
              prescription_identifier: this._service.get_prescription_identifier(),
              medicines: res,
              tests: this.selected_items_test,
              additional_advice: this.additional_advice,
              username:this._common.getConnData().username, password:this._common.getConnData().password
          }).subscribe(res=>{
              //here we redirect to show prescription in a read only format
              this.disable_final_button = false;
              this._service.reset_step();
              this._router.navigate(['/protected','prescription','overall', this._service.get_prescription_identifier(), 0]);
          }); 
      });  
  }

  reshaping_selected_item(form:NgForm)
  {
      return new Promise((resolve, reject)=>{
          this.selected_items.forEach((obj)=>{
            if(form.value['time_freq_'+obj.id] == "Hour(s)")
            {
                switch (24/form.value['freq_'+obj.id]) {
                  case 4:
                    obj.generated_dose = form.value['unit_'+obj.id]+" + "+form.value['unit_'+obj.id]+" + "+
                    form.value['unit_'+obj.id]+" + "+form.value['unit_'+obj.id]; 
                    break;
                  case 3:
                    obj.generated_dose = form.value['unit_'+obj.id]+" + "+form.value['unit_'+obj.id]+" + "+
                    form.value['unit_'+obj.id];
                    break;
                  case 2:
                    obj.generated_dose = form.value['unit_'+obj.id]+" + 0 + "+
                    form.value['unit_'+obj.id];
                    break;
                  case 1:
                    switch (form.value['day_time_'+obj.id]) {
                        case "Morning":
                            obj['generated_dose'] = form.value['unit_'+obj.id]+" + 0 + 0";
                            break;
                        case "Noon":
                            obj['generated_dose'] = "0 + "+form.value['unit_'+obj.id]+" + 0";
                            break;
                        case "Night":
                            obj['generated_dose'] = "0 + 0 + "+form.value['unit_'+obj.id];
                            break;  
                        default:
                            obj['generated_dose'] = form.value['unit_'+obj.id]+" unit(s) every "+form.value['freq_'+obj.id]+" "+form.value['time_freq_'+obj.id];
                            break;
                    }
                    break;  
                  default:
                    obj.generated_dose = form.value['unit_'+obj.id]+" unit(s) every "+form.value['freq_'+obj.id]+" "+form.value['time_freq_'+obj.id];
                    break;
                }
            }
            else if(form.value['time_freq_'+obj.id] == "Day(s)" && form.value['freq_'+obj.id] == 1)
            {
                switch (form.value['day_time_'+obj.id]) {
                  case "Morning":
                    obj.generated_dose = form.value['unit_'+obj.id]+" + 0 + 0";
                    break;
                  case "Noon":
                    obj.generated_dose = "0 + "+form.value['unit_'+obj.id]+" + 0";
                    break;
                  case "Night":
                    obj.generated_dose = "0 + 0 + "+form.value['unit_'+obj.id];
                    break;  
                  default:
                    obj.generated_dose = form.value['unit_'+obj.id]+" unit(s) every "+form.value['freq_'+obj.id]+" "+form.value['time_freq_'+obj.id];
                    break;
                }
            }
            else
            {
                obj.generated_dose = form.value['unit_'+obj.id]+" unit(s) every "+form.value['freq_'+obj.id]+" "+form.value['time_freq_'+obj.id];
            }

            obj.dose = form.value['unit_'+obj.id]+" unit(s) every "+form.value['freq_'+obj.id]+" "+form.value['time_freq_'+obj.id];
            obj.instruction = form.value['instruction_'+obj.id];
            obj.day_time = form.value['day_time_'+obj.id];
            obj.meal = form.value['meal_'+obj.id];
            obj.days = form.value['days_'+obj.id];
            obj.continue = (form.value['days_'+obj.id] > 0)? 0:(form.value['continue_'+obj.id])?1:0;
            //obj.continue = (form.value['continue_'+obj.id])?1:0;
          });

          resolve(this.selected_items);
      });       
  }

  switch_step(step:number)
	{
		if(step == 1)
		{
			this._router.navigate(['/protected','prescription','vital-stat','revisit']);
		}
		else
		{
			this._router.navigate(['/protected','prescription','problem-list','revisit']);
		}
	}

  form_status()
  {
    // if form submitted no need to stop any navigation...else if form is dirty stop navigation and ask  
      return (this.form.submitted)? false:(this.form.dirty)? true:false; 
  }

  ngOnDestroy()
  {
      this._service.reset_observation_status(true);
  }

}
