import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';

import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: 'First post', content: 'First post description'},
  //   {title: 'Second post', content: 'Second post description'},
  //   {title: 'Third post', content: 'Third post description'}
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage); //first page
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; //index starts with 0
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }
}
