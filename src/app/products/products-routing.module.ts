import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: '', component: AllProductsComponent },
  // view product
  {
    path:'view-product/:id',component:ViewProductComponent
  },
  {
    path:'wishlist',component:WishlistComponent
  },
  {
    path:'cart',component:CartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
