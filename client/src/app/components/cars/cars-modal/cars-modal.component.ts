import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cars-modal',
  templateUrl: './cars-modal.component.html',
  styleUrls: ['./cars-modal.component.scss']
})

export class CarsModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  modal = {} as any;
//  numberRegEx = /\-?\d*\.?\d{1,2}/;
  carsForm!: FormGroup

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private f: FormBuilder) {
  }

  submit(){
    if (this.carsForm.status == "VALID") 
      this.save();
  }

  ngOnInit(): void {
    this.carsForm = this.f.group({
        brand: this.f.control('', Validators.required),
        model: this.f.control('', Validators.required),
        manufacturing_year: this.f.control('', Validators.required),
        cylindrical_capacity: this.f.control('', Validators.required),
      }, {
        updateOn: 'submit'
      });

    if (this.id_car) {
      this._spinner.show();
      axios.get(`/api/cars/${this.id_car}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(): void {
    this._spinner.show();
    if (!this.id_car || this.id_car == undefined) {
      axios.post('/api/cars', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/cars', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }
}
