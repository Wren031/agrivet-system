import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { GeocodingService } from './geocoding.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, GeocodingService],
  exports: [AgentsService],
})
export class AgentsModule {}
