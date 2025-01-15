import { Module } from '@nestjs/common';
import { LocationtrackModule } from './modules/locationtrack/locationtrack.module';

@Module({
  imports: [
    LocationtrackModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
