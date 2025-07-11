/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as SignupIndexImport } from './routes/signup/index'
import { Route as PostsIndexImport } from './routes/posts/index'
import { Route as NotesIndexImport } from './routes/notes/index'
import { Route as NewNoteIndexImport } from './routes/new-note/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as ForgotPasswordIndexImport } from './routes/forgot-password/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as ConnectedPlatformsIndexImport } from './routes/connected-platforms/index'
import { Route as CallbackIndexImport } from './routes/callback/index'
import { Route as PostsIdScheduleIndexImport } from './routes/posts/$id/schedule/index'
import { Route as PostsIdEditIndexImport } from './routes/posts/$id/edit/index'
import { Route as NotesIdPostsIndexImport } from './routes/notes/$id/posts/index'
import { Route as NotesIdEditIndexImport } from './routes/notes/$id/edit/index'
import { Route as NotesIdCreatePostsIndexImport } from './routes/notes/$id/create-posts/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SignupIndexRoute = SignupIndexImport.update({
  id: '/signup/',
  path: '/signup/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIndexRoute = PostsIndexImport.update({
  id: '/posts/',
  path: '/posts/',
  getParentRoute: () => rootRoute,
} as any)

const NotesIndexRoute = NotesIndexImport.update({
  id: '/notes/',
  path: '/notes/',
  getParentRoute: () => rootRoute,
} as any)

const NewNoteIndexRoute = NewNoteIndexImport.update({
  id: '/new-note/',
  path: '/new-note/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const ForgotPasswordIndexRoute = ForgotPasswordIndexImport.update({
  id: '/forgot-password/',
  path: '/forgot-password/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => rootRoute,
} as any)

const ConnectedPlatformsIndexRoute = ConnectedPlatformsIndexImport.update({
  id: '/connected-platforms/',
  path: '/connected-platforms/',
  getParentRoute: () => rootRoute,
} as any)

const CallbackIndexRoute = CallbackIndexImport.update({
  id: '/callback/',
  path: '/callback/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIdScheduleIndexRoute = PostsIdScheduleIndexImport.update({
  id: '/posts/$id/schedule/',
  path: '/posts/$id/schedule/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIdEditIndexRoute = PostsIdEditIndexImport.update({
  id: '/posts/$id/edit/',
  path: '/posts/$id/edit/',
  getParentRoute: () => rootRoute,
} as any)

const NotesIdPostsIndexRoute = NotesIdPostsIndexImport.update({
  id: '/notes/$id/posts/',
  path: '/notes/$id/posts/',
  getParentRoute: () => rootRoute,
} as any)

const NotesIdEditIndexRoute = NotesIdEditIndexImport.update({
  id: '/notes/$id/edit/',
  path: '/notes/$id/edit/',
  getParentRoute: () => rootRoute,
} as any)

const NotesIdCreatePostsIndexRoute = NotesIdCreatePostsIndexImport.update({
  id: '/notes/$id/create-posts/',
  path: '/notes/$id/create-posts/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/callback/': {
      id: '/callback/'
      path: '/callback'
      fullPath: '/callback'
      preLoaderRoute: typeof CallbackIndexImport
      parentRoute: typeof rootRoute
    }
    '/connected-platforms/': {
      id: '/connected-platforms/'
      path: '/connected-platforms'
      fullPath: '/connected-platforms'
      preLoaderRoute: typeof ConnectedPlatformsIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof rootRoute
    }
    '/forgot-password/': {
      id: '/forgot-password/'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof ForgotPasswordIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/new-note/': {
      id: '/new-note/'
      path: '/new-note'
      fullPath: '/new-note'
      preLoaderRoute: typeof NewNoteIndexImport
      parentRoute: typeof rootRoute
    }
    '/notes/': {
      id: '/notes/'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof NotesIndexImport
      parentRoute: typeof rootRoute
    }
    '/posts/': {
      id: '/posts/'
      path: '/posts'
      fullPath: '/posts'
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof rootRoute
    }
    '/signup/': {
      id: '/signup/'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupIndexImport
      parentRoute: typeof rootRoute
    }
    '/notes/$id/create-posts/': {
      id: '/notes/$id/create-posts/'
      path: '/notes/$id/create-posts'
      fullPath: '/notes/$id/create-posts'
      preLoaderRoute: typeof NotesIdCreatePostsIndexImport
      parentRoute: typeof rootRoute
    }
    '/notes/$id/edit/': {
      id: '/notes/$id/edit/'
      path: '/notes/$id/edit'
      fullPath: '/notes/$id/edit'
      preLoaderRoute: typeof NotesIdEditIndexImport
      parentRoute: typeof rootRoute
    }
    '/notes/$id/posts/': {
      id: '/notes/$id/posts/'
      path: '/notes/$id/posts'
      fullPath: '/notes/$id/posts'
      preLoaderRoute: typeof NotesIdPostsIndexImport
      parentRoute: typeof rootRoute
    }
    '/posts/$id/edit/': {
      id: '/posts/$id/edit/'
      path: '/posts/$id/edit'
      fullPath: '/posts/$id/edit'
      preLoaderRoute: typeof PostsIdEditIndexImport
      parentRoute: typeof rootRoute
    }
    '/posts/$id/schedule/': {
      id: '/posts/$id/schedule/'
      path: '/posts/$id/schedule'
      fullPath: '/posts/$id/schedule'
      preLoaderRoute: typeof PostsIdScheduleIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/callback': typeof CallbackIndexRoute
  '/connected-platforms': typeof ConnectedPlatformsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
  '/forgot-password': typeof ForgotPasswordIndexRoute
  '/login': typeof LoginIndexRoute
  '/new-note': typeof NewNoteIndexRoute
  '/notes': typeof NotesIndexRoute
  '/posts': typeof PostsIndexRoute
  '/signup': typeof SignupIndexRoute
  '/notes/$id/create-posts': typeof NotesIdCreatePostsIndexRoute
  '/notes/$id/edit': typeof NotesIdEditIndexRoute
  '/notes/$id/posts': typeof NotesIdPostsIndexRoute
  '/posts/$id/edit': typeof PostsIdEditIndexRoute
  '/posts/$id/schedule': typeof PostsIdScheduleIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/callback': typeof CallbackIndexRoute
  '/connected-platforms': typeof ConnectedPlatformsIndexRoute
  '/dashboard': typeof DashboardIndexRoute
  '/forgot-password': typeof ForgotPasswordIndexRoute
  '/login': typeof LoginIndexRoute
  '/new-note': typeof NewNoteIndexRoute
  '/notes': typeof NotesIndexRoute
  '/posts': typeof PostsIndexRoute
  '/signup': typeof SignupIndexRoute
  '/notes/$id/create-posts': typeof NotesIdCreatePostsIndexRoute
  '/notes/$id/edit': typeof NotesIdEditIndexRoute
  '/notes/$id/posts': typeof NotesIdPostsIndexRoute
  '/posts/$id/edit': typeof PostsIdEditIndexRoute
  '/posts/$id/schedule': typeof PostsIdScheduleIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/callback/': typeof CallbackIndexRoute
  '/connected-platforms/': typeof ConnectedPlatformsIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/forgot-password/': typeof ForgotPasswordIndexRoute
  '/login/': typeof LoginIndexRoute
  '/new-note/': typeof NewNoteIndexRoute
  '/notes/': typeof NotesIndexRoute
  '/posts/': typeof PostsIndexRoute
  '/signup/': typeof SignupIndexRoute
  '/notes/$id/create-posts/': typeof NotesIdCreatePostsIndexRoute
  '/notes/$id/edit/': typeof NotesIdEditIndexRoute
  '/notes/$id/posts/': typeof NotesIdPostsIndexRoute
  '/posts/$id/edit/': typeof PostsIdEditIndexRoute
  '/posts/$id/schedule/': typeof PostsIdScheduleIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/callback'
    | '/connected-platforms'
    | '/dashboard'
    | '/forgot-password'
    | '/login'
    | '/new-note'
    | '/notes'
    | '/posts'
    | '/signup'
    | '/notes/$id/create-posts'
    | '/notes/$id/edit'
    | '/notes/$id/posts'
    | '/posts/$id/edit'
    | '/posts/$id/schedule'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/callback'
    | '/connected-platforms'
    | '/dashboard'
    | '/forgot-password'
    | '/login'
    | '/new-note'
    | '/notes'
    | '/posts'
    | '/signup'
    | '/notes/$id/create-posts'
    | '/notes/$id/edit'
    | '/notes/$id/posts'
    | '/posts/$id/edit'
    | '/posts/$id/schedule'
  id:
    | '__root__'
    | '/'
    | '/callback/'
    | '/connected-platforms/'
    | '/dashboard/'
    | '/forgot-password/'
    | '/login/'
    | '/new-note/'
    | '/notes/'
    | '/posts/'
    | '/signup/'
    | '/notes/$id/create-posts/'
    | '/notes/$id/edit/'
    | '/notes/$id/posts/'
    | '/posts/$id/edit/'
    | '/posts/$id/schedule/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CallbackIndexRoute: typeof CallbackIndexRoute
  ConnectedPlatformsIndexRoute: typeof ConnectedPlatformsIndexRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  ForgotPasswordIndexRoute: typeof ForgotPasswordIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
  NewNoteIndexRoute: typeof NewNoteIndexRoute
  NotesIndexRoute: typeof NotesIndexRoute
  PostsIndexRoute: typeof PostsIndexRoute
  SignupIndexRoute: typeof SignupIndexRoute
  NotesIdCreatePostsIndexRoute: typeof NotesIdCreatePostsIndexRoute
  NotesIdEditIndexRoute: typeof NotesIdEditIndexRoute
  NotesIdPostsIndexRoute: typeof NotesIdPostsIndexRoute
  PostsIdEditIndexRoute: typeof PostsIdEditIndexRoute
  PostsIdScheduleIndexRoute: typeof PostsIdScheduleIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CallbackIndexRoute: CallbackIndexRoute,
  ConnectedPlatformsIndexRoute: ConnectedPlatformsIndexRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  ForgotPasswordIndexRoute: ForgotPasswordIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
  NewNoteIndexRoute: NewNoteIndexRoute,
  NotesIndexRoute: NotesIndexRoute,
  PostsIndexRoute: PostsIndexRoute,
  SignupIndexRoute: SignupIndexRoute,
  NotesIdCreatePostsIndexRoute: NotesIdCreatePostsIndexRoute,
  NotesIdEditIndexRoute: NotesIdEditIndexRoute,
  NotesIdPostsIndexRoute: NotesIdPostsIndexRoute,
  PostsIdEditIndexRoute: PostsIdEditIndexRoute,
  PostsIdScheduleIndexRoute: PostsIdScheduleIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/callback/",
        "/connected-platforms/",
        "/dashboard/",
        "/forgot-password/",
        "/login/",
        "/new-note/",
        "/notes/",
        "/posts/",
        "/signup/",
        "/notes/$id/create-posts/",
        "/notes/$id/edit/",
        "/notes/$id/posts/",
        "/posts/$id/edit/",
        "/posts/$id/schedule/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/callback/": {
      "filePath": "callback/index.tsx"
    },
    "/connected-platforms/": {
      "filePath": "connected-platforms/index.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx"
    },
    "/forgot-password/": {
      "filePath": "forgot-password/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/new-note/": {
      "filePath": "new-note/index.tsx"
    },
    "/notes/": {
      "filePath": "notes/index.tsx"
    },
    "/posts/": {
      "filePath": "posts/index.tsx"
    },
    "/signup/": {
      "filePath": "signup/index.tsx"
    },
    "/notes/$id/create-posts/": {
      "filePath": "notes/$id/create-posts/index.tsx"
    },
    "/notes/$id/edit/": {
      "filePath": "notes/$id/edit/index.tsx"
    },
    "/notes/$id/posts/": {
      "filePath": "notes/$id/posts/index.tsx"
    },
    "/posts/$id/edit/": {
      "filePath": "posts/$id/edit/index.tsx"
    },
    "/posts/$id/schedule/": {
      "filePath": "posts/$id/schedule/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
