import { Module } from '@nestjs/common';
import {TimelineService} from "./timeline.service";

@Module({
  providers: [TimelineService],
  exports: [TimelineService]
})
export class TimelineModule {}
