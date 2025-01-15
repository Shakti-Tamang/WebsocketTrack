import { Module } from '@nestjs/common';
import { LocationGateway } from './controller/loaction-gateway';


@Module({
    providers: [LocationGateway],
})
export class LocationtrackModule {}
