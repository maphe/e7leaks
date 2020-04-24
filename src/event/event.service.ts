import {Injectable} from "@nestjs/common";
import {join} from "path";
import moment = require("moment");
const fs = require('fs');

@Injectable()
export class EventService {
  public getOngoingEvents() {
    const data = JSON.parse(fs.readFileSync(join(__dirname, '..', '..', 'db', 'events.json'), 'utf8'));
    const events = [];
    data.forEach(rawEvent => {
      const event: any = {name: rawEvent.name};
      const start = moment(rawEvent.start);
      const end = moment(rawEvent.end);

      if (start > moment() && start < moment().add(48, 'hours')) {
        event.target = start.format();
        event.type = 'in';
        event.style = 'danger';
        events.push(event);
      } else if (start < moment() && end > moment()) {
        event.target = end.format();
        event.type = 'ends in';
        event.style = 'success';
        events.push(event);
      }
    });
    return events;
  }

  public getCurrentAlerts() {
    return JSON.parse(fs.readFileSync(join(__dirname, '..', '..', 'db', 'alerts.json'), 'utf8'));
  }
}