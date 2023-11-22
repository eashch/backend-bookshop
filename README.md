npm run dev

.env

APP_PORT=
DATABASE_URL=
JWTSECRET=
SALT=


BOOKS

1) GET /api/v1/books   /api/v1/books?perPage=1&page=5&category=Art

    QUERY PARAMS:

    perPage — количество выводимых книг в запросе. 1 - 30
    page — постраничный вывод книг.  >= 1
    category — категория выводимых книг (может принимать массив сразу с несколькими категориями).

2) POST /api/v1/books

    Authors, Categories, Users for ratings must exist!
    BODY PARAMS EXAMPLE:
    {
        "name": "Another book 2",
        "authors": [
            "NewAuthor"
        ],
        "language": "Russian",
        "categories": [
            "NewCat"
        ],
        "ratings": [
            {
                "rating": 4,
                "userId": 2
            }
        ],
        "price": 333,
        "currency": "EUR",
        "year": 1999
    }

3) PUT /api/v1/books/:bookId


4) DELETE /api/v1/books/:bookId

    


CATEGORIES

1) GET /api/v1/categories   /api/v1/categories?perPage=1&page=1

    QUERY PARAMS:

    perPage — количество выводимых книг в запросе. 1 - 30
    page — постраничный вывод книг.  >= 1

2) POST /api/v1/categories

    BODY PARAMS EXAMPLE:
    {
        "name": "CatName"
    }

3) PUT /api/v1/categories/:categoryId

    BODY PARAMS EXAMPLE:
    {
        "name": "NewName"
    }

4) DELETE /api/v1/categories/:categoryId




USER

1) POST /api/v1/user/login

    BODY PARAMS EXAMPLE:
    {
        "loginOrEmail": "mail@mail.com",
        "password": "password1"
    }

2) POST /api/v1/user/register

    BODY PARAMS EXAMPLE:
    {
        "login"?: "username",
        "email"?: "mail@mail.com"
        "password": "password1"
    }

3) GET /api/v1/user/books

4) PUT /api/v1/user/:userId  LOGGED IN ONLY

    BODY PARAMS EXAMPLE:
    {
        "name"?: "newName",
        "description"?: "newDescription"
    }


5) DELETE /api/v1/user/:userId   LOGGED IN ONLY




RATING

1) POST /api/v1/rating   LOGGED IN ONLY

    BODY PARAMS EXAMPLE:
    {
        "rating": 2,
        "bookId": 6,
        "userId": 3
    }