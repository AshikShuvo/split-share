import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes the module globally available
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
