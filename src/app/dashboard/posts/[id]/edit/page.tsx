// app/dashboard/posts/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePost, useUpdatePost } from '@/hooks/use-posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/app/dashboard/page'
import { Toaster } from '@/components/ui/sonner'
import { Post } from '@prisma/client'

export default function EditPostPage() {
    const params = useParams()
    const id = params.id ? parseInt(params.id as string) : NaN
    const router = useRouter()
    const { data: post, isLoading, isError } = usePost(id)
    const updatePostMutation = useUpdatePost()
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Post>>({
        title: '',
        body: '',
        field: '',
        authorEmail: '',
        published: false
    })

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                body: post.body,
                field: post.field || '',
                authorEmail: post.authorEmail || '',
                published: post.published
            })
        }
    }, [post])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updatePostMutation.mutate(
            { id, data: formData },
            {
                onSuccess: () => {
                    toast({
                        title: "Success!",
                        description: "Post updated successfully.",
                    })
                    router.push(`/dashboard/posts/${id}`)
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to update post.",
                        variant: "destructive",
                    })
                }
            }
        )
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
        )
    }

    if (isError || !post) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <h3 className="text-lg font-medium">Post not found</h3>
                            <p className="text-muted-foreground mt-2">The post you're trying to edit doesn't exist or has been removed.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/dashboard">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">

            <div className="mb-6">
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/posts/${id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Post
                    </Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body">Content</Label>
                            <Textarea
                                id="body"
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                rows={10}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="field">Field</Label>
                            <Textarea
                                id="field"
                                value={formData.field ?? ''} // Use nullish coalescing to show empty string if null
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                rows={10}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="authorEmail">Author Email</Label>
                            <Textarea
                                id="authorEmail"
                                value={formData.authorEmail ?? ''} // Use nullish coalescing to show empty string if null
                                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                                rows={10}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="published"
                                checked={formData.published}
                                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                            />
                            <Label htmlFor="published">Published</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={updatePostMutation.isPending}>
                            {updatePostMutation.isPending ? (
                                <span>Saving...</span>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <Toaster />
        </div>
    )
}