import {Component, OnInit} from '@angular/core';
import {DateService} from "../shared/date.service";
import * as moment from "moment";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  date!:moment.Moment
  constructor(private dateService:DateService) { }

  ngOnInit(): void {
    this.dateService.date$.subscribe(res=> this.date = res)
  }

  go(number: number) {
    this.dateService.changeMonth(number)
  }
}
