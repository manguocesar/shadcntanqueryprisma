// app/dashboard/posts/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePost, useUpdatePost, type Post } from '@/hooks/use-posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { MainNav } from '@/components/nav'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/app/dashboard/page'
import { Toaster } from '@/components/ui/sonner'

export default function EditPostPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id)
    const router = useRouter()
    const { data: post, isLoading, isError } = usePost(id)
    const updatePostMutation = useUpdatePost()
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Post>>({
        title: '',
        body: '',
        published: false
    })

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                body: post.body,
                published: post.published
            })
        }
    }, [post])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        updatePostMutation.mutate(
            { id, ...formData },
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
                <div className="border-b pb-4 mb-6">
                    <MainNav />
                </div>
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
                <div className="border-b pb-4 mb-6">
                    <MainNav />
                </div>
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
            <div className="border-b pb-4 mb-6">
                <MainNav />
            </div>

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