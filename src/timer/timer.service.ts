import {Injectable} from "@nestjs/common";
import { Moment } from "moment";
import moment = require("moment");

type Timer = {
  target: string,
  style: 'danger'|'success'|'info',
  countdown: boolean,
  from?: string,
}

@Injectable()
export class TimerService {
  public getAll(): { [id: string]: Timer } {
    return {
      daily: TimerService.getDailyReset(),
      weekly: TimerService.getWeeklyReset(),
      monthly: TimerService.getMonthlyReset(),
      ...TimerService.getAltarInfo(),
      gw: TimerService.getGuildWar(),
      ...TimerService.getWorldBoss(),
      hall: TimerService.getHallOfTrials()
    };
  }

  private static getDailyReset(): Timer {
    const reset =  moment().utcOffset(0).hour(10).minute(0).second(0);
    const followingReset =  moment(reset).add(1, 'd');
    const nextReset = reset.isAfter(moment()) ? reset : followingReset;
    return {
      style: 'info',
      target: nextReset.format(),
      countdown: true,
    }
  }

  private static getWeeklyReset(): Timer {
    const reset =  moment().utcOffset(0).weekday(1).hour(10).minute(0).second(0);
    const followingReset =  moment(reset).add(1, 'w');
    const nextReset = reset.isAfter(moment()) ? reset : followingReset;
    return {
      style: 'info',
      target: nextReset.format(),
      countdown: moment().diff(nextReset, 'hours') > -48,
      from: nextReset.from(moment())
    }
  }

  private static getMonthlyReset(): Timer {
    const reset =  moment().utcOffset(0).date(1).hour(10).minute(0).second(0);
    const followingReset =  moment(reset).add(1, 'M');
    const nextReset = reset.isAfter(moment()) ? reset : followingReset;
    return {
      style: 'info',
      target: nextReset.format(),
      countdown: moment().diff(nextReset, 'hours') >= -48,
      from: nextReset.from(moment())
    }
  }

  private static getAltarInfo(): { [id: string]: Timer } {
    const fire =  moment().utcOffset(0).weekday(1).hour(10).minute(0).second(0);
    const ice =  moment().utcOffset(0).weekday(2).hour(10).minute(0).second(0);
    const earth =  moment().utcOffset(0).weekday(3).hour(10).minute(0).second(0);
    const light =  moment().utcOffset(0).weekday(4).hour(10).minute(0).second(0);
    const dark =  moment().utcOffset(0).weekday(5).hour(10).minute(0).second(0);
    const all =  moment().utcOffset(0).weekday(6).hour(10).minute(0).second(0);

    const fireOn = moment().isBetween(fire, ice);
    const iceOn = moment().isBetween(ice, earth);
    const earthOn = moment().isBetween(earth, light);
    const lightOn = moment().isBetween(light, dark);
    const darkOn = moment().isBetween(dark, all);
    const allOn = moment().isBefore(fire) || moment().isAfter(all);

    let allTarget = moment().isBefore(fire) ? moment(fire) : moment(fire).add(1, 'w');

    return {
      fire: {
        style: fireOn || allOn ? 'success' : 'danger',
        target: fireOn ? ice.format() : allOn ? allTarget.format() : all.format(),
        countdown: true,
      },
      ice: {
        style: iceOn || allOn ? 'success' : 'danger',
        target: iceOn ? earth.format() : allOn ? allTarget.format() : moment().isBefore(ice) ? ice.format() : all.format(),
        countdown: true,
      },
      earth: {
        style: earthOn || allOn ? 'success' : 'danger',
        target: earthOn ? earth.format() : allOn ? allTarget.format() : moment().isBefore(earth) ? earth.format() : all.format(),
        countdown: true,
      },
      light: {
        style: lightOn || allOn ? 'success' : 'danger',
        target: lightOn ? light.format() : allOn ? allTarget.format() : moment().isBefore(light) ? light.format() : all.format(),
        countdown: true,
      },
      dark: {
        style: darkOn || allOn ? 'success' : 'danger',
        target: darkOn ? dark.format() : allOn ? allTarget.format() : moment().isBefore(dark) ? dark.format() : all.format(),
        countdown: true,
      },
    }
  }

  private static getGuildWar(): Timer {
    const monStart =  moment().utcOffset(0).weekday(1).hour(10).minute(0).second(0);
    const monEnd =  moment().utcOffset(0).weekday(2).hour(10).minute(0).second(0);
    const wedStart =  moment().utcOffset(0).weekday(3).hour(10).minute(0).second(0);
    const wedEnd =  moment().utcOffset(0).weekday(4).hour(10).minute(0).second(0);
    const friStart =  moment().utcOffset(0).weekday(5).hour(10).minute(0).second(0);
    const friEnd =  moment().utcOffset(0).weekday(6).hour(10).minute(0).second(0);

    if (moment().isBefore(monStart)) {
      return { style: 'danger', target: monStart.format(), countdown: true };
    } else if (moment().isBefore(monEnd)) {
      return { style: 'success', target: monEnd.format(), countdown: true };
    } else if (moment().isBefore(wedStart)) {
      return { style: 'danger', target: wedStart.format(), countdown: true };
    } else if (moment().isBefore(wedEnd)) {
      return { style: 'success', target: wedEnd.format(), countdown: true };
    } else if (moment().isBefore(friStart)) {
      return { style: 'danger', target: friStart.format(), countdown: true };
    } else if (moment().isBefore(friEnd)) {
      return { style: 'success', target: friEnd.format(), countdown: true };
    } else {
      return { style: 'danger', target: moment(monStart).add(1, 'w').format(), countdown: true };
    }
  }

  private static getWorldBoss(): { [id: string]: Timer } {
    const b2Reset2 =  moment().utcOffset(0).weekday(0).hour(10).minute(0).second(0);
    const b2End =  moment().utcOffset(0).weekday(1).hour(10).minute(0).second(0);
    const b1Open =  moment().utcOffset(0).weekday(1).hour(17).minute(0).second(0);
    const b1Reset1 =  moment().utcOffset(0).weekday(2).hour(10).minute(0).second(0);
    const b1Reset2 =  moment().utcOffset(0).weekday(3).hour(10).minute(0).second(0);
    const b1End =  moment().utcOffset(0).weekday(4).hour(10).minute(0).second(0);
    const b2Open =  moment().utcOffset(0).weekday(5).hour(17).minute(0).second(0);
    const b2Reset1 =  moment().utcOffset(0).weekday(6).hour(10).minute(0).second(0);

    let wbPeriod: Timer, wbToken: Timer;
    if (moment().isBefore(b2Reset2)) {
      wbPeriod = { countdown: true, style: 'success', target: b2End.format() };
      wbToken = { countdown: true, style: 'success', target: b2Reset2.format() };
    } else if (moment().isBefore(b2End)) {
      wbPeriod = wbToken = { countdown: true, style: 'success', target: b2End.format() };
    } else if (moment().isBefore(b1Open)) {
      wbPeriod = wbToken = { countdown: true, style: 'danger', target: b1Open.format() };
    } else if (moment().isBefore(b1Reset1)) {
      wbPeriod = { countdown: true, style: 'success', target: b1End.format() };
      wbToken = { countdown: true, style: 'success', target: b1Reset1.format() };
    } else if (moment().isBefore(b1Reset2)) {
      wbPeriod = { countdown: true, style: 'success', target: b1End.format() };
      wbToken = { countdown: true, style: 'success', target: b1Reset2.format() };
    } else if (moment().isBefore(b1End)) {
      wbPeriod = wbToken = { countdown: true, style: 'success', target: b1End.format() };
    } else if (moment().isBefore(b2Open)) {
      wbPeriod = wbToken = { countdown: true, style: 'danger', target: b2Open.format() };
    } else if (moment().isBefore(b2Reset1)) {
      wbPeriod = { countdown: true, style: 'success', target: moment(b2End).add(1, 'w').format() };
      wbToken = { countdown: true, style: 'success', target: b2Reset1.format() };
    } else {
      wbPeriod = { countdown: true, style: 'success', target: moment(b2End).add(1, 'w').format() };
      wbToken = { countdown: true, style: 'success', target: moment(b2Reset2).add(1, 'w').format() };
    }

    return { wbPeriod, wbToken };
  }

  private static getHallOfTrials(): Timer {
    const basePracticeWeek = moment().utcOffset(0).year(2020).month(3).date(1).weekday(1).hour(10).minute(0).second(0);
    const weekly = this.getWeeklyReset();
    weekly.style = moment().diff(basePracticeWeek, 'week')%2 === 0 ? 'danger' : 'success';

    return weekly;
  }
}

/*
- Daily Reset
- Shop, Normal Raid = weekly
- GW, Automaton = monthly
- World Boss: On/Off
- Hall of Trials
- Altar

- Web Events
- Banners
 */