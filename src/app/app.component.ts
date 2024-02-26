import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAlert, NgbAlertModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, Form, FormGroup, NgForm, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { group, log } from 'console';
import { SearchPipe } from './search.pipe';

export interface Author {
  lastName: string,
  firstName: string,
  surname: string,
  birthDate: string,
  books: Book[]
}

export interface Book {
  bookName: string,
  numberOfPages: number,
  bookGenre: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet, 
    NgbModule, 
    CommonModule,
    NgbPaginationModule, 
    NgbAlertModule, 
    NgbAlert,
    FormsModule,
    SearchPipe,
    ReactiveFormsModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ SearchPipe ]
})

export class AppComponent implements Author {
  title = 'Library';
  
  localStorage!: Storage;
  lastName!: string;
  firstName!: string;
  surname!: string;
  birthDate!: string;
  book!:Book;
  books!: Book[]; 
  bookName!: string;
  numberOfPages!: number;
  bookGenre!: string;
  genre!:string;
  searchInput:string ='';
  author!:Author;
  currentAuthor!:Author
  showInfo:boolean = false;
  showAuthor:boolean = false;
  targetId!:string;
  index!:number;
  authors:Author[] = [];
  genres:string[]=[];
  authorGenreToggle:boolean=false;
  showSearchResult:boolean=true;
  searchErrorToggle!:boolean;

  constructor(private modalService: NgbModal, public search: SearchPipe) {
  }
  
  authorForm: FormGroup = new FormGroup({
    lastName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    surname: new FormControl(''),
    birthDate: new FormControl('', Validators.required),
  })

  bookForm: FormGroup = new FormGroup({
    bookName: new FormControl('', Validators.required),
    numberOfPages: new FormControl('', [Validators.required, Validators.pattern(/^[ 0-9]+$/)]),
    bookGenre: new FormControl('', Validators.required),
  })

  genreForm: FormGroup = new FormGroup({
    genre: new FormControl('', Validators.required)
  })
  
  addGenre(){
    this.genres = JSON.parse(localStorage.getItem('genres')!);

    this.targetId = 'addGenre'
  }

  editGenre(index:number){
    this.genres = JSON.parse(localStorage.getItem('genres')!);
    this.targetId = 'editGenre'
    this.genre = this.genres[index]
    this.genreForm.setValue({genre: this.genre})
    this.index = index;
  }

  saveGenre() {
    if (this.targetId == 'addGenre') {
      this.bookGenre = this.genreForm.value.genre
      this.genres.push(this.bookGenre)
    } else if (this.targetId = 'editGenre') {
      this.bookGenre = this.genreForm.value.genre
      this.genres.splice(this.index, 1, this.bookGenre);
    }
    localStorage.setItem('genres', JSON.stringify(this.genres))
    this.genreForm.reset()
  }

  deleteGenre(index:number){
    this.genres = JSON.parse(localStorage.getItem('genres')!);
    this.genres.splice(index, 1)   
    localStorage.setItem('genres', JSON.stringify(this.genres)) 
  }

  addBook(){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.bookForm.reset()
    this.currentAuthor = this.authors[this.index]
    this.books = this.currentAuthor["books"]
    this.targetId = 'addBook'
  }

  deleteBook(bookIndex:number){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.currentAuthor = this.authors[this.index];
    this.books = this.currentAuthor["books"];
    this.books.splice(bookIndex, 1);
    localStorage.setItem('authors', JSON.stringify(this.authors))
  }

  editBook(bookIndex:number){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.bookForm.reset()
    this.currentAuthor = this.authors[this.index];
    this.book = this.currentAuthor["books"][bookIndex];
    this.bookForm.setValue(this.book)
    this.index = bookIndex
    this.targetId = 'editBook';
  }
  
  saveBook(){
    this.book = {
      bookName: this.bookForm.value.bookName,
      numberOfPages: this.bookForm.value.numberOfPages,
      bookGenre: this.bookForm.value.bookGenre
    }
    if (this.targetId == 'addBook') {
      this.books.push(this.book)
    } else if (this.targetId == 'editBook') {
      this.currentAuthor["books"].splice(this.index, 1, this.book);
    }
    localStorage.setItem('authors', JSON.stringify(this.authors))
    
  }

  sortByGenre(event:Event){
    this.genres = JSON.parse(localStorage.getItem('genres')!);
    this.genres.sort((a,b) => {
      return a > b ? 1 : -1
    })
  }

  sortBy(criteria:any){
    if (criteria == "lastName") {
      this.authors.sort((a, b) => {
          if (a.lastName === b.lastName) {
            if (a.firstName === b.firstName) {
              return a.surname > b.surname ? 1 : -1
            }
            return a.firstName > b.firstName ? 1 : -1
          } else {
            return a.lastName > b.lastName ? 1 : -1
          }
        })
      } else if (criteria == "books") {
        this.authors.sort((a, b) => {
          return a.books > b.books ? -1 : 1
        })
      }
  }
  
  formData(){
    this.author =  {
        lastName: this.authorForm.value.lastName,
        firstName: this.authorForm.value.firstName,
        surname: this.authorForm.value.surname,
        birthDate: this.authorForm.value.birthDate,
        books: []
      }    
    return this.author
  }
  
  showtInfo(author:Author, index:number) {
      this.currentAuthor=author;
      this.index = index;
      this.showInfo=true
  };

  saveAuthor() {
    if (this.targetId == 'addAuthor') {
      this.author = this.formData()
      this.authors.push(this.author);
    } else if (this.targetId == 'editAuthor') {
      this.author = this.formData()
      this.authors.splice(this.index, 1, this.formData());
    }
    localStorage.setItem('authors', JSON.stringify(this.authors))
    this.authorForm.reset()
  }
  
  addAuthor(){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.targetId = 'addAuthor';
  };
  
  editAuthor(item:Author, index:number){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.targetId = 'editAuthor';
    this.index = index;
    this.authorForm.setValue(item)    
  }
  
  deleteAuthor(index:number){
    this.authors = JSON.parse(localStorage.getItem('authors')!);
    this.authors.splice(index, 1);
    localStorage.setItem('authors', JSON.stringify(this.authors));
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }
  
  ngOnInit():void {
    // Заповнює таблицю при завантажені сторінки
    if (JSON.parse(localStorage.getItem('authors')!) == undefined) {
      localStorage.setItem('authors', JSON.stringify([]));
    } else {this.authors = JSON.parse(localStorage.getItem('authors')!)}
    if (JSON.parse(localStorage.getItem('genres')!) == undefined) {
      localStorage.setItem('genres', JSON.stringify([]));
    } else {this.genres = JSON.parse(localStorage.getItem('genres')!)}
  }

  ngDoCheck(){
    // Показує помилку, якщо результат пошуку нічого не знайшов
    if (this.search.transform(this.authors, this.searchInput).length > 0) {
      this.searchErrorToggle = false
    } else {this.searchErrorToggle = true}
  }
}
