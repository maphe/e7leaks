import { Get, Controller, Render } from '@nestjs/common';
import {join} from "path";
import {EventService} from "./event/event.service";
import {TimelineService} from "./timeline/timeline.service";
import { TimerService } from "./timer/timer.service";

const fs = require('fs');
const moment = require('moment');

@Controller()
export class AppController {
  constructor(
    private readonly timelineService: TimelineService,
    private readonly eventService: EventService,
    private readonly timerService: TimerService) {}

  @Get()
  @Render('timeline')
  upcomingFeatures() {
    return {
      upcomingFeatures: true,
      timeline: this.timelineService.getFuturePatches(),
      events: this.eventService.getOngoingEvents(),
      alerts: this.eventService.getCurrentAlerts()
    };
  }

  @Get('/past-patches')
  @Render('timeline')
  pastPatches() {
    return {
      pastPatches: true,
      timeline: this.timelineService.getPastPatches(),
      events: this.eventService.getOngoingEvents(),
      alerts: this.eventService.getCurrentAlerts()
    };
  }

  @Get('/dev-notes')
  @Render('dev-notes')
  devNotes() {
    return {
      devNotes: true,
      notes: JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', 'dev-notes.json'), 'utf8')),
      events: this.eventService.getOngoingEvents(),
      alerts: this.eventService.getCurrentAlerts()
    };
  }

  @Get('/timers')
  @Render('timers')
  timers() {
    return {
      timers: true,
      allTimers: this.timerService.getAll(),
      events: this.eventService.getOngoingEvents(),
      alerts: this.eventService.getCurrentAlerts()
    };
  }
}