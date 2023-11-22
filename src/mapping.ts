import type { Book, User } from '@prisma/client'
import { TBookFullInfo, IBookInfo, TUserOutput } from './interfaces'

export const mapBook = (item: TBookFullInfo): IBookInfo => {
    const mapped: IBookInfo = {} as IBookInfo;

    mapped.id = item.id;
    mapped.language = item.language;
    mapped.name = item.name;
    mapped.price = item.price.toNumber();
    mapped.year = item.year;
    mapped.rating = 0;
    if (item.ratings?.length) {
        item.ratings.forEach(
            (ratingItem) => mapped.rating += ratingItem.rating);
        mapped.rating /= item.ratings.length;
    }
    mapped.authors = item.authors?.map(
        (authorItem => authorItem.name));
    mapped.categories = item.categories?.map(
        (categoryItem => categoryItem.name));
    mapped.currency = item.currency.acronym;
    return mapped;
} 

export const mapBooks = (data: TBookFullInfo[]): IBookInfo[] => {
    return data.map(mapBook);
}



export const mapUser = (data: User) => {
    const mapped: TUserOutput = {} as TUserOutput;

    mapped.id = data.id;
    mapped.description = data.description;
    mapped.login_or_email = data.login_or_email;
    mapped.name = data.name;
    mapped.register_date = data.register_date;

    return mapped;
}