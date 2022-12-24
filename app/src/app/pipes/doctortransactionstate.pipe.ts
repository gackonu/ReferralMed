import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doctortransactionstate'
})
export class DoctortransactionstatePipe implements PipeTransform {

  transform(value: string): string {
    if(value === 'unsettled'){
      return 'Deposit';
    }
    if(value === 'settled'){
      return 'Withdrawal';
    }
  }

}
