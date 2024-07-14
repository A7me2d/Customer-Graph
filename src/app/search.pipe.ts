import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(cards: any[], searchWord: string): any[] {
    if (!searchWord) return cards; // Return all cards if searchWord is empty or undefined

    searchWord = searchWord.toLowerCase(); // Convert searchWord to lowercase for case-insensitive comparison

    return cards.filter((card) => 
      card.name.toLowerCase().includes(searchWord) ||
      (card.id && card.id.toString().includes(searchWord)));
  }
}
