import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    // RATE LIMITING (only 5 api hits in one min)
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60000, // 60 seconds
          limit:5
        },
      ]
    }),
    ConfigModule.forRoot(),
    ProductsModule, 
    PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
  {
    provide: APP_GUARD,
    useClass:CustomThrottlerGuard
  }
  ],
})
export class AppModule {}
