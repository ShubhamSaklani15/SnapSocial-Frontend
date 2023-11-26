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

    //get all posts
    getAllPosts(pageNumber: number): Observable<any> {
        return this.http.get<any>(`http://localhost:3000/get-all-posts/${pageNumber}`);
    }

    //get all posts of a user
    getPosts(username: string, pageNumber: number): Observable<any> {
        return this.http.get<any>(`http://localhost:3000/get-posts/${username}/${pageNumber}`);
    }

    //update post
    updatePost(id: string | undefined, username: string) {
        return this.http.get(`http://localhost:3000/update-post/${id}/${username}`);
    }

    //get all posts of a user
    deletePost(id: string): Observable<any> {
        return this.http.delete<any>(`http://localhost:3000/delete-post/${id}`);
    }
}