import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import * as moment from "moment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../shared/data.service";
import {ITask} from '../shared/model';
import {switchMap} from "rxjs";

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
   date: moment.Moment;
   form:FormGroup
   tasks:ITask[]=[]


  constructor(public dateService:DateService,
              private dataService:DataService) { }

  ngOnInit(): void {
     this.dateService.date$.pipe(
       switchMap(value=>this.dataService.load(value)))
       .subscribe((task:any)=> {
          this.tasks=task
       })

    this.dateService.date$.subscribe(res=> this.date = res)
    this.form=new FormGroup({
      title:new FormControl('',Validators.required)
    })
  }

  submit() {
    const {title} = this.form.value
    const task:ITask={
      title,
      date:this.dateService.date$.value.format('DD-MM-YYYY')
    }
    this.dataService.create(task).subscribe(task=>{
      this.tasks.push(task)
      this.form.reset()
    },(err)=>console.error(err),
      ()=>console.log('completed')
    )

  }

  removeTask(task: ITask) {
    this.dataService.remove(task).subscribe(()=>{
        this.tasks=this.tasks.filter(t=>t.id!==task.id)
      },
      err=>console.error(err)
    )
  }
}
