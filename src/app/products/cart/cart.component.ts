import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  public payPalConfig?: IPayPalConfig;

  allproducts: any = []
  cartTotalprice: number = 0
  proceedtopaymentbtnclickedstatus: Boolean = false
  username: string = ""
  flat: string = ""
  street: string = ""
  state: string = ""
  offerClickedStatus: boolean = false
  discountClickedStatus: boolean = false
  showSuccess: boolean = false
  showCancel: boolean = false
  showError: boolean = false
  showPaypal: boolean = false

  // address
  addressForm = this.fb.group({
    username: [''],
    flat: [''],
    street: [''],
    state: ['']

  })




  constructor(private api: ApiService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.api.getCart().subscribe(
      // 200
      (result: any) => {
        console.log(result);
        this.allproducts = result
        // get cart total
        this.getCartTotal()
            // paypal call
        this.initConfig()

      },
      // 400
      (result: any) => {
        console.log(result.error);
      }
    )

  }


  // get cart total
  getCartTotal() {
    let total = 0
    this.allproducts.forEach((item: any) => {
      total += item.grandTotal
      this.cartTotalprice = Math.ceil(total)
    });
  }


  // remove item
  removeitem(id: any) {
    this.api.cartitem(id).subscribe(
      (result: any) => {
        alert('item remove from cart')
        this.allproducts = result
        // update cart total price
        this.getCartTotal()
        // update cart total count
        this.api.cartCount()
      },
      (result: any) => {
        alert(result.error)
      }
    )
  }

  // empty 
  emptycart() {
    this.api.emptycart().subscribe((result => {
      this.allproducts = []
      // update cart total price
      this.getCartTotal()
      // update cart total count
      this.api.cartCount()

    }),
      (result: any) => {
        alert(result.error)
      }
    )
  }


  // increment cart
  increment(id: any) {
    this.api.incCartItem(id).subscribe((result: any) => {
      this.allproducts = result
      this.getCartTotal()

    },
      (result: any) => {
        alert(result.error)
      }
    )
  }

  // decrement cart ite
  decrement(id: any) {
    this.api.decCartItem(id).subscribe((result: any) => {
      this.allproducts = result
      this.getCartTotal()
    },
      (result: any) => {
        alert(result.error)
      }

    )
  }

  // discount
  checkOut(id: any) {
    this.api.cartitem(id).subscribe(
      (result: any) => {
        alert('proceed to pay')
        this.allproducts = result
      },
      (result: any) => {
        alert(result.error)
      }
    )
  }


  // submitbtnclicked
  submitBtnClicked() {
    if (this.addressForm.valid) {
      this.proceedtopaymentbtnclickedstatus = true
      this.username = this.addressForm.value.username || ""
      this.flat = this.addressForm.value.flat || ""
      this.street = this.addressForm.value.street || ""
      this.state = this.addressForm.value.state || ""






    }
    else {
      alert('please enter valid input!!!')
    }
  }

  // offerbtnclicked
  offerClicked() {
    this.offerClickedStatus = true
  }
  // discount 50 %
  discount50() {
    let discount = Math.ceil(this.cartTotalprice * 50 / 100)
    this.cartTotalprice -= discount
    this.discountClickedStatus = true

  }

  // discount 10 %
  discount10() {
    let discount = Math.ceil(this.cartTotalprice * 10 / 100)
    this.cartTotalprice -= discount
    this.discountClickedStatus = true

  }


  // payment
  makePayment() {
    this.showPaypal = true
  }


  // pay pal payment method

  private initConfig(): void {
    let amount = this.cartTotalprice.toString()
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data:any) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: amount
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: amount,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        // emptycart
        this.emptycart()

        // hide paypal div
        this.showPaypal = false

        // hide proceedtopaymentbtnclickedstatus
        this.proceedtopaymentbtnclickedstatus = false


      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true
        // hide paypal div
        this.showPaypal = false

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true
        // hide paypal div
        this.showPaypal = false

      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

// modalClose()
modalClose(){
  this.addressForm.reset()
  this.showCancel=false
  this.showError=false
  this.showSuccess=false
  this.showPaypal=false
  this.proceedtopaymentbtnclickedstatus=false
}
}


