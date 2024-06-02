import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";

type ConfigType = string | Date | Dayjs | null | undefined;

function dayjsToString () {
    return this.format('YYYY/MM/DD')
}

declare module 'dayjs' {
    interface Dayjs {
        isInPeriod(period: Period): boolean
    }
}

const isInPeriod = (o, c, d:typeof dayjs) => {
    c.prototype.toString = dayjsToString,
    c.prototype.isInPeriod = function ([start, end ]: Period) {
        const day = this as Dayjs
        if(!start && !end)
            return true
        if(!end)
            return (this as Dayjs).isAfter(start,'day') || day.isSame(start)
        if(!start)
            return (this as Dayjs).isBefore(end,'day') || day.isSame(end)
       return (this as Dayjs).isBetween(start, end,'day','[]')
    }
}

export type Period = [ConfigType | undefined, ConfigType | undefined]
export type Day = Dayjs


dayjs.extend(isBetween)
dayjs.extend(isInPeriod)
dayjs.extend(isSameOrAfter)
dayjs.extend(isToday)

export const asDay = (value: string|Date|Day) =>
    value ? dayjs(value).startOf('d') : undefined

const calcToday = () =>
    dayjs().startOf('d')

var _today = calcToday()
var _lastTodayCall = new Date().getTime()


export const today = () => {
    if(_lastTodayCall + 1000 * 60 > new Date().getTime())
    {
        _today = calcToday()
        _lastTodayCall = new Date().getTime()
    }
    return _today
}

export const asDayOrToday = (value: ConfigType) =>
    (!value) ? today() : asDay(value)

export const asDayOrUndefined = (value: ConfigType) =>
    value === undefined ? undefined : asDay(value)
