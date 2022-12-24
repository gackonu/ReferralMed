import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'referralstatusicon'
})
export class ReferralstatusiconPipe implements PipeTransform {

  transform(value: string): string {
    if(value === 'pending'){
      return 'hourglass-outline';
    }
    if(value === 'completed'){
      return 'checkmark-outline';
    }
    if(value === 'ongoing'){
      return 'hourglass-outline';
    }
    if(value === 'cancelled'){
      return 'close-outline';
    }
    if(value === 'unsettled'){
      return 'arrow-up';
    }
    if(value === 'settled'){
      return 'arrow-down';
    }
    else {
      return 'close-outline';
    }
  }

}
