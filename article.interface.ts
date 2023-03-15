export interface ArticleInterface{
    title: string;
    img: string;
    description: string;
    tags: string[];
    date: string;
    html: string;
    metaTags: MetaTagInterface;
}

export interface MetaTagInterface{
    title: string;
    description: string;
    img: string;
}