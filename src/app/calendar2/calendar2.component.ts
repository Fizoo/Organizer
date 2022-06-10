import {Component, OnInit} from '@angular/core';
import {DateService} from "../shared/date.service";
import * as moment from "moment";

interface Day {
  value: moment.Moment
  active: boolean
  disabled: boolean
  selected: boolean
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

  constructor(private dateService: DateService) {
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

            return {
              value, active, disabled, selected
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
