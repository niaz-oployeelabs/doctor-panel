import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CommonService } from '../common.service';
import 'rxjs/Rx';

@Injectable()
export class PrescriptionService {

    observations:{}[] = [
        {name:'Anaemia', status:true, id:'A'},
        {name:'Appearance', status:true, id:'B'},
        {name:'Body built', status:true, id:'C'},
        {name:'BP', status:true, id:'D'},
        {name:'Clubbing', status:true, id:'E'},
        {name:'Cyanosis', status:true, id:'F'},
        {name:'Decubitus', status:true, id:'G'},
        {name:'Dehydration', status:true, id:'H'},
        {name:'Edema', status:true, id:'I'},
        {name:'Jaundice', status:true, id:'J'},
        {name:'JVP', status:true, id:'K'},
        {name:'Koilonychia', status:true, id:'L'},
        {name:'Leukonychia', status:true, id:'M'},
        {name:'Lymphnode', status:true, id:'N'},
        {name:'Nutrition', status:true, id:'O'},
        {name:'Pulse', status:true, id:'P'},
        {name:'Skin condition', status:true, id:'Q'},
        {name:'Temperature', status:true, id:'R'}
    ];

	pat_name:string = null; 
	pat_age:number = null;
	pat_gender:string = null;
	pat_cell_no:string = null;
    pat_id:number = null;
    pat_type:string = null;
    lifestyle_master_data:{}[] = [];
    problem_list_master_data:{}[] = []; 
    prescription_identifier:string = null;
    pat_lifestyles:{}[] = [];
    vaccines:{id:number, text:string}[] = [];
    step:number = null;
    onsultation_record_id:number = null;

  	constructor(private _common:CommonService, private _http:Http) { }

    set_onsultation_record_id(id:number)
    {
       this.onsultation_record_id = id;
    }  

    get_onsultation_record_id()
    {
        return this.onsultation_record_id; 
    }

    destroy_onsultation_record_id()
    {
        this.onsultation_record_id = null;
    }

    set_observation_status(name:string, status:boolean)
    {
        this.observations.filter(x=>{
            if(x['name'] == name)
                x['status'] = status;
        });
    }

    reset_observation_status(status:boolean)
    {
        this.observations.filter(x=>{
            x['status'] = status;
        });
    }

    set_prescription_identifier()
    {
        this.prescription_identifier = this._common.get_id()+"-"+Math.round(new Date().getTime()/1000);
    }

    get_prescription_identifier()
    {
        return this.prescription_identifier;
    }

    reset_prescription_identifier()
    {
        this.prescription_identifier = null; 
    }

  	search_patient(cell_no:string)
  	{
  		return this._http.get(this._common.getBaseUrl()+"user_panel_api/get_all_users/cell_no/"+
  			cell_no+"/username/"+this._common.getConnData().username+"/password/"+
  			this._common.getConnData().password+"/format/json")
  			.map(res => res.json());
  	}

  	set_pat_details(data:{name, age, gender, cell_no, id, type})
  	{ 
  		this.pat_name = data.name;
  		this.pat_age = data.age;
  		this.pat_gender = data.gender;
  		this.pat_cell_no = data.cell_no;
        this.pat_id = data.id;
        this.pat_type = data.type;
  	}

  	get_pat_details()
  	{
  		return {name: this.pat_name, age: this.pat_age, gender:this.pat_gender, 
      cell_no:this.pat_cell_no, pat_id:this.pat_id, pat_type:this.pat_type};
  	}

  	add_new_patient(data:{})
  	{
  		const body = JSON.stringify(data);
   		const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"user_panel_api/add_user/format/json",
        	body, {headers: headers})
        	.map(res => res.json());
  	}

    get_default_lifestyles()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/default_lifestyle/sp/"+
        this._common.get_all_info().sp_id+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json()).subscribe(res=>{
            this.lifestyle_master_data = res;
        });
    }

    get_default_problem_lists()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/default_problem_list/sp/"+
        this._common.get_all_info().sp_id+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json()).subscribe(res=>{
            this.problem_list_master_data = res;
        });
    }

    get_on_demand_lifestyles(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/lifestyle_on_demand/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    get_on_demand_problems(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/problems_on_demand/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    add_lifestyle_master_data(data:{}[])
    {
        data.forEach(obj=>{
          this.lifestyle_master_data.push(obj);
        })
    }

    save_prescription_with_lifestyle(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/save_lifestyle_stage_data/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    save_prescription_with_problems(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/save_problems_stage_data/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    get_patient_histories()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/patient_history_prescription/pat_id/"+
        this.get_pat_details().pat_id+"/pat_type/"+this.get_pat_details().pat_type+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }

    get_prescription_lifestyle()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/prescription_lifestyle/prescription_identifier/"+
        this.get_prescription_identifier()+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }   

    get_prescription_vaccine()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/prescription_vaccine/prescription_identifier/"+
        this.get_prescription_identifier()+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    } 

    get_prescription_problem_lists()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/prescription_problem_list/prescription_identifier/"+
        this.get_prescription_identifier()+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }

    get_prescription_general_exams()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/prescription_general_examination/prescription_identifier/"+
        this.get_prescription_identifier()+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }

    set_pat_lifestyle(data:{}[])
    {
        this.pat_lifestyles = data;
    }

    get_pat_lifestyle()
    {
        return this.pat_lifestyles;
    }    

    set_prescription_vaccines(data:{id:number, text:string}[])
    {
        this.vaccines = data;
    }

    get_prescription_vaccines():{id:number, text:string}[]
    {
        return this.vaccines;
    }

    set_step(step:number)
    {
        this.step = step;
    }

    get_step()
    {
        return this.step;
    }

    reset_step()
    {
        this.step = null;
    }

    get_on_demand_medicines(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/medicines_on_demand/format/json",
          body, {headers: headers})
          .map(res => res.json());    
    }

    get_category_wise_medicine_list(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/medicine_product_category_wise/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    get_on_demand_tests(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/diagnostic_test_on_demand/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    get_on_demand_vaccines(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/vaccine_on_demand/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    save_prescription_medicine_test(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/save_prescription_medicine_tests/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }
    
    get_overall_prescription(p_id:string)
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/overall_prescription/prescription_identifier/"+
        p_id+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }

    get_latest_prescriptions()
    {
        return this._http.get(this._common.getBaseUrl()+"doctor_panel_api/latest_prescriptions/doc_id/"+
        this._common.get_id()+"/username/"+this._common.getConnData().username+"/password/"+
        this._common.getConnData().password+"/format/json")
        .map(res => res.json());
    }

    get_searched_prescription(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/search_prescription/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    send_prescription(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/tag_prescription_to_patient/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    sms_medicine_to_patient(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/sms_patient_medicine/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }

    add_new_keyword_personal_history(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/add_keyword/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }    
}
