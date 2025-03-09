// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { usePosts, useCreatePost } from '@/hooks/use-posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { createContext, useContext, ReactNode } from 'react'
import Link from 'next/link'


interface Toast {
    id: number
    title: string
    description: string
    variant?: 'default' | 'destructive'
}

interface ToastContextType {
    toasts: Toast[]
    toast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)




export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = (newToast: Omit<Toast, 'id'>) => {
        const id = Date.now()
        setToasts([...toasts, { ...newToast, id }])
    }

    const removeToast = (id: number) => {
        setToasts(toasts.filter((toast) => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, toast, removeToast }}>
            {children}
            <div className="fixed bottom-0 right-0 p-4 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded shadow-lg ${toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'
                            }`}
                    >
                        <strong>{toast.title}</strong>
                        <p>{toast.description}</p>
                        <button onClick={() => removeToast(toast.id)}>Dismiss</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default function PostsDashboard() {
    const { data: posts, isLoading, isError } = usePosts()
    const createPostMutation = useCreatePost()
    const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 })
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createPostMutation.mutate(newPost, {
            onSuccess: () => {
                setOpen(false)
                setNewPost({ title: '', body: '', userId: 1 })
                toast({
                    title: "Success!",
                    description: "Your post has been created.",
                })
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to create post. Please try again.",
                    variant: "destructive",
                })
            }
        })
    }

    if (isError) {
        return <div>Error loading posts</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Posts Dashboard</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Create New Post</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Post</DialogTitle>
                            <DialogDescription>
                                Add a new post to your collection
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="title">Title</label>
                                    <Input
                                        id="title"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="body">Content</label>
                                    <Input
                                        id="body"
                                        value={newPost.body}
                                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={createPostMutation.isPending}>
                                    {createPostMutation.isPending ? 'Saving...' : 'Save Post'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <Table>
                    <TableCaption>A list of your posts.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Content</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts?.map((post) => (
                            <TableRow key={post.id}>

                                <TableCell>
                                    <Link href={`/dashboard/${post.id}`}>
                                        {post.id}
                                    </Link>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link href={`/dashboard/${post.id}`}>
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="truncate max-w-xs">
                                    <Link href={`/dashboard/${post.id}`}>
                                        {post.body}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Toaster />
        </div>
    )
}