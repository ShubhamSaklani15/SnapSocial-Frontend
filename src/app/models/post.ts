export interface Post {
    _id?: string;
    message: string;
    author: Author;
    timestamp?: string;
    likes?: Like;
    comments?: Comment[];
}

export interface Author {
    name?: string;
    username: string;
}

export interface Like {
    count: number;
    users_liked?: string[];
}

export interface Comment {
    message?: string;
    author?: string;
    replies?: Reply[];
}

export interface Reply {
    message?: string;
    author?: string;
    timestamp?: string;
}