import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allproducts:any=[]
  searchTerm:string=''

  constructor(private api:ApiService){

  }

ngOnInit(): void {
  this.api.getallproducts().subscribe((result:any)=>{
    console.log(result);
    this.allproducts = result
    
  })


  //  to get search term from apiservice
  this.api.searchTerm.subscribe((result:any)=>{
    this.searchTerm=result
    console.log(this.searchTerm);

  })
  
}
// addtocart(product)
addtocart(product:any){

  // add{quantity:1} to product object
  Object.assign(product,{quantity:1})

  console.log(product);


  // api call
  this.api.addtocart(product).subscribe(
    // 200
    (result:any)=>{
      alert(result)
    },
    // 400
    (result:any)=>{
      alert(result.error)
    }

  )
}


}
