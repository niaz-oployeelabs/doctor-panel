import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ValidationService } from './validation.service';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'doctorola-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

	subscription:Subscription;
	invalid_access:boolean = false;

	constructor(private _validation:ValidationService, private _router:Router, private _common:CommonService) 
	{ }

    ngOnInit()
    {
        var creds = this.necessary_cookies(); // user credentials as cell_no & pass
        var cell_no = '';
        var password = '';
        try{
            //getting the cookie values
            creds.map(each_cred=>{
                var splitted = each_cred.split('=');
                switch (splitted[0]) {
                    case "_cred_1":
                        if(splitted[1]) {
                            cell_no = splitted[1];
                        }
                        break;
                    case "_cred_2":
                        if(splitted[1]) {
                            password = splitted[1];
                        }
                        break;

                    default:
                        break;
                }                
            });

            if(cell_no != ''){
                this.validate_user_login(cell_no, password); 
            }
        }
        catch(err)
        {
            return;
        }
    }

  	onSubmit(form:NgForm)
  	{
        this.validate_user_login(form.value.cell_no, form.value.password);   		
  	}

    validate_user_login(cell_no:string, password:string)
    {
        this.subscription = this._validation.validation({
          cell_no: cell_no, pass: password,
          username: this._common.getConnData().username, password:this._common.getConnData().password
        })
          .subscribe(res => {
              if(typeof res == 'string') // invalid access attempt
              {
                  this.invalid_access = true;
              }
              else // login successful 
              {    
                //console.log(res);    
                this._common.set_login_status(true);
                this._router.navigate(['protected']);
                this._common.set_all_info(res[0].name, res[0].id, res[0].designation, res[0].image,
                    res[0].specialty, res[0].specialty_id, cell_no,
                    res[0].description, res[0].phone_no, res[0].email, res[0].bmdc_no, res[0].degree,
                    password, res[0].doctor_online, res[0].prescription_subscription);

                /*****setting cookies***/
                /*var this_time = new Date().getTime(); // miliseconds from 1st jan 1970 till now
                var expiring_time = this_time + 24*10*60*60*1000; // adding 10 days with it
                var date_obj = new Date(expiring_time);
                //var year = date_obj.getFullYear();
                //var month = date_obj.getMonth();
                //var day = date_obj.getDay();
                var expiring_date_str = date_obj.toString();
                console.log(expiring_date_str); */

                document.cookie = `_cred_1=${cell_no}; path=/;`;   //setting user cell no as cookie
                document.cookie = `_cred_2=${password}; path=/;`;    // setting user pass as cookie
              }
          });
    }  

    necessary_cookies()
    {
        var cookies = document.cookie;
        var cookie = cookies.split(';');

        // searching cookies with name _cred_1 or _cred_2
        var creds = cookie.filter(each_cookie=>{
            var splitted = each_cookie.split("=");
            var key = splitted[0].trim();
            var value = splitted[1];
            return (key == '_cred_1' || key == '_cred_2');
        });   

        // trimming found ones
        return creds.map(each_elem=>{
            return each_elem.trim();
        });
    }  

  	ngOnDestroy()
  	{
  		this.subscription.unsubscribe();
  	}

}
