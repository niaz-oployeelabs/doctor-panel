import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  	selector: '[doctorolaDropdown]',
  	host: {
  		'(click)':'onClick()',
  		'(mouseleave)' : 'onLeave()'
  	}
})
export class DropdownDirective {

  	constructor(private el:ElementRef, private rnd:Renderer) { }

  	onClick()
  	{
  		this.rnd.setElementClass(this.el.nativeElement, 'open', true);
  	}

  	onLeave()
  	{
  		this.rnd.setElementClass(this.el.nativeElement, 'open', false);
  	}

}
