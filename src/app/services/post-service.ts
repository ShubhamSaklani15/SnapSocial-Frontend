import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient) { }

    //add new post
    addNewPost(post: Post): Observable<any> {
        return this.http.post<any>("http://localhost:3000/add-new-post/", post);
    }

    //get all posts of a user
    getPosts(username: string, pageNumber: number): Observable<any> {
        return this.http.get<any>(`http://localhost:3000/get-posts/${username}/${pageNumber}`);
    }
}