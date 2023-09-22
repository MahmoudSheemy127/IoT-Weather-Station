import { Component, OnInit } from '@angular/core';
import { ParameterService } from '../services/parameter.service';
import { Parameter } from '../models/parameter';
import { pressureGaugeOptions, pressureLineGridOption } from '../models/pressure_charts_options';
import { temperatureGaugeOptions, temperatureLineGridOption } from '../models/temperature_charts_options';
import { humidityGaugeOptions, humidityLineGridOption } from '../models/humidity_charts_options';
import {Subscription, timer} from 'rxjs';  
import * as echarts from 'echarts';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  parameter: Parameter = new Parameter();
  parameters?: Parameter[];
  tempParameters?: Parameter[];
  pressureParameters?: Parameter[];
  humidityParameters?: Parameter[];
  // parameters?: Parameter[];
  
  type?: string;
  lastParamter: Parameter = new Parameter();
  
  //echarts elements
  tempLineGrid?: echarts.EChartsType;
  tempGauge?: echarts.EChartsType;
  humidityLineGrid?: echarts.EChartsType;
  humidityGauge?: echarts.EChartsType;
  pressureLineGrid?: echarts.EChartsType;
  pressureGauge?: echarts.EChartsType;
  
  tempval?:number;
  
  // paramterService: ParameterService = new ParameterService();
  // private paramterService: ParameterService
  constructor(private paramterService: ParameterService, public authService: AuthenticationService) {
    this.parameters = [];
    this.lastParamter = {};
    //set the options of Echarts
    

    
  }
  
  ngOnInit(): void {
    //we want to connect to firebase
    var tempLineGridDom = document.getElementById('tempLineGrid');
    var tempGaugeDom = document.getElementById('tempGauge');
    var humidityLineGridDom = document.getElementById('humidityLineGrid');
    var humidityGaugeDom = document.getElementById('humidityGauge');
    var pressureLineGridDom = document.getElementById('pressureLineGrid');
    var pressureGaugeDom = document.getElementById('pressureGauge');
    
    this.tempLineGrid = echarts.init(tempLineGridDom);
    this.tempGauge = echarts.init(tempGaugeDom);
    this.humidityLineGrid = echarts.init(humidityLineGridDom);
    this.humidityGauge = echarts.init(humidityGaugeDom);
    this.pressureLineGrid = echarts.init(pressureLineGridDom);
    this.pressureGauge = echarts.init(pressureGaugeDom);
    
    this.tempLineGrid.setOption(temperatureLineGridOption);
    this.tempGauge.setOption(temperatureGaugeOptions);   
    this.humidityLineGrid.setOption(humidityLineGridOption);
    this.humidityGauge.setOption(humidityGaugeOptions);   
    this.pressureLineGrid.setOption(pressureLineGridOption);
    this.pressureGauge.setOption(pressureGaugeOptions);   
    this.tempGauge.setOption({
      series:[
        {
          data: [
            {
              value: 10
            }
        ]
      }
      ]
    });

    //fetch dashboard value every 5 seconds
    setInterval(() => {
      this.retrieveTemp();
      this.retrieveHumidity();
      this.retrievePressure();
    },2000);



    }

  save()
  {
    //save form
    this.paramterService.create(this.parameter).then(() => {
      console.log("Paramter saved");
    })
  }

  //retrieve temp records
  retrieveTemp(): void
  {
    let paramValues:any = [];
    //fetch temp
    console.log("Hello");
    this.paramterService.getTemp().valueChanges().forEach(val => {
      val.forEach((val) => {
          this.tempParameters?.push({value: val.value, date: val.date})
          paramValues.push(val.value)
        })
      this.updateLineGrid(paramValues,this.tempLineGrid);
      this.updateGauge(paramValues.at(-1),this.tempGauge);

    })

  }

  //retrieve pressure records
  retrievePressure(): void
  {
    let paramValues:any = [];
    //fetch pressure
    this.paramterService.getPressure().valueChanges().forEach(val => {
      val.forEach((val) => {
          this.pressureParameters?.push({value: val.value, date: val.date})
          paramValues.push(val.value)
      
        })
      // paramValues = this.pressureParameters?.map((val) => val.value)
      this.updateLineGrid(paramValues,this.pressureLineGrid);
      this.updateGauge(paramValues.at(-1),this.pressureGauge);
    })
  }

//retrieve Humidity records
retrieveHumidity(): void
  {
    let paramValues:any = [];
    //fetch pressure
    this.paramterService.getHumidity().valueChanges().forEach(val => {
      val.forEach((val) => {
          this.humidityParameters?.push({value: val.value, date: val.date})
          paramValues.push(val.value)
        })
      // paramValues = this.humidityParameters?.map((val) => val.value)
      this.updateLineGrid(paramValues,this.humidityLineGrid);
      this.updateGauge(paramValues.at(-1),this.humidityGauge);
    })
  }


  //update line grid
  updateLineGrid(paramters: Array<Number>,lineGrid?: echarts.EChartsType)
  {
    lineGrid?.setOption({
        series:[
          {
            data: paramters
          }
        ]   
    })
  }

  updateGauge(paramter: number,gaugeParamter?: echarts.EChartsType)
  {
    gaugeParamter?.setOption({
      series:[
        {
          data:[
            {
              value: paramter
            }
          ]
        }
      ]
    })
  }

  retrieve():void
  {
    this.parameters= [];
    this.paramterService.getAll().valueChanges().forEach(val => {
      val.forEach((val) =>{

        this.parameters?.push({value: val.value, date: val.date})
        
      })      
      this.tempLineGrid?.setOption({
        series:[
          {
            data: this.parameters?.map(param => param.value)
          }
        ]
      })
      this.lastParamter.value = this.parameters?.at(-1)?.value;
      this.lastParamter.date = this.parameters?.at(-1)?.date;
      //update temp gauge
      this.tempGauge?.setOption({
        series: [
          {
            data:[
              {
                value: this.parameters?.at(-1)?.value
              }
            ] 
          }
        ]
      })
      })

  }

  changeTemp()
  {
    this.tempGauge?.setOption({
      series: [
        {
          data:[
            {
              value: this.tempval
            }
          ] 
        }
      ]
    })
  }

  delete()
  {
//    console.log(this.paramterService.check().valueChanges());
    // this.paramterService.delete();
    // this.paramterService.check().get().then((data) => data. console.log(data));
    //console.log();
    
  }


}
