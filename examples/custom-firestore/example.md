---
title: Custom Firestore Example
group: Documents
category: Examples
---

# Custom Firestore Example

These examples use an adaptor that wraps Firestore to abstract away node/frontend differences and add some conveniences. Its implementation is similar to standard `firestore` or `firestore-admin` interfaces.

- [Full Example Code](https://github.com/ouijan/resource-ql/tree/main/examples/custom-firestore/example.ts)
- [Full Adaptor Implementation](https://github.com/ouijan/resource-ql/tree/main/examples/custom-firestore/adaptor.ts)
- [Stubbed Classes & Methods](https://github.com/ouijan/resource-ql/tree/main/examples/custom-firestore/firestore-stub.ts)

## Building Resources

We will begin by defining a `Workspace` class to encapsulate our queries and adding a `workspace` property using `getResource`. This will give us a way to resolve data from a `workspaceRef`, and build other queries from this starting point.

```typescript
export class Workspace {
  static workspace = getResource<IWorkspace>();
}

const workspaceRef = {} as DocumentReference<IWorkspace>;
const workspace = await Workspace.workspace(workspaceRef).get();
```

We can expand our class using the `workspace` property, to include a subcollection of users. Which allows us to resolve users in that collection.

```typescript
export class Workspace {
  // ...
  static users = this.workspace.col<IUser>('users');
}

const users = await Workspace.users(workspaceRef).get();
```

## Building Queries

We can then extend the users collection, by adding a query. We are able to implement the query in a callback, or use common queries like the example `undeletedQuery`. Like the users collection, we can resolve users or observe the query for changes.

```typescript
export class Workspace {
  // ...
  static activeUsers = this.users.query(undeletedQuery);
}

const activeUsers$ = Workspace.activeUsers(workspaceRef).get$();
```

For cases when we need to build a query around a set of inputs we can use `queryWith`. When calling this, we can pass in a second argument to tailor the query performed. This example returns an array, and we only care about the first element so we unwrap it upon assignment.

```typescript
export class Workspace {
  // ...
  static userWithEmail = this.activeUsers.queryWith((query, email: string) =>
    queryFirestore(query, where('email', '==', email), limit(1))
  );
}

const [userWithEmail] = await Workspace.userWithEmail(
  workspaceRef,
  'test@gmail.com'
).get();
```

To build a complex query with multiple arguments, use an object instead.

```typescript
export class Workspace {
  // ...
  static usersByRoleOverAge = this.activeUsers.queryWith(
    (query, request: { role: string; age: number }) =>
      queryFirestore(
        query,
        where('role', '==', request.role),
        where('age', '>', request.age)
      )
  );
}

const adminUsersOver30 = await Workspace.usersByRoleOverAge(workspaceRef, {
  role: 'admin',
  age: 30,
}).get();
```

The query method allows you build a query from a workspaceRef, this is quite flexible when used with Firestore's `collectionGroupQuery`. This example queries across all `posts` collections for any posts that are attributed to the given workspace. This makes it really easy to resolve more complex queries.

```typescript
export class Workspace {
  // ...
  static posts = this.workspace.query<IPost>((workspaceRef) =>
    collectionGroupQuery<IPost>(
      'posts',
      where('workspaceRef', '==', workspaceRef.path)
    )
  );
}

const posts = await Workspace.posts(workspaceRef).get();
```

## Using Constraints

We have seen how to resolve queries starting from a Workspace, in these examples we show more ways to build queries starting from a User.

We will start by defining a `Usee` class to encapsulate our queries, and adding a `posts` collection.

```typescript
export class User {
  static user = getResource<IUser>();
  static posts = this.user.col('posts');
}
```

Similar to `query` we can use `constraints` to build queries.

```typescript
export class User {
  // ...
  static publicPosts = this.posts.constraints(where('public', '==', true));
}

const userRef = {} as DocumentReference<IUser>;
const publicPosts = await User.publicPosts(userRef).get();
```

Similar to `query` we can use `constraints` to build queries that take an additional argument.

```typescript
export class User {
  static recentPosts = this.posts.constraintsWith((timestamp: string) => [
    where('createdAt', '>=', timestamp),
  ]);
}

const recentPosts = await User.recentPosts(
  userRef,
  '2023-01-01T00:00:00Z'
).get();
```

## Document Relationships

Each post belongs to a user, we can get the parent user by extending the `post` resource.

```typescript
export class Post {
  static post = getResource<IPost>();
  static user = this.post.parent<IUser>();
  static workspace = this.user.parent<IWorkspace>();
}

const userRef = {} as DocumentReference<IPost>;
const postUser = await Post.user(postRef).get();
```
