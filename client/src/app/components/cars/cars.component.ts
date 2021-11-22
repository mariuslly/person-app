import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { CarsModalComponent } from './cars-modal/cars-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  cars: any = [];
  
  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService) { SET_HEIGHT('view', 20, 'height'); }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/cars').then(({ data }) => {
      this.cars = data;
      this._spinner.hide();
    }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
  }

  ngOnInit(): void {
   this.loadData();
  }

  addEdit = (id_car?: number): void => {
    console.log("addEdit:", id_car)
    const modalRef = this._modal.open(CarsModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_car = id_car;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }
  
  delete = (car: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având marca <b>${car.brand}</b>, modelul <b>${car.model}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/cars/${car.id}`).then(() => {
        toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => toastr.error('Eroare la ștergerea informației!'));
    });
  }
  
  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }
  
  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }
  
  onScrollDown(): void {
    this.limit += 20;
  }
  
  onScrollTop(): void {
    SCROLL_TOP('view-scroll-cars', 0);
    this.limit = 70;
  }

  calculateTaxRate = (cylindricalCapacity: number) => {
    let taxRate;
    if (cylindricalCapacity < 1500) {
      taxRate = 50;
    }
    if (cylindricalCapacity >= 1500 && cylindricalCapacity < 2000) {
      taxRate = 100;
    }
    if (cylindricalCapacity >= 2000) {
      taxRate = 200;
    }
    return taxRate;
  }

  }
