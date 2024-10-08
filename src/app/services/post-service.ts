import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { constants } from '../utility/constants';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    apiUrl = constants.apiUrl;
    
    constructor(private http: HttpClient) { }

    //add new post
    addNewPost(post: Post): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-new-post/`, post);
    }

    //get all posts
    getAllPosts(pageNumber: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/get-all-posts/${pageNumber}`);
    }

    //get all posts of a user
    getPosts(username: string, pageNumber: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/get-posts/${username}/${pageNumber}`);
    }

    //update post
    updatePost(id: string | undefined, username: string) {
        return this.http.get(`${this.apiUrl}/update-post/${id}/${username}`);
    }

    //get all posts of a user
    deletePost(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete-post/${id}`);
    }
}