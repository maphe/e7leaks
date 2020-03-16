import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimelineModule } from './timeline/timeline.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [TimelineModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
