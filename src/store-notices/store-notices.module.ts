import { Module } from '@nestjs/common';
import { StoreNoticesResolver } from './store-notices.resolver';
import { StoreNoticesService } from './store-notices.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule
  ],
  providers: [StoreNoticesResolver, StoreNoticesService],
})
export class StoreNoticesModule {}
