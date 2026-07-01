import { Module } from '@nestjs/common';
import { AddToFavoriteController } from './add-to-favorite.controller';
import { AddToFavoriteService } from './add-to-favorite.service';

@Module({
  controllers: [AddToFavoriteController],
  providers: [AddToFavoriteService],
  exports: [AddToFavoriteService],
})
export class AddToFavoriteModule {}
