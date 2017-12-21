import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'doctorola-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

	date:Date;
	weekdays:string[] = ['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
	months:string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	month_days:number[]; // 0-30...so 31 days
	month_days_index:number = 0;
	box_row:number[] = Array(6).fill(1).map((x,i)=>i);
	box_col:number[] = Array(7).fill(1).map((x,i)=>i);
	this_month:number;
	this_year:number;
	day_start_from:number;	
	generated_days:number[][];	
	today:boolean = false;
	today_date:number = 0;
	@Output() clicked_date = new EventEmitter();	

  selected:boolean = false;
  selected_date:number = 0;					
  @Input() selected_day:string;
  	
    constructor() 
  	{        
  		this.date = new Date();            
      (!this.selected_day)? this.selected_day = this.date.getDate()+'/'+(this.date.getMonth()+1)+'/'+
      this.date.getFullYear():'';      
       
  	}

    ngOnInit()
    {
      console.log(this.selected_day);  
      // (+) parsing string to int/number
      this.generate_calendar(+(this.selected_day.split("/")[1])-1, +this.selected_day.split("/")[2]);
      //this.generate_calendar(this.date.getMonth(), this.date.getFullYear()); //generates the cal on this month
      //this.generate_calendar(10, 2017);
    }

  	generate_calendar(month:number, year:number)
  	{ 	
  		this.this_month = month;
  		this.this_year = year;

      //checking for today
  		if(month == this.date.getMonth() && year == this.date.getFullYear())
  		{
  			this.today = true;
  			this.today_date = this.date.getDate();
  		}
  		else
  		{
  			this.today = false;
  		}

      //checking for selected day
      if(month == +(this.selected_day.split("/")[1])-1 && year == +this.selected_day.split("/")[2])
      {
        this.selected = true;
        this.selected_date = +this.selected_day.split("/")[0];
      }
      else
      {
        this.selected = false;
      }

  		var firstday = String(new Date(year, month, 1)).split(" ")[0]; //getting the first day of the month
  		var lastday = String(new Date(year, month+1, 0)).split(" ")[0];
  		var total_days = Number(String(new Date(year, month+1, 0)).split(" ")[2]); //no of days in this month
  		this.day_start_from = this.weekdays.indexOf(firstday);
  		this.month_days = Array(total_days).fill(4).map((x,i)=>i+1); 

  		this.generate_day_positions();  	
  	}

  	generate_day_positions()
  	{	
  		this.generated_days = 	[
									[0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0],
									[0,0,0,0,0,0,0]
								];
		this.month_days_index = 0;						

  		for(let row of this.box_row)
  		{
  			for(let col of this.box_col)
  			{  				
  				if(row == 0 && col >= this.day_start_from)
  				{
  					this.generated_days[row][col] = this.month_days[this.month_days_index];
  					this.month_days_index++;
  				}
  				else if(row > 0 && this.month_days_index < this.month_days.length)
  				{
  					this.generated_days[row][col] = this.month_days[this.month_days_index];
  					this.month_days_index++;
  				}  				 
  			}
  		} 
  	}

  	navigate_month(direction:string)
  	{
  		if(direction == 'next')
  		{
  		 	(this.this_month == 11)? (this.this_year++, this.this_month = 0):(this.this_month++);
  		 	this.generate_calendar(this.this_month, this.this_year);
  		}
  		else
  		{
  			(this.this_month == 0)? (this.this_year--, this.this_month = 11):(this.this_month--);
  			this.generate_calendar(this.this_month, this.this_year);
  		}
  	}

  	pick_date(day:number)
  	{
  		if(day)
  		{	
  			this.clicked_date.emit(day+'/'+(this.this_month+1)+'/'+this.this_year);
  		}	
  	}

}
