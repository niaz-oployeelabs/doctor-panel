import { Component, OnInit } from '@angular/core';
import { WalletService } from './wallet.service'; 

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

	private wallet_data:{}[] = [];	
	private data_loading = true;

  	constructor(private _wservice:WalletService) { }

  	ngOnInit() {
  		this.fetch_data();
  	}

  	fetch_data()
  	{
  		this._wservice.getData().subscribe(res=>{
  			this.wallet_data = res;
  			this.data_loading = false;
  		});
  	}

  	

}
