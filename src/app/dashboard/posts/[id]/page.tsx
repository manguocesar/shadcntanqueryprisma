// app/dashboard/posts/[id]/page.tsx
'use client'

import { use } from 'react'
import { usePost } from '@/hooks/use-posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const postId = parseInt(id)
    const { data: post, isLoading, isError } = usePost(postId)

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-40 w-full" />
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
                            <p className="text-muted-foreground mt-2">The post you're looking for doesn't exist or has been removed.</p>
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
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>

                <Button asChild>
                    <Link href={`/dashboard/posts/${postId}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mt-2 flex flex-col sm:flex-row sm:gap-4">
                        <span>By {post.author?.name || 'Anonymous'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Created on {format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{post.body}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}