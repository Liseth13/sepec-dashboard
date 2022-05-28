export interface Menu {
    site      : string,
    title     : string,
    level     : 1 | 2 | 3 | number,
    weight    : number,
    // order : number,
    father    : string,
    page      : string,
    is_active : boolean,
}
