import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient,
              private router: Router) {

  }
  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`; //template expression = dynamically add values to string
    this.http.get<{message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    }))
    .subscribe(transformedData => {
      this.posts = transformedData.posts;
      this.postsUpdated.next({posts: [...this.posts],
        postCount: transformedData.maxPosts});
    });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // title is used has file name in backend

    this.http.post<{message: string, post: Post}>(
      BACKEND_URL,
      postData
      )
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === "object") {
      //new image
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id, title, content, imagePath: image, creator: null
      }
    }

    this.http.put<{message: string}>(BACKEND_URL + id, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
