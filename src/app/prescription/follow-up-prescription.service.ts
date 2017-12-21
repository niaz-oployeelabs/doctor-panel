import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Http, Headers } from '@angular/http';

@Injectable()
export class FollowUpPrescriptionService {

	private lifestyle:{}[] = [];
	private problem_list:{}[] = [];
	private medicine:{}[] = [];
	private test:{}[] = [];
    private observations:{}[] = [];
  private advice:{}[];
  private vaccines:{}[];

  	constructor(private _common:CommonService, private _http:Http) { }

  	reset_prescription_data()
  	{
  		this.lifestyle = [];
  		this.problem_list = [];
  		this.medicine = [];
  		this.test = [];
  	}

  	set_prescription_data(ls:{}[], pl:{}[], med:{}[], test:{}[], obs:{}[], adv:{}[], vacc:{}[])
  	{
  		this.lifestyle = ls;
  		this.problem_list = pl;
  		this.medicine = med;
  		this.test = test;
        this.observations = obs;
        this.advice = adv;  
            this.vaccines = vacc;
  	}

  	get_prescription_data()
  	{
  		return {
  			lifestyle: this.lifestyle, 
  			problem_list: this.problem_list,
  			medicine: this.medicine,
  			test: this.test,
            observations: this.observations,
            advice: this.advice, 
            vaccines:this.vaccines
  		};
  	}

  	save_whole_follow_up_prescription(data:{})
  	{
  		const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/whole_prescription/format/json",
          body, {headers: headers})
          .map(res => res.json());
  	}

    update_prescription(data:{})
    {
        const body = JSON.stringify(data);
        const headers = new Headers();      
        headers.append('Content-Type', 'application/json');

        return this._http.post(this._common.getBaseUrl()+"doctor_panel_api/update_prescription/format/json",
          body, {headers: headers})
          .map(res => res.json());
    }
}
