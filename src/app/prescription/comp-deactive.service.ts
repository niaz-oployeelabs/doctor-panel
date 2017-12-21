import { CanDeactivate } from '@angular/router';

export interface FormComponent{
	form_status():Boolean;
}

export class CompDeactiveService implements CanDeactivate<FormComponent>{

  	constructor() { }

  	canDeactivate(comp:FormComponent)
  	{
  		if(comp.form_status())
  		{	
  			return confirm("Are you sure you want to leave this page? Changes will remain unsaved");
  		}
  		
  		return true;	
  	}

}
