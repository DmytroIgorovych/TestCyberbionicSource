import { Pipe, PipeTransform, Input, Output } from '@angular/core';
import { Author } from './app.component'
import EventEmitter from 'events';

@Pipe({
  name: 'searchPipe',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(authors:Author[], value:string) {
    let filtered = authors.filter(author => {
      let filteredBooks = author.books.filter(book => {
        let bookname = book.bookName.toLowerCase()
        return bookname.includes(value)
      })
        return author.books.includes(filteredBooks[0])
    })
    
   if (value==='') {
      return authors
   } else {
      if (filtered.length==0) {
        filtered = authors
        return []
      } else {
        return filtered
      }
   }
  }
}
