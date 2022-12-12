import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from 'src/http/service/products.service';
import { createProductInput } from '../inputs/create-product-input';
import { Product } from '../models/Product';

@Resolver()
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Query(() => [Product])
  // @UseGuards(AuthorizationGuard)
  products() {
    return this.productsService.listAllProducts();
  }

  @Mutation(() => Product)
  crateProduct(
    @Args('data')
    createProductInput: createProductInput,
  ) {
    return this.productsService.createProduct(createProductInput);
  }
}
