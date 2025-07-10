import lib from 'dayjs';
import 'dayjs/locale/en';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

lib.locale('en-US');
lib.extend(relativeTimePlugin);

export const dayjs = lib;
