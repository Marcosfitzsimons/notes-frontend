export type Note = {
    id: number
    title: string
    content: string
    tags: string[]
    isArchived: boolean
    userId: number
    createdAt: string
};

export type UserData = {
    id: number
    username: string
};

export type UserCredentials = {
    username: string
    password: string
  };