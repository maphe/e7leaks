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
    const filenames = (fs.readdirSync(join(__dirname, '..', 'db')));
    filenames.forEach((filename) => {
      const data = JSON.parse(fs.readFileSync(join(__dirname, '..', 'db', filename), 'utf8'));
      const date = moment(path.basename(filename, '.json')+' 19:00+0800');

      const enrichedData = enrichPatchData(data, date);
      if (enrichedData !== null) {
        timeline.push(enrichedData);
      }
    });

    return { timeline: timeline };
  }
}

const enrichPatchData = (patch, date: Moment) => {
  if (patch.type === 'server') {
    patch.patchType = 'Maintenance';
    patch.patchTypeBadgeClass = 'warning';
    patch.patchTypeTooltip = 'Requires maintenance downtime';
  } else {
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
    }

    enrichedNews.push(news);
  });

  patch.news = enrichedNews;

  if (date > moment().subtract(3, 'days')) {
    patch.date = `${date.format('MMM D, YYYY')} (${date.from(moment())})`;
    return patch;
  } else {
    return null;
  }
};