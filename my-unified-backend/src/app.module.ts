import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgentsModule } from './modules/agents/agents.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { UploadModule } from './modules/upload/upload.module';

import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AgentsModule,
    CategoriesModule,
    SubcategoriesModule,
    InventoryModule,
    UploadModule,
  ],
})
export class AppModule {}
