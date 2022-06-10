import {Component, OnInit} from '@angular/core';
import {DateService} from "../shared/date.service";
import * as moment from "moment";
import {DataService} from "../shared/data.service";
import {filter, map} from "rxjs";

interface Day {
  value: moment.Moment
  active: boolean
  disabled: boolean
  selected: boolean
  countEvent:any

}

interface Week {
  days: Day[]
}


@Component({
  selector: 'app-calendar2',
  templateUrl: './calendar2.component.html',
  styleUrls: ['./calendar2.component.scss']
})
export class Calendar2Component implements OnInit {

  date!: moment.Moment
  calendar: Week[];
  countInDay = 0

  constructor(private dateService: DateService,
              private dataService:DataService) {
  }

  ngOnInit() {
    this.dateService.date$.subscribe(this.generate.bind(this))
    this.dateService.date$.subscribe(res => this.date = res)

  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week')
    const endDay = now.clone().endOf('month').endOf('week')

    const date = startDay.clone().subtract(1, 'day')

    const calendar = []

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {

            const value = date.add(1, 'day').clone()
            const active = moment().isSame(value, 'date')
            const disabled = !now.isSame(value, 'month')
            const selected = now.isSame(value, 'date')
            let countEvent=this.dataService.load(value).pipe(
              map((el)=>el.length),
              filter(el=>el!==0),
            ).subscribe(res=>res)

            return {
              value, active, disabled, selected,countEvent
            }
          })
      })
    }

    this.calendar = calendar
  }

  select(day: moment.Moment) {
    this.dateService.changeDate(day)
  }

  go(number: number) {
    this.dateService.changeMonth(number)
  }

}
