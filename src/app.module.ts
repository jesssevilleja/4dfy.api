import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
// import { StripeModule } from 'nestjs-stripe';
import { AddressesModule } from './addresses/addresses.module';
import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributesModule } from './attributes/attributes.module';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { BecameSellerModule } from './became-seller/became-seller.module';
import { CategoriesModule } from './categories/categories.module';
import { ConversationsModule } from './conversations/conversations.module';
import { CouponsModule } from './coupons/coupons.module';
import { FaqsModule } from './faqs/faqs.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FlashSaleRequestModule } from './flash-sale-requests/flash-sale-request.module';
import { FlashSaleModule } from './flash-sale/flash-sale.module';
import { ImportsModule } from './imports/imports.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MessagesModule } from './messages/messages.module';
import { NotifyLogsModule } from './notify-log/notify-logs.module';
import { OrdersModule } from './orders/orders.module';
import { OwnershipTransferModule } from './ownership-transfer/ownership-transfer.module';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PaymentModule } from './payment/payment.module';
import { ProductsModule } from './products/products.module';
import { QuestionsModule } from './questions/questions.module';
import { RefundPoliciesModule } from './refund-policies/refund-policies.module';
import { RefundReasonModule } from './refund-reason/refund-reason.module';
import { RefundsModule } from './refunds/refunds.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SettingsModule } from './settings/settings.module';
import { ShippingsModule } from './shippings/shippings.module';
import { ShopsModule } from './shops/shops.module';
import { StoreNoticesModule } from './store-notices/store-notices.module';
import { TagsModule } from './tags/tags.module';
import { TaxesModule } from './taxes/taxes.module';
import { TermsAndConditionModule } from './terms-conditions/terms-conditions.module';
import { TypesModule } from './types/types.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { WithdrawsModule } from './withdraws/withdraws.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AppResolver } from './app.resolver';
// import { CommonModule } from './common/common.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.NODE_ENV === 'development' ? './schema.gql' : true,
      sortSchema: true,
      playground: true, // process.env.NODE_ENV === 'development',
    }),

    // StripeModule.forRoot({
    //   apiKey: process.env.STRIPE_API_KEY,
    //   apiVersion: '2022-11-15',
    // }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    SettingsModule,
    CouponsModule,
    CategoriesModule,
    AttributesModule,
    AddressesModule,
    ShopsModule,
    TypesModule,
    TagsModule,
    FaqsModule,
    UploadsModule,
    // CommonModule,
    WithdrawsModule,
    TaxesModule,
    ShippingsModule,
    AnalyticsModule,
    ImportsModule,
    WalletsModule,
    RefundsModule,
    AuthorsModule,
    ManufacturersModule,
    FeedbackModule,
    QuestionsModule,
    ReviewsModule,
    PaymentModule,
    PaymentMethodModule,
    PaymentIntentModule,
    StoreNoticesModule,
    MessagesModule,
    ConversationsModule,
    AiModule,
    RefundPoliciesModule,
    RefundReasonModule,
    TermsAndConditionModule,
    NotifyLogsModule,
    FlashSaleModule,
    FlashSaleRequestModule,
    BecameSellerModule,
    OwnershipTransferModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    if (process.env.NODE_ENV === 'development') {
      const sourcePath = path.join(__dirname, '../schema.gql');
      const adminDestinationPath = path.join(__dirname, './../../admin/schema.gql');
      const webDestinationPath = path.join(__dirname, './../../web/schema.gql');

      // Copy the schema file to the admin directory
      fs.copyFile(sourcePath, adminDestinationPath, (err) => {
        if (err) {
          console.error('Error copying schema.gql to admin:', err);
        } else {
          console.log('schema.gql copied to ./../admin/schema/schema.gql');
        }
      });

      // Copy the schema file to the web directory
      fs.copyFile(sourcePath, webDestinationPath, (err) => {
        if (err) {
          console.error('Error copying schema.gql to web:', err);
        } else {
          console.log('schema.gql copied to ./../web/schema/schema.gql');
        }
      });
    }
  }
}
