import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {ITask} from "./model";
import * as moment from "moment";

interface CreateResponse {
  name:string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
 static url='https://organizer-ca6e7-default-rtdb.firebaseio.com/tasks'
  constructor(private http:HttpClient) { }

  create(task:ITask):Observable<ITask> {
    return this.http.post<CreateResponse>(`${DataService.url}/${task.date}.json`,task)
      .pipe(
        map(res=>{
          return {...task,id:res.name,}
        }),
        tap(el=>console.log('this.el',el))
      )
  }

  load(date:moment.Moment){
   return this.http.get<Task[]>(`${DataService.url}/${date.format('DD-MM-YYYY')}.json`)
     .pipe(map(tasks=>{
       if(!tasks) {
         return []
       }
      return Object.keys(tasks).map((key:any)=>({...tasks[key],id:key}))
       })
     )
  }

  remove(task:ITask):Observable<void>{
   return  this.http.delete<void>(`${DataService.url}/${task.date}/${task.id}.json`)
  }
}
