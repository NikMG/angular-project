import { Brewerie } from './../../models/BrewerieModel';
import { Component, OnInit } from '@angular/core';
import { useHttp } from 'src/app/hooks/http.hooks';

@Component({
  selector: 'app-list-of-beers',
  templateUrl: './list-of-beers.component.html',
  styleUrls: ['./list-of-beers.component.css']
})
export class ListOfBeersComponent implements OnInit {

  dataStorageName:string = 'beerData';

  getBeers = useHttp().getBeers;

  inputsCities: Brewerie[] = [];

  inputsStates: Brewerie[] = [];

  page:number;

  showModal:boolean;

  perPage:number;

  dataCities:any;

  dataStates:any;

  cities = [
    {
      name: 'New York',
      value: 'new_york'
    },
    {
      name: 'Los Angeles',
      value: 'los_angeles'
    },
    {
      name: 'Chicago',
      value: 'chicago'
    },
    {
      name: 'Houston',
      value: 'houston'
    },
    {
      name: 'Phoenix',
      value: 'phoenix'
    },
    {
      name: 'Philadelphia',
      value: 'philadelphia'
    },
    {
      name: 'San Diego',
      value: 'san_diego'
    },
  ];

  states = [
    {
      name: 'New York',
      value: 'new_york'
    },
    {
      name: 'California',
      value: 'california'
    },
    {
      name: 'Illinois',
      value: 'illinois'
    },
    {
      name: 'Texas',
      value: 'texas'
    },
    {
      name: 'Arizona',
      value: 'arizona'
    },
    {
      name: 'Pennsylvania',
      value: 'pennsylvania'
    },
    {
      name: 'Florida',
      value: 'florida'
    },
  ];

  constructor() {
    this.page = 1;
    this.showModal = false;
    this.perPage = 15;

    this.dataCities = JSON.parse(sessionStorage.getItem(this.dataStorageName + 'Cities') || '{}');
    this.dataStates = JSON.parse(sessionStorage.getItem(this.dataStorageName + 'States') || '{}');

    if (this.dataCities && this.dataCities.breweries) {
      this.inputsCities = this.dataCities.breweries;
    }

    if (this.dataStates && this.dataStates.breweries) {
      this.inputsStates = this.dataStates.breweries;
    }
  }

  ngOnInit(): void {
  }

  getBrewiere = async (params:string = '') => {
    const data = await this.getBeers(`https://api.openbrewerydb.org/breweries?per_page=${this.perPage}&page=${this.page}`, params);
    return data;
  }

  handleSelectChange = async (item:any) => {
    if (item.target.value === '') {
      switch(item.target.name) {
        case 'city':
          this.inputsCities = [];
          break;
        case 'state':
          this.inputsStates = [];
          break;
        default:
          break;
      }
      return;
    }
    const data = await this.getBrewiere(`&by_${item.target.name}=${item.target.value}`);
    if (item.target.name === 'city') {
      sessionStorage.setItem(this.dataStorageName + 'Cities', JSON.stringify({
        breweries: data,
        city: item.target.value
      }));
      this.inputsCities = data;
      this.dataCities = JSON.parse(sessionStorage.getItem(this.dataStorageName + 'Cities') || '{}');
    } else {
      sessionStorage.setItem(this.dataStorageName + 'States', JSON.stringify({
        breweries: data,
        state: item.target.value
      }));
      this.inputsStates = data;
      this.dataStates = JSON.parse(sessionStorage.getItem(this.dataStorageName + 'States') || '{}');
    }


  }

  handleModalState = () => {
    this.showModal = !this.showModal;
  }

  checkSelected = (option:string) => {
    if (this.dataCities && this.dataCities.city && this.dataCities.city == option) {
      return true;
    }

    if (this.dataStates && this.dataStates.state && this.dataStates.state == option) {
      return true;
    }

    return false;
  }

  handleOptionsChange = (event:any) => {
    this.perPage = event.target.value;
    this.updateLists();
  }

  updateLists = async () => {
    if (this.dataCities && this.dataCities.city) {
      const data = await this.getBrewiere(`&by_city=${this.dataCities.city}`);
      this.inputsCities = data;
      console.log('city', data)
    }

    if (this.dataStates && this.dataStates.state) {
      const data = await this.getBrewiere(`&by_state=${this.dataStates.state}`);
      this.inputsStates = data;
    }
  }

}
