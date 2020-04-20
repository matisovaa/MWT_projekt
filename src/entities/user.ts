import { Group } from './group';

export class User {
    constructor(
        public name: string, // povinne
        public email: string,
        public id?: number, // nepovine
        public lastLogin?: Date, // Date je objekt preto je velkym
        public password: string = '', // difault, treba typy parametrov uvadzat v tomto poradi
        public active: boolean = true,
        public groups: Group[] = []
    ) { }
}