import { Injectable } from '@nestjs/common';
import {Moment} from "moment";
import moment = require("moment");
import {join} from "path";
import * as path from "path";
import {Patch} from "./patch.type";
const fs = require('fs');

@Injectable()
export class TimelineService {

  public getFuturePatches() {
    const data = this.getPatches().filter((patch: Patch) => {
      return patch.date > moment().subtract(1, 'day');
    });

    const undatedData = JSON.parse(fs.readFileSync(join(__dirname, '..', '..', 'db', 'undated-features.json'), 'utf8'));
    if (undatedData.news.length > 0) {
      undatedData.formattedDate = 'Sometime in the future...';
      data.push(this.enrichPatchData(undatedData));
    }

    return data;
  }

  public getPastPatches() {
    return this.getPatches().filter((patch: Patch) => {
      return patch.date < moment();
    }).reverse();
  }

  private getPatches(): Patch[] {
    const timeline = [];
    const filenames = (fs.readdirSync(join(__dirname, '..', '..', 'db', 'patches')));
    filenames.forEach((filename) => {
      const data = JSON.parse(fs.readFileSync(join(__dirname, '..', '..', 'db', 'patches', filename), 'utf8'));
      const date = moment(path.basename(filename, '.json')+' 19:00-0800');

      const enrichedData = this.enrichPatchData(data, date);
      if (enrichedData !== null) {
        timeline.push(enrichedData);
      }
    });

    return timeline;
  }

  private enrichPatchData(patch, date?: Moment): Patch {
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
    if (date) {
      patch.date = date;
      patch.formattedDate = `${date.format('MMM D, YYYY')} (${date.from(moment())})`;
    }

    return patch;
  };
}