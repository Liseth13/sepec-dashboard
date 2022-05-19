export class Pagination {
    
    public page : number = 1;
    public pageSize : number = 12;
    public collectionSize : number = 0;

    //filtros
    public searchTerm = '';
    public status : boolean = true;
}