// app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { usePosts, useCreatePost, useDeletePost } from '@/hooks/use-posts'
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
import { Textarea } from '@/components/ui/textarea'
import { DialogClose } from '@radix-ui/react-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { CreatePostInput } from '@/lib/schemas'

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

export default function PostsDashboard() {
    const { data: posts, isLoading, isError } = usePosts()
    const createPostMutation = useCreatePost()
    const deletePostMutation = useDeletePost()
    const [newPost, setNewPost] = useState<CreatePostInput>({
        title: '',
        body: '',
        field: '',
        authorEmail: 'user@example.com',
        authorName: 'Current User'
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createPostMutation.mutate(newPost, {
            onSuccess: () => {
                setIsDialogOpen(false)
                setNewPost({ title: '', body: '', field: '', authorEmail: 'user@example.com', authorName: 'Current User' })
                toast({
                    title: "Success!",
                    description: "Your post has been created.",
                })
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: error.message || "Failed to create post. Please try again.",
                    variant: "destructive",
                })
            }
        })
    }

    const handleDelete = (id: number) => {
        deletePostMutation.mutate(id, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: "Post has been deleted successfully.",
                })
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete post.",
                    variant: "destructive",
                })
            }
        })
    }

    if (isError) {
        return <div className="container mx-auto py-8">Error loading posts</div>
    }

    return (
        <div className="container mx-auto py-8">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Posts Dashboard</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Create New Post</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
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
                                    <Textarea
                                        id="body"
                                        value={newPost.body}
                                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="field">Field</label>
                                    <Textarea
                                        id="field"
                                        value={newPost.field}
                                        onChange={(e) => setNewPost({ ...newPost, field: e.target.value })}
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="authorEmail">Field</label>
                                    <Textarea
                                        id="authorEmail"
                                        value={newPost.authorEmail}
                                        onChange={(e) => setNewPost({ ...newPost, authorEmail: e.target.value })}
                                        rows={5}
                                        required
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
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
            ) : posts?.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No posts found</h3>
                    <p className="text-muted-foreground mt-2">Create your first post to get started.</p>
                </div>
            ) : (
                <Table>
                    <TableCaption>A list of your posts.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts?.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>{post.createdAt ? format(new Date(post.createdAt), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                <TableCell>{post.author?.name || 'Anonymous'}</TableCell>
                                <TableCell>{post.published ? 'Published' : 'Draft'}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/posts/${post.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>View</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(post.id)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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