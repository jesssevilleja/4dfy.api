import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ShopsService } from './shops.service';
import { Shop } from './entities/shop.entity';
import { ApproveShopInput, CreateShopInput } from './dto/create-shop.input';
import { UpdateShopInput } from './dto/update-shop.input';
import { GetShopsArgs, ShopPaginator } from './dto/get-shops.args';
import { GetShopArgs } from './dto/get-shop.args';
import { AddStaffInput } from './dto/add-staff.input';
import { UserPaginator } from 'src/users/dto/get-users.args';
import { GetStaffsArgs } from './dto/get-staffs.args';
import { GetFindShopDistanceArgs } from './dto/get-find-shop.args';
import { TransferShopOwnershipInput } from './dto/transfer-shop-ownership.input';
import { CreateShopMaintenanceEventInput } from './dto/create-shop-maintenance-event.input';
import { User } from 'src/users/schema/user.schema';

@Resolver(() => Shop)
export class ShopsResolver {
  constructor(private readonly shopsService: ShopsService) {}

  @Mutation(() => Shop)
  createShop(@Args('input') createShopInput: CreateShopInput) {
    return this.shopsService.create(createShopInput);
  }

  @Query(() => ShopPaginator, { name: 'shops' })
  async getShops(@Args() getShopsArgs: GetShopsArgs): Promise<ShopPaginator> {
    return this.shopsService.getShops(getShopsArgs);
  }

  @Query(() => Shop, { name: 'shop', nullable: true })
  async getShop(@Args() getShopArgs: GetShopArgs): Promise<Shop> {
    return this.shopsService.getShop(getShopArgs);
  }
  @Query(() => [Shop], { name: 'findShopDistance' })
  async findShopDistance(
    @Args() getFindShopDistanceArgs: GetFindShopDistanceArgs,
  ): Promise<Shop[]> {
    return this.shopsService.getNearShop(getFindShopDistanceArgs);
  }

  @Mutation(() => Shop)
  updateShop(@Args('input') updateShopInput: UpdateShopInput) {
    return this.shopsService.update(updateShopInput.id, updateShopInput);
  }

  @Mutation(() => Shop)
  deleteShop(@Args('id', { type: () => ID }) id: number) {
    return this.shopsService.remove(id);
  }

  @Mutation(() => Shop)
  disapproveShop(@Args('id', { type: () => ID }) id: number) {
    return this.shopsService.disapproveShop(id);
  }

  @Mutation(() => Shop)
  approveShop(@Args('input') approveShopInput: ApproveShopInput) {
    return this.shopsService.approveShop(approveShopInput.id);
  }

  // @Query(() => UserPaginator, { name: 'staffs' })
  // async getStaffs(
  //   @Args() getStaffsArgs: GetStaffsArgs,
  // ): Promise<UserPaginator> {
  //   // return this.shopsService.getShops(getShopsArgs);
  //   return this.shopsService.getStaffs(getStaffsArgs);
  // }

  @Mutation(() => Boolean)
  addStaff(@Args('input') addStaffInput: AddStaffInput) {
    console.log(addStaffInput);
    return true;
    // return this.shopsService.create(addStaffInput);
  }

  @Mutation(() => User)
  removeStaff(@Args('id', { type: () => ID }) id: number) {
    return this.shopsService.remove(id);
  }

  @Mutation(() => Shop)
  transferShopOwnership(@Args('input') transferShopOwnershipInput: TransferShopOwnershipInput) {
    return this.shopsService.transferShopOwnership(transferShopOwnershipInput);
  }

  @Mutation(() => Shop)
  createShopMaintenanceEvent(@Args('input') createShopMaintenanceEventInput: CreateShopMaintenanceEventInput) {
    return this.shopsService.createShopMaintenanceEvent(createShopMaintenanceEventInput);
  }
}
