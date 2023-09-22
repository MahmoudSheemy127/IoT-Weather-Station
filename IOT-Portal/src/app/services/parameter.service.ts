import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/compat/database';
import { Parameter } from '../models/parameter'; 

@Injectable({
  providedIn: 'root'
})

export class ParameterService {


  
  parameterRefs: AngularFireList<Parameter>;


  constructor(private db: AngularFireDatabase) {
    this.parameterRefs = db.list('temperature', ref => ref.limitToLast(10));

   }

   getAll(): AngularFireList<Parameter> {
    this.parameterRefs = this.db.list('humidity',ref => ref.limitToLast(5));
    return this.parameterRefs
   }


  getTemp(): AngularFireList<Parameter> {
    this.parameterRefs = this.db.list('temperature',ref => ref.limitToLast(5));    
    // this.parameterRefs = this.db.list('temperature',ref => ref.);    
   
    return this.parameterRefs
  }

  getHumidity(): AngularFireList<Parameter> {
    this.parameterRefs = this.db.list('humidity',ref => ref.limitToLast(5));    
    return this.parameterRefs
  }

  getPressure(): AngularFireList<Parameter> {
    this.parameterRefs = this.db.list('pressure',ref => ref.limitToLast(5));    
    return this.parameterRefs
  }

   create(parameter: Parameter)
   {
    if(parameter.type == "temperature")
    {
      this.parameterRefs = this.db.list('temperature');
    }    
    if(parameter.type == "pressure")
    {
      this.parameterRefs = this.db.list('pressure');
    }    
    if(parameter.type == "humidity")
    {
      this.parameterRefs = this.db.list('humidity');
    }    

    return this.parameterRefs.push(parameter);
   }

   delete()
   {
    
    this.parameterRefs = this.db.list('pressure',ref => ref.limitToLast(10));
    this.parameterRefs.remove();

    // return this.parameterRefs.remove(key);
   }

}
