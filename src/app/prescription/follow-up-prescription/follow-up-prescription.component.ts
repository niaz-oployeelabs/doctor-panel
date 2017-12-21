import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FollowUpPrescriptionService } from '../follow-up-prescription.service';
import { PrescriptionService } from '../prescription.service';
import { CommonService } from '../../common.service';
import { FormComponent } from '../comp-deactive.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'doctorola-follow-up-prescription',
  templateUrl: './follow-up-prescription.component.html',
  styleUrls: ['./follow-up-prescription.component.css','../read-only-prescription/read-only-prescription.component.css']
})
export class FollowUpPrescriptionComponent implements OnInit, OnDestroy, FormComponent {

	private lifestyle_shown_data:{}[] = [];
	private lifestyle_shown_data_input:{}[] = [];
	private lifestyle_loading_data:boolean = false;
	private lifestyle_input_default_val:string = '';
	private lifestyle_show_suggestion:boolean = false;
	private lifestyle_typed:boolean = false;
    private disable_personal_history_input:boolean = false;

    private vaccine_default_val:string = '';
    private vaccine_open_suggestion:boolean = false;
    private vaccine_loading_data:boolean = false;
    private vaccine_shown_items:{id:number, text:string}[] = [];
    private vaccines:{}[] = [];

	private problem_list_shown_data:{}[] = [];
	private problem_list_shown_data_input:{}[] = [];
	private problem_list_loading_data:boolean = false;
	private problem_list_input_default_val:string = '';
	private problem_list_show_suggestion:boolean = false;
	private problem_list_typed:boolean = false;

	private test_input_defaul_val:string = '';
	private test_show_suggestion:boolean = false;
	private test_loading_data:boolean = false;
	private test_shown_data:{}[] = [];

	private medicine_show_suggestion:boolean = false;
	private medicine_shown_data:{}[] = [];
	private medicine_default_val:string = '';
	private medicine_default_val_product:string = '';
	private medicine_typed:boolean = false;
	private medicine_loading_data:boolean = false;
	private medicine_selected_generic:{id:number, text:string, type:string} = {id:null, text:null, type:null};
  private medicine_selected_product:{id:number, text:string, type:string, category:string} = {id:null, text:null, type:null, category:null};

  private medicine_show_product_selection_input:boolean = false; 
	private medicine_product_list:{}[] = []; 
	private medicine_product_list_on_input:{}[] = [];
	private medicine_product_data_loading:boolean = false; 
	private medicine_show_suggestion_product:boolean = false;
	private medicine_product_data_typed:boolean = false;

	private lifestyles:{}[] = [];
	private problem_lists:{}[] = [];
	private medicines:{}[] = [];
	private tests:{}[] = [];

	private pat_id:number = null;
	private pat_type:string = null;
	private name:string = null;
	private age:number = null;
    private gender:string = null;
	private past_history:string = null;
    private allergy_history:string = null;
    private family_history:string = null;
    private observations:{}[] = [];
    private advice:{}[] = [];
    

	private cell_no:string = null;
	private pl_remarks:string = null;

	@ViewChild('f') form: NgForm;
	private disable_final_button:boolean = false;
    private prescription_identifier_for_update:string = null;

  	constructor(private _f_p_service:FollowUpPrescriptionService, 
  	private _service:PrescriptionService, private _common:CommonService, private _router:Router,
    private _activated_route:ActivatedRoute) 
  	{ 	
  		this.lifestyle_shown_data = this._service.lifestyle_master_data;
  		this.problem_list_shown_data = this._service.problem_list_master_data; 

  		this.lifestyles = this._f_p_service.get_prescription_data().lifestyle;
  		this.problem_lists = this._f_p_service.get_prescription_data().problem_list;
  		this.medicines = this._f_p_service.get_prescription_data().medicine;
  		this.tests = this._f_p_service.get_prescription_data().test;
        this.observations = this._f_p_service.get_prescription_data().observations;
        this.vaccines = this._f_p_service.get_prescription_data().vaccines;

        //console.log(this.vaccines);

        if(this._f_p_service.get_prescription_data().advice[0])
        {
            this.advice = this._f_p_service.get_prescription_data().advice;
        }
        else
        {
            this.advice.push({advice_id:0, advice:''});
        }
         
        //disabling add btns for already added observations
        this._f_p_service.get_prescription_data().observations.forEach(obs=>{
            this._service.set_observation_status(obs['obs_type'], false);  
        }); 
  	}

  	ngOnInit() 
  	{	
  		this.name = this.lifestyles[0]['pat_name'];
  		this.cell_no = this.lifestyles[0]['cell_no'];
  		this.pat_id = this.lifestyles[0]['pat_id'];
  		this.pat_type = this.lifestyles[0]['pat_type'];
  		this.age = this.lifestyles[0]['pat_age'];  		
        this.gender = this.lifestyles[0]['pat_gender'];  
  		this.past_history = this.lifestyles[0]['lf_value'];
        this.allergy_history = this.lifestyles[1]['lf_value'];  
        this.family_history = this.lifestyles[2]['lf_value'];

  		this.pl_remarks = (this.problem_lists.length > 0)? this.problem_lists[0]['pl_value']:'';

        this._activated_route.params.subscribe(params=>{
          if(params['update'] == 1)
          {
              this.prescription_identifier_for_update = params['p_id'];
          }
          else
          {
              this._service.set_prescription_identifier();
          }
      });  		
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
        this.vaccines.push(obj);         
    }

    remove_item_from_selection_vaccine(obj:{id:number, text:string})
    {
        var elementPos = this.vaccines.map((x)=>{return x['id']; }).indexOf(obj.id);
        this.vaccines.splice(elementPos,1);
    }
    /**************************/

    /*******obs code**********/

    add_observation(event:any)
    {
        this.observations.push({obs_type:event.name, obs_term:'', obs_id:event.id});      
    } 

    remove_item_from_selection_obs(observation:string)
    {
        var elementPos = this.observations.map((x)=>{return x['obs_type']; }).indexOf(observation);
        this.observations.splice(elementPos,1);
        this._service.set_observation_status(observation, true);
    }

    /*****************/

  	remove_item_from_selection_ls(obj:{id:number, text:string, type:string})
  	{
  		var elementPos = this.lifestyles.map((x)=>{return x['lf_value']; }).indexOf(obj.id);
        this.lifestyles.splice(elementPos,1);
  	}

  	remove_item_from_selection_pl(obj:{id:number, text:string, type:string})
  	{
  		var elementPos = this.problem_lists.map((x)=>{return x['pl_value']; }).indexOf(obj.id);
        this.problem_lists.splice(elementPos,1);
  	}

  	remove_item_med(obj:{id:number, text:string})
  	{
  		var elementPos = this.medicines.map((x)=>{return x['medicine_id']; }).indexOf(obj.id);
        this.medicines.splice(elementPos,1);
  	}

  	remove_item_from_selection_test(obj:{id:number, text:string})
  	{
  		var elementPos = this.tests.map((x)=>{return x['test_id']; }).indexOf(obj.id);
       	this.tests.splice(elementPos,1);
  	}

  	/***** multiselect start for lifestyle***/
  	lifestyle_open_suggestion()
  	{
  		this.lifestyle_loading_data = false;
  		this.lifestyle_show_suggestion = !this.lifestyle_show_suggestion;
  	}

  	lifestyle_typed_input(val:string)
  	{
  		this.lifestyle_loading_data = false;
  		this.lifestyle_shown_data_input = [];
  		this.lifestyle_show_suggestion = true;
  		this.lifestyle_typed = true;

  		//call promise here and access then
  		this.search_in_lifestyle_shown_data(val).then(res=>{
  			if(res < 1)
  			{
  				console.log('no data found');
  				this.lifestyle_loading_data = true;
  				this._service.get_on_demand_lifestyles({
	                term:val, 
	                username:this._common.getConnData().username, password:this._common.getConnData().password
	            }).subscribe((res:{id:number, text:string}[]) => {
	                this.lifestyle_loading_data = false;
	                res.forEach((obj)=>{                    
	                    this.lifestyle_shown_data.push(obj);
	                    this.lifestyle_shown_data_input.push(obj);
	                });  
	            });
  			}
  		});
  	}

    add_new_personal_history(value:string)
    {
        this.disable_personal_history_input = true;
        this.add_new_personal_history_promise(value).then( rec_id => {
            var obj:{id:number, text:string} = {id: Number(rec_id), text:value};
            this.lifestyle_select_item(obj);
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

  	search_in_lifestyle_shown_data(val:string)
  	{
  		return new Promise((resolve, reject)=>{
  			this.lifestyle_shown_data_input = this.lifestyle_shown_data.filter((obj:{id:number, text:string}) => {
	        	return (obj.text.indexOf(val) > -1)? obj:'';           
	        });

	        resolve(this.lifestyle_shown_data_input.length);
  		});
  	}

  	lifestyle_select_item(obj:{id:number, text:string})
  	{
  		this.lifestyles.push({
  			pat_id: this.pat_id,
  			pat_type: this.pat_type,
  			pat_name: this.name,
  			pat_age: this.age,
  			cell_no: this.cell_no,
  			lf_type: 'other_lifestyle',
  			lf_value: obj.id,
  			lifestyle: obj.text
  		});
  		this.lifestyle_open_suggestion();
        this.lifestyle_input_default_val = '';
  	}

  	/**********problem list multiselect*****/
  	problem_list_open_suggestion()
  	{
  		this.problem_list_loading_data = false;
  		this.problem_list_show_suggestion = !this.problem_list_show_suggestion;
  	}

  	problem_list_typed_input(val:string)
  	{
  		this.problem_list_loading_data = false;
  		this.problem_list_shown_data_input = [];
  		this.problem_list_show_suggestion = true;
  		this.problem_list_typed = true;

  		this.search_problem_list_shown_data(val).then(res=>{
  			if(res < 1)
  			{	
  				console.log('no data found');
	  			this.problem_list_loading_data = true;
	  			this._service.get_on_demand_problems({
	                term:val, 
	                username:this._common.getConnData().username, password:this._common.getConnData().password
	            }).subscribe((res:{id:number, text:string}[]) => {
	                this.problem_list_loading_data = false;
	                res.forEach((obj)=>{                    
	                    this.problem_list_shown_data.push(obj);
	                    this.problem_list_shown_data_input.push(obj);
	                });  
	            });
	        }    
  		});
  	}

  	search_problem_list_shown_data(val:string)
  	{
  		return new Promise((resolve, reject)=>{
  			this.problem_list_shown_data_input = this.problem_list_shown_data.filter((obj:{id:number, text:string}) => {
	            return (obj.text.indexOf(val) > -1)? obj:'';           
	        });

	        resolve(this.problem_list_shown_data_input.length);
  		});
  	}

  	problem_list_select_item(obj:{id:number, text:string})
  	{
  		this.problem_lists.push({
  			pl_type: 'problems',
  			pl_value: obj.id,
  			problem: obj.text
  		});
  		this.problem_list_open_suggestion();
  		this.problem_list_input_default_val = '';
  	}

  	/******test******/
  	test_open_suggestion()
  	{
  		this.test_loading_data = false;
  		this.test_show_suggestion = !this.test_show_suggestion;
  	}

  	test_typed_input(val:string)
  	{
  		if(val.length > 2)
  		{
  			this.test_show_suggestion = true;
  			this.test_loading_data = true;
  			this.test_shown_data = [];
  			this._service.get_on_demand_tests({
	            term:val,
	            username:this._common.getConnData().username, password:this._common.getConnData().password
	          	}).subscribe((res:{id:number, text:string}[])=>{
	              //console.log(res);
	              	this.test_loading_data = false;
	              	this.test_shown_data = res;
	        });
  		}
  	}

  	test_select_item(obj:{id:number, text:string})
  	{
  		this.tests.unshift({
  			diagnostic_test: obj.text,
  			test_id: obj.id,
  			result_remarks: ''
  		});
  		this.test_input_defaul_val = '';
  		this.test_open_suggestion();
  	}
  	/**********medicine selection********/
  	medicine_open_suggestion()
  	{
  		this.medicine_loading_data = false;
  		this.medicine_show_suggestion = !this.medicine_show_suggestion;
  	}

  	medicine_typed_input(val:string)
  	{
  		if(val.length > 2)
  		{
  			this.medicine_show_product_selection_input = false;
  			this.medicine_loading_data = true;
  			this.medicine_shown_data = [];
  			this.medicine_show_suggestion = true;
  			this.medicine_typed = true;
  			this._service.get_on_demand_medicines({
	            term:val, 
	            username:this._common.getConnData().username, password:this._common.getConnData().password
	        }).subscribe((res:{id:number, text:string}[]) => {
	            this.medicine_loading_data = false;
              this.medicine_shown_data = res;	          
	        });
  		}	
  	}

  	medicine_select_item(obj:{id:number, text:string, type:string, category:string})
  	{
  		this.medicine_open_suggestion();
      this.medicine_product_data_typed = false;
  		this.medicine_product_list = [];
  		this.medicine_default_val = obj.text;
  		this.medicine_default_val_product = '';
  		this.medicine_selected_generic = obj;
  		this.medicine_selected_product = {id:null, text:null, type:null, category:null};
  		if(obj.type == 'generic')
  		{
        this.medicine_product_list = [];
  			this.medicine_show_suggestion_product = true;
  			this.medicine_show_product_selection_input = true;
  			this.medicine_product_data_loading = true;
  			this._service.get_category_wise_medicine_list({
            	category:obj.text, 
            	username:this._common.getConnData().username, password:this._common.getConnData().password
        	}).subscribe((res:{id:number, text:string}[]) => {
            	this.medicine_product_data_loading = false;
              //console.log(res);
            	res.forEach((obj)=>{                    
                	this.medicine_product_list.push(obj);
              	});  
          	});
  		}
  		else
  		{
  			this.medicine_select_product(obj);
  		}
  	}

  	medicine_open_suggestion_product()
  	{
  		this.medicine_show_suggestion_product = !this.medicine_show_suggestion_product;
  	}

  	medicine_input_in_product_box(val:string)
  	{
  		this.medicine_product_data_typed = true;
      this.medicine_show_suggestion_product = true;
  		this.medicine_product_list_on_input = this.medicine_product_list.filter((obj:{id:number, text:string, type:string}) => {
            return (obj.text.toLowerCase().search(val.toLowerCase()) != -1)? obj:'';           
      });
  	}

  	medicine_select_product(obj:{id:number, text:string, type:string, category:string})
  	{
  		this.medicine_default_val_product = obj.text;
  		this.medicine_open_suggestion_product();
  		this.medicine_selected_product = obj;
  	}

  	medicine_add_item_in_queue()
  	{
  		this.medicines.push({
  			medicine_id: (this.medicine_selected_product.id)? this.medicine_selected_product.id:this.medicine_selected_generic.id,
  			medicine: this.medicine_selected_product.text,
  			dose:'',
  			remarks:'',
  			unit:'',
  			freq:'',
  			time:'',
            category: (this.medicine_selected_product.id)? this.medicine_selected_product.category: this.medicine_selected_generic.text,
            day_time: '',
            meal: '',
            days: 0,
            continue: 0,
            generated_dose:''
  		}); 

  		this.medicine_default_val = '';
  		this.medicine_show_product_selection_input = false;
  		this.medicine_selected_product = {id:null, text:null, type:null, category:null};
        this.medicine_selected_generic = {id:null, text:null, type:null};
  	}
  	/********/

  	save_follow_up_prescription(form:NgForm)
  	{
  		this.disable_final_button = true;	
  		this.reshaping_medicines(form).then(res=>{
          if(this.prescription_identifier_for_update)
          {
              // go for update this presc.
              this._f_p_service.update_prescription({
                cell_no: this.cell_no, name: this.name, age: this.age, gender: this.gender,
                pat_id: this.pat_id, pat_type: this.pat_type,
                past_history:this.past_history, allergy_history:this.allergy_history,
                family_history:this.family_history, observations:this.observations,
                advice:this.advice, 
                pl_remarks: this.pl_remarks,
                lifestyles: this.lifestyles.slice(3),
                problems: this.problem_lists.slice(1),
                tests: this.tests,
                medicines: this.medicines,
                vaccines:this.vaccines,
                prescription_identifier: this.prescription_identifier_for_update,
                doc_id: this._common.get_id(),
                username:this._common.getConnData().username, password:this._common.getConnData().password
              }).subscribe(res=>{
                //here we decide what to do where to go
                console.log(res);
                this.disable_final_button = false;
                this._router.navigate(['/protected','prescription','overall', this.prescription_identifier_for_update, 0]);
              });
          }
          else
          {  
              // make a new follow up presc.
    			this._f_p_service.save_whole_follow_up_prescription({
    				cell_no: this.cell_no, name: this.name, age: this.age, gender: this.gender,
    				pat_id: this.pat_id, pat_type: this.pat_type,
                    past_history:this.past_history, allergy_history:this.allergy_history,
                    family_history:this.family_history, observations:this.observations,
                    advice:this.advice,
    				pl_remarks: this.pl_remarks,
    				lifestyles: this.lifestyles.slice(3),
    				problems: this.problem_lists.slice(1),
    				tests: this.tests,
    				medicines: this.medicines,
                    vaccines:this.vaccines,
    				prescription_identifier: this._service.get_prescription_identifier(),
    				doc_id: this._common.get_id(),
    				username:this._common.getConnData().username, password:this._common.getConnData().password
    			}).subscribe(res=>{
    				//here we decide what to do where to go
    				//console.log(res);
    				this.disable_final_button = false;
    				this._router.navigate(['/protected','prescription','overall', this._service.get_prescription_identifier(), 0]);
    			});
          }      
  		});
  	}

  	reshaping_medicines(form:NgForm)
  	{
  		return new Promise((resolve, reject)=>{
  			this.medicines.forEach((obj)=>{
	            if(form.value['time_freq_'+obj['medicine_id']] == "Hour(s)")
                {
                    switch (24/form.value['freq_'+obj['medicine_id']]) {
                        case 4:
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" + "+form.value['unit_'+obj['medicine_id']]+" + "+
                            form.value['unit_'+obj['medicine_id']]+" + "+form.value['unit_'+obj['medicine_id']]; 
                            break;
                        case 3:
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" + "+form.value['unit_'+obj['medicine_id']]+" + "+
                            form.value['unit_'+obj['medicine_id']];
                            break;
                        case 2:
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" + 0 + "+
                            form.value['unit_'+obj['medicine_id']];
                            break;
                        case 1:
                            switch (form.value['day_time_'+obj['medicine_id']]) {
                                case "Morning":
                                    obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" + 0 + 0";
                                    break;
                                case "Noon":
                                    obj['generated_dose'] = "0 + "+form.value['unit_'+obj['medicine_id']]+" + 0";
                                    break;
                                case "Night":
                                    obj['generated_dose'] = "0 + 0 + "+form.value['unit_'+obj['medicine_id']];
                                    break;  
                                default:
                                    obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" unit(s) every "+form.value['freq_'+obj['medicine_id']]+" "+form.value['time_freq_'+obj['medicine_id']];
                                    break;
                            }
                            break;    
                        default:
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" unit(s) every "+form.value['freq_'+obj['medicine_id']]+" "+form.value['time_freq_'+obj['medicine_id']];
                            break;
                    }
                }
                else if(form.value['time_freq_'+obj['medicine_id']] == "Day(s)" && form.value['freq_'+obj['medicine_id']] == 1)
                {
                    switch (form.value['day_time_'+obj['medicine_id']]) {
                        case "Morning":
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" + 0 + 0";
                            break;
                        case "Noon":
                            obj['generated_dose'] = "0 + "+form.value['unit_'+obj['medicine_id']]+" + 0";
                            break;
                        case "Night":
                            obj['generated_dose'] = "0 + 0 + "+form.value['unit_'+obj['medicine_id']];
                            break;  
                        default:
                            obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" unit(s) every "+form.value['freq_'+obj['medicine_id']]+" "+form.value['time_freq_'+obj['medicine_id']];
                            break;
                    }
                }
              else
              {
                  obj['generated_dose'] = form.value['unit_'+obj['medicine_id']]+" unit(s) every "+form.value['freq_'+obj['medicine_id']]+" "+form.value['time_freq_'+obj['medicine_id']];
              }

              obj['dose'] = form.value['unit_'+obj['medicine_id']]+" unit(s) every "+form.value['freq_'+obj['medicine_id']]+" "+form.value['time_freq_'+obj['medicine_id']];
              obj['remarks'] = form.value['instruction_'+obj['medicine_id']];
              obj['day_time'] = form.value['day_time_'+obj['medicine_id']];
              obj['meal'] = form.value['meal_'+obj['medicine_id']];
              obj['days'] = form.value['days_'+obj['medicine_id']];
              obj['continue'] = (form.value['days_'+obj['medicine_id']] > 0)? 0:(form.value['continue_'+obj['medicine_id']])?1:0;
	        });

	        resolve(this.medicines);
  		});
  	}

  	form_status()
  	{
    // if form submitted no need to stop any navigation...else if form is dirty stop navigation and ask  
      	return (this.form.submitted)? false:(this.form.dirty)? true:false; 
  	}

  	ngOnDestroy()
  	{
  		this._service.reset_prescription_identifier();
        this._service.reset_observation_status(true);  
  	}
}
