import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-persons-modal',
  templateUrl: './persons-modal.component.html',
  styleUrls: ['./persons-modal.component.scss']
})

export class PersonsModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  modal = {} as any;
//  numberRegEx = /\-?\d*\.?\d{1,2}/;
  personsForm!: FormGroup

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private f: FormBuilder) {
  }

  submit(){
    if (this.personsForm.status == "VALID") 
      this.save();
  }

  ngOnInit(): void {
    this.personsForm = this.f.group({
        name: this.f.control('', Validators.required),
        surname: this.f.control('', Validators.required),
        cnp: this.f.control('', Validators.required),
        cars: this.f.control('', Validators.required),
      }, {
        updateOn: 'submit'
      });

    if (this.id_person) {
      this._spinner.show();
      axios.get(`/api/persons/${this.id_person}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
      this.loadCars();
  }

  loadCars(): void {
    this._spinner.show();
        axios.get('/api/cars').then(({ data }) => {
        this.modal.cars = data;
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
  }

  save(): void {
    this._spinner.show();
    if (!this.id_person || this.id_person == undefined) {
      axios.post('/api/persons', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/persons', this.modal).then(() => {
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
