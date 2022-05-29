import { Page } from "src/app/web-pages/interfaces/Page"
export interface Site {
    id : string,
    name : string,
    slogan : string
    icon : string,
    page : Array<Page>
}