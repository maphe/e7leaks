import { Get, Controller, Render } from '@nestjs/common';
import {join} from "path";
import * as path from "path";
import {Moment} from "moment";
const fs = require('fs');
const moment = require('moment');

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    const timeline = [];
    const filenames = (fs.readdirSync(join(__dirname, '..', 'db', 'patches')));
    filenames.forEach((filename) => {
      const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', 'patches', filename), 'utf8'));
      const date = moment(path.basename(filename, '.json')+' 19:00-0800');

      const enrichedData = enrichPatchData(data, date);
      if (enrichedData !== null) {
        timeline.push(enrichedData);
      }
    });

    const undatedData = JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', 'undated-features.json'), 'utf8'));
    if (undatedData.news.length > 0) {
      undatedData.date = 'Sometime in the future...';
      timeline.push(enrichPatchData(undatedData));
    }

    const alerts = JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', 'alerts.json'), 'utf8'));

    return { timeline: timeline, events: getEvents(), alerts: alerts };
  }
}

const enrichPatchData = (patch, date?: Moment) => {
  if (patch.type === 'server') {
    patch.patchType = 'Maintenance';
    patch.patchTypeBadgeClass = 'warning';
    patch.patchTypeTooltip = 'Requires maintenance downtime';
  } else if (patch.type === 'client') {
    patch.patchType = 'No Maintenance';
    patch.patchTypeBadgeClass = 'success';
    patch.patchTypeTooltip = 'No maintenance expected';
  }

  const enrichedNews = [];
  patch.news.forEach(news => {
    switch (news.veracity) {
      case "official":
        news.veracityBadgeClass = 'success';
        break;
      case "likely":
        news.veracityBadgeClass = 'primary';
        break;
      case "maybe":
        news.veracityBadgeClass = 'warning';
        break;
      case "unlikely":
        news.veracityBadgeClass = 'danger';
        break;
      case "rumor":
        news.veracityBadgeClass = 'info';
        break;
    }

    enrichedNews.push(news);
  });

  patch.news = enrichedNews;

  if (!date) {
    return patch;
  } else if (date > moment().subtract(1, 'day')) {
    patch.date = `${date.format('MMM D, YYYY')} (${date.from(moment())})`;
    return patch;
  } else {
    return null;
  }
};

const getEvents = () => {
  const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', 'events.json'), 'utf8'));
  const events = [];
  data.forEach(rawEvent => {
    const event: any = { name: rawEvent.name };
    const start = moment(rawEvent.start);
    const end = moment(rawEvent.end);

    if(start > moment()) {
      event.target = start.format();
      event.type = 'in';
      event.style = 'danger';
      events.push(event);
    } else if (end > moment()) {
      event.target = end.format();
      event.type = 'ends in';
      event.style = 'success';
      events.push(event);
    }
  });
  return events;
};