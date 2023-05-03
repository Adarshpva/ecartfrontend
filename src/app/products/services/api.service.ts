import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //  to hold searchh term - behaviour subject
  searchTerm = new BehaviorSubject('')

  // to hold cart count
  cartItemsCount = new BehaviorSubject(0)

  BASE_URL='https://ecommerse-ddya.onrender.com'
  deletecartitem: any;
  removecartitem: any;

  constructor(private http:HttpClient) {
  this.cartCount()
 }

  // get all products
  getallproducts(){
    // api
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  // view product
  viewproduct(id:any){

    return this.http.get(`${this.BASE_URL}/products/view-products/${id}`)

  }
  // wishlist
  addtowishlist(id:any,title:any,price:any,image:any){
    const body={
      id,title,price,image
    }
    // api
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`,body)

  }
  // wishlist/get-items
  getwishlist(){
    // api
    return this.http.get(`${this.BASE_URL}/wishlist/get-items`)

  }
  // remove wishlist item
removewishlistitem(id:any){
  // api
  return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`)

}

// add to cart cart/add-product

addtocart(product:any){
  // get id,title,image,price,quantity from product
   const body={
    id:product.id,
    title:product.title,
    image:product.image,
    price:product.price,
    quantity:product.quantity
   }

  //  api
  return this.http.post(`${this.BASE_URL}/cart/add-product`,body)

}

// cart/all-products
getCart(){
  // api
  return this.http.get(`${this.BASE_URL}/cart/all-products`)

}


// cart count
cartCount(){
  this.getCart().subscribe(
    (result:any)=>{
      this.cartItemsCount.next(result.length)
    }
  )
  
}
// remove cart item
cartitem(id:any){
  return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)

}

// empty cart
emptycart(){
  return this.http.delete(`${this.BASE_URL}/cart/remove-all-items`)

}
// localhost:3000/cart/increment-item/1    increment count 
incCartItem(id:any){
  // api
  return this.http.get(`${this.BASE_URL}/cart/increment-item/${id}`)

}

decCartItem(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decrement-item/${id}`)

}
}
