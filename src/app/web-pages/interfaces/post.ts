export interface Post {
    id        : string,
    page_id   : string,  //  Id page
    title     : string,
    slug      : string,
    body      : string,
    author    : string, //Id Author
    is_active : boolean
}
