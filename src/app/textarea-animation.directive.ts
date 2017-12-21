import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[animatedTextarea]',
  host:{
  	//'(focusin)': 'onFocusIn()',
  	'(focusout)': 'onFocusOut()',
  	'(mouseenter)': 'onFocusIn()',
  	'(mouseleave)': 'onFocusOut()'
  }
})
export class TextareaAnimationDirective {

  	constructor(private el:ElementRef, private rnd:Renderer) { }

  	onFocusIn()
  	{
  		this.rnd.setElementClass(this.el.nativeElement, 'textarea_expanded', true);
  		this.rnd.setElementClass(this.el.nativeElement, 'textarea_shrinked', false);
  	}

  	onFocusOut()
  	{
  		this.rnd.setElementClass(this.el.nativeElement, 'textarea_expanded', false);
  		this.rnd.setElementClass(this.el.nativeElement, 'textarea_shrinked', true);
  	}

}
