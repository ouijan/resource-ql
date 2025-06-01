export interface IWorkspace {
  name: string;
}

export interface IUser {
  name: string;
  lastLoginAt: string;
  deleted: boolean;
}

export interface IPost {
  workspaceRef: string;
  content: string;
}
