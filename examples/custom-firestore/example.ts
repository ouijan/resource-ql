import { IPost, IUser, IWorkspace } from '../data';
import { getResource } from './adaptor';
import {
  collectionGroupQuery,
  DocumentReference,
  limit,
  queryFirestore,
  undeletedQuery,
  where,
} from './firestore-stub';

export class Workspace {
  static workspace = getResource<IWorkspace>();
  static users = this.workspace.col<IUser>('users');
  static activeUsers = this.users.query(undeletedQuery);

  static userWithEmail = this.activeUsers.queryWith((query, email: string) =>
    queryFirestore(query, where('email', '==', email), limit(1))
  );

  static usersByRoleOverAge = this.activeUsers.queryWith(
    (query, request: { role: string; age: number }) =>
      queryFirestore(
        query,
        where('role', '==', request.role),
        where('age', '>', request.age)
      )
  );

  static posts = this.workspace.query<IPost>((workspaceRef) =>
    collectionGroupQuery<IPost>(
      'posts',
      where('workspaceRef', '==', workspaceRef.path)
    )
  );
}

export async function workspaceExample(): Promise<void> {
  const workspaceRef = {} as DocumentReference<IWorkspace>;

  const workspace = await Workspace.workspace(workspaceRef).get();

  const users = await Workspace.users(workspaceRef).get();

  const activeUsers$ = Workspace.activeUsers(workspaceRef).get$();

  const [userWithEmail] = await Workspace.userWithEmail(
    workspaceRef,
    'test@gmail.com'
  ).get();

  const adminUsersOver30 = await Workspace.usersByRoleOverAge(workspaceRef, {
    role: 'admin',
    age: 30,
  }).get();

  const posts = await Workspace.posts(workspaceRef).get();

  console.log({
    workspace,
    users,
    activeUsers$,
    userWithEmail,
    adminUsersOver30,
    posts,
  });
}

export class User {
  static user = getResource<IUser>();
  static workspace = this.user.parent<IWorkspace>();
  static posts = this.user.col('posts');
  static publicPosts = this.posts.constraints(where('public', '==', true));
  static recentPosts = this.posts.constraintsWith((timestamp: string) => [
    where('createdAt', '>=', timestamp),
  ]);
}

export async function userExample(): Promise<void> {
  const userRef = {} as DocumentReference<IUser>;

  const user = await User.user(userRef).get();

  const posts = await User.posts(userRef).get();

  const publicPosts$ = User.publicPosts(userRef).get$();

  const recentPosts = await User.recentPosts(
    userRef,
    '2023-01-01T00:00:00Z'
  ).get();

  console.log({
    user,
    posts,
    publicPosts$,
    recentPosts,
  });
}

export class Post {
  static post = getResource<IPost>();
  static user = this.post.parent<IUser>();
  static workspace = this.user.parent<IWorkspace>();
}

export async function postExample(): Promise<void> {
  const postRef = {} as DocumentReference<IPost>;

  const post = await Post.post(postRef).get();

  const user = await Post.user(postRef).get();

  const workspace = await Post.workspace(postRef).get();

  console.log({
    post,
    user,
    workspace,
  });
}
