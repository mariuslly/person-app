import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersonsModalComponent } from './persons-modal/persons-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persons: any = [];

  constructor( private _modal: NgbModal, private _spinner: NgxSpinnerService,) { SET_HEIGHT('view', 20, 'height');}

  ngOnInit(): void {
     this.loadData();
  }

loadData = (): void => {
  this._spinner.show();
  axios.get('/api/persons').then(({ data }) => {
    this.persons = data;
    this._spinner.hide();
  }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
}

addEdit = (id_person?: number): void => {
  const modalRef = this._modal.open(PersonsModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
  modalRef.componentInstance.id_person = id_person;
  modalRef.closed.subscribe(() => {
    this.loadData();
  });
}

delete = (person: any): void => {
  const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
  modalRef.componentInstance.title = `Ștergere informație`;
  modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având numele <b>${person.name}</b>, prenumele <b>${person.surname}</b>?`;
  modalRef.closed.subscribe(() => {
    axios.delete(`/api/persons/${person.id}`).then(() => {
      toastr.success('Informația a fost ștearsă cu succes!');
      this.loadData();
    }).catch(() => toastr.error('Eroare la ștergerea informației!'));
  });
}

onResize(): void {
  SET_HEIGHT('view', 20, 'height');
}

showTopButton(): void {
  if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
    this.showBackTop = 'show';
  } else {
    this.showBackTop = '';
  }
}

onScrollDown(): void {
  this.limit += 20;
}

onScrollTop(): void {
  SCROLL_TOP('view-scroll-informations', 0);
  this.limit = 70;
}

calculateAge = (cnp: string) => {
  // Din 2000 CNP-urile sunt cu 5 pentru baieti si 6 pentru fete. Se schimba la 100 de ani pentru 
      // diferentierea celor nascuti in alt secol.
  // 1800 - 1900 = 3 pentru masculin, 4 pentru feminin
  // 1900 - 2000 = 1 pentru masculin, 2 pentru feminin
  // 2000 - 2100 = 5 pentru masculin, 6 pentru feminin
  let age, birthday, cnpYear = cnp.substring(1, 3), cnpMonth = cnp.substring(3, 5), 
  cnpDay = cnp.substring(5, 7), yearPrefix = "19";

  if (cnp.substring(0, 1) === "5" || cnp.substring(0, 1) === "6") { 
    // corespunzator celor nascuti in perioada 2000 - 2100 = 5 pentru masculin, 6 pentru feminin
    yearPrefix = "20";
  }
  birthday = new Date(yearPrefix + cnpYear + "-" + cnpMonth + "-" + cnpDay);
//  age = new Number((new Date().getTime() - birthday.getTime()) / 31536000000).toFixed();
  age = Math.floor((new Date().getTime() - birthday.getTime()) / 31536000000);
  return age;
}
}
