import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {
	private username:string = '';
	private password:string = '';
	private base_url:string = '';
    private doctorola_client_url:string = '';

	private login_status = false;
	private name:string = null;
	private id:number = null;
    private pass:string = null;
	private designation:string = null;
	private image:string = null;
	private specialty:string = null;
	private specialty_id:number = null;
	private mobile_no:string = null;

	private phone_no:string = null;
	private email:string = null;
	private bmdc_no:string = null;
	private degree:string = null;
	private description:string = null;
    private doctor_online:number = null;
    private is_prescription_active:number = null;

	private chambers:any;

  	constructor() 
  	{
  		this.username = '9791a47fef07649b1c3e70749e898153';
  		this.password = '2d593e25d0560b19fd84704f0bd24049';
  		//this.base_url = 'http://localhost/doctorola/doctorola-server/index.php/'; //local server
        //this.base_url = "http://oployeelabs.net/demo/demo_doctorola/doctorola-server/index.php/"; //demo server
        this.base_url = "http://67.225.137.209/index.php/"; // live server

        //this.doctorola_client_url = "http://localhost/doctorola/doctorola-client/";
        this.doctorola_client_url = "https://doctorola.com/";

  	}

  	get_login_status()
  	{
  		return this.login_status;
  	}

  	set_login_status(status:boolean)
  	{
  		this.login_status = status;
  	}

  	getConnData()
  	{
  		return {
  			username:this.username,
  			password:this.password
  		};
  	}

	getBaseUrl()
  	{
  		return this.base_url;
  	}

    getDoctorolaUrl()
    {
        return this.doctorola_client_url;
    }  

  	set_all_info(name:string, id:number, des:string, image:string, sp:string, sp_id:number, cell_no:string,
  	description:string, phone_no:string, email:string, bmdc:string, degree:string, pass:string, 
    doc_online:number, prescription_subscription:number)
  	{
  		this.name = name;
  		this.id = id;
  		this.designation = des;
  		this.image = image;
  		this.specialty = sp;
  		this.specialty_id = sp_id;
  		this.mobile_no = cell_no;
  		this.phone_no = phone_no;
  		this.description = description;
  		this.email = email;
  		this.bmdc_no = bmdc;
  		this.degree = degree;
        this.pass = pass;
        this.doctor_online = doc_online;
        this.is_prescription_active = prescription_subscription;
  	}

  	nullify_all_info()
  	{
  		this.name = null;
  		this.id = null;
  		this.designation = null;
  		this.image = null;
  		this.specialty = null;
  		this.specialty_id = null;
  		this.mobile_no = null;
  		this.phone_no = null;
  		this.description = null;
  		this.email = null;
  		this.bmdc_no = null;
  		this.degree = null;
        this.pass = null;
        this.doctor_online = null;
  	}

  	get_all_info()
  	{
  		return {
  			name: this.name,
  			id: this.id,
  			des: this.designation,
  			image: this.image,
  			sp: this.specialty,
  			sp_id: this.specialty_id,
  			cell_no: this.mobile_no,
  			other_phone_no: this.phone_no,
  			description: this.description,
  			email: this.email,
  			bmdc_no: this.bmdc_no,
  			degree: this.degree,
        pass: this.pass,
        doctor_online: this.doctor_online,
        prescription_active:this.is_prescription_active
  		};
  	}

  	get_name()
  	{
  		return this.name;
  	}

  	get_id()
  	{
  		return this.id;
  	}

  	get_image()
  	{
  		return this.image;
  	}

  	get_cell_no()
  	{
  		return this.mobile_no;
  	}

  	set_all_chambers(chambers:any)
  	{
  		this.chambers = chambers;
  	}

  	get_all_chambers()
  	{
  		return this.chambers;
  	}    
}
