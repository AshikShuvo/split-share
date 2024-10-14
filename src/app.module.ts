import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    UserModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
