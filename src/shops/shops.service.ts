import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopInput } from './dto/create-shop.input';
import { UpdateShopInput } from './dto/update-shop.input';
import { Shop } from './entities/shop.entity';
import Fuse from 'fuse.js';
import shopsJson from './shops.json';
import nearShopsJson from './near-shop.json';
import { GetShopsArgs } from './dto/get-shops.args';
import { paginate } from 'src/common/pagination/paginate';
import { GetShopArgs } from './dto/get-shop.args';
import { GetStaffsArgs } from './dto/get-staffs.args';
import { GetFindShopDistanceArgs } from './dto/get-find-shop.args';
import { TransferShopOwnershipInput } from './dto/transfer-shop-ownership.input';
import { CreateShopMaintenanceEventInput } from './dto/create-shop-maintenance-event.input';

const shops = plainToClass(Shop, shopsJson);
const nearShops = plainToClass(Shop, nearShopsJson);
const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);

@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;
  private nearShops: Shop[] = nearShops;

  create(createShopInput: CreateShopInput) {
    return this.shops[0];
  }

  getShops({ text, first, page }: GetShopsArgs) {
    const startIndex = (page - 1) * first;
    const endIndex = page * first;
    let data: Shop[] = this.shops;
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }
    const results = data.slice(startIndex, endIndex);
    return {
      data: results,
      paginatorInfo: paginate(data.length, page, first, results.length),
    };
  }

  getStaffs({ shop_id, first, page }: GetStaffsArgs) {
    const startIndex = (page - 1) * first;
    const endIndex = page * first;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = this.shops.find((p) => p.id === String(shop_id))?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    return {
      data: results,
      paginatorInfo: paginate(staffs?.length, page, first, results?.length),
    };
  }

  getShop({ id, slug }: GetShopArgs): Shop {
    if (id) {
      return this.shops.find((p) => String(p.id) === String(id));
    }
    return this.shops.find((p) => p.slug === slug);
  }
  getNearShop(getFindShopDistanceArgs: GetFindShopDistanceArgs): Shop[] {
    return this.nearShops;
  }

  update(id: number, updateShopInput: UpdateShopInput) {
    return this.shops[0];
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }

  disapproveShop(id: number) {
    const shop = this.shops.find((s) => s.id === String(id));
    shop.is_active = false;

    return shop;
  }

  approveShop(id: number) {
    const shop = this.shops.find((s) => s.id === String(id));
    shop.is_active = true;

    return shop;
  }
  transferShopOwnership(createShopInput: TransferShopOwnershipInput) {
    return this.shops[0];
  }
  createShopMaintenanceEvent(createShopMaintenanceEventInput: CreateShopMaintenanceEventInput) {
    return this.shops[0];
  }
}
