import {Moment} from "moment";

type BootstrapClass = 'success'|'warning'|'danger'|'info'|'primary'|'secondary'

export type Patch = {
  type?: 'server'|'client',
  veracity: 'official'|'likely'|'maybe'|'unlikely'|'rumor',
  veracityBadgeClass: BootstrapClass,
  date?: Moment,
  formattedDate?: string,
}