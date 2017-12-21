import { Component, EventEmitter, Output } from '@angular/core';
import { PrescriptionService } from '../../prescription.service';

@Component({
  selector: 'doctorola-general-exam',
  templateUrl: './general-exam.component.html',
  styleUrls: ['./general-exam.component.css']
})
export class GeneralExamComponent {

	@Output() observation_name = new EventEmitter<{name:string, id:string}>();

    observations:{}[] = [];

  	constructor(private _service:PrescriptionService) 
    { 
        this.observations = this._service.observations;
    }

  	select_general_exam(exam:{name:string, status:boolean, id:string})
  	{
  		//event.path[0].disabled = true;  
        this._service.set_observation_status(exam.name, false);  
  		this.observation_name.emit({name:exam.name, id:exam.id});
  	}

}
