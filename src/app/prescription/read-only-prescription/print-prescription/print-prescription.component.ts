import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'doctorola-print-prescription',
  templateUrl: './print-prescription.component.html',
  styleUrls: ['./print-prescription.component.css'],
  //encapsulation: ViewEncapsulation.Native
})
export class PrintPrescriptionComponent implements OnInit {

	@Input() lifestyles:{}[];
	@Input() problem_lists:{}[];
	@Input() medicines:{}[];
	@Input() tests:{}[];
	@Input() observations:{}[];
	@Input() advice:{}[];
	@Input() vaccines:{}[];
	private doctor:{};

  	constructor(private _common:CommonService) { }

	ngOnInit() {
		//console.log(this.vaccines);
		this.doctor = this._common.get_all_info();
	}

	print_prescription()
    {
        let printContent, popupWin;

        
        printContent = document.getElementById('printable').innerHTML;
        popupWin = window.open('', '_blank', `top=0,left=0,height=200%,width=auto,
            scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no`);
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title>Print prescription</title>
                <link rel="stylesheet" href="src/app/prescription/read-only-prescription/print-prescription/print-prescription.component.css">
                
                <style>
                //........Customized style....... 
                #printable{
                    width:90%;
                } 
                div{
                    display: block;
                    overflow:auto;
                }
                p{
                    margin:0 0 10px 0;
                }
                .bordered{
                    border: 1px solid #000;
                }
                /*.sub_bordered{
                    border: 1px solid #000;
                }*/
                .bordered_with_padding{
                    padding: 10px;
                }
                .bordered_header{
                    border-bottom: 1px solid #000;
                    /*height:100px;*/
                }
                .borderd_header_inner, .borderd_body_inner{
                    padding: 10px;
                }
                .borderd_body_inner{
                    min-height: 900px;
                    position: relative;
                }
                .same_row_left{
                    width: 50%;
                    float: left;
                }
                .same_row_right{
                    width: 50%;
                    float: right;
                }
                .pull-right{
                    float:right;
                }
                .jumbo_block{
                    margin-bottom: 15px;
                }
                .jumbo_paragraph{
                    font-size: 15px;
                    margin:0 0 5px;
                    text-decoration: underline;
                }
                .signature_block{
                    display:block;
                }
                .inline_text_list{
                    padding: 0;
                    margin: 0 0 7px 0;
                }
                .inline_text_list li{
                    display: inline-block;
                    margin-right: 25px;
                }    
                table, th, td{
                    border: 1px solid black;
                    border-collapse: collapse;
                    padding: 4px;
                }                      
                @media print{
                    .page_break{
                        page-break-before: always;
                    }    
                    .non_breakable{
                        page-break-inside: avoid;
                    }   
                }                   
                                           
                    </style>
                    </head>
                    <body onload="window.print();window.close()">${printContent}</body>
                </html>`
            );
            popupWin.document.close();
        

        
    }
}
