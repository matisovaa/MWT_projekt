import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../entities/group';

@Pipe({
  name: 'groupsToString'
})
export class GroupsToStringPipe implements PipeTransform {

  // prvy argument je to co prichadza spred pipe, arg s ? je nepovinne vyplnit
  transform(groups: Group[], property?: string): string {
    if (property === 'permissions') {
      // pole prav bez duplicit
      return groups.map(group => group.permissions).flat()
        .reduce((acc, perm) => {         
          return acc.includes(perm) ? acc : [...acc, perm]
        }, []).join(', ');
    }
    return groups.map(group => group.name).join(', ');
  }

}
