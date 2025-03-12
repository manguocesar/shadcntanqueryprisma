'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePost, usePosts } from '@/hooks/use-posts';

export async function generateStaticParams() {
    const { data: posts } = usePosts();
    const ids = posts ? posts.map((post: { id: number }) => post.id) : [];
    return ids.map((id: number) => ({
        slug: id,
    }));
}


const PostPage = () => {


    const { postId } = useParams();
    const { data: post, isLoading, isError } = usePost(Number(postId))

    useEffect(() => {
        if (postId) {
            console.log(`Post ID: ${postId}`);
        }
    }, [postId]);

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-2xl'>Post Page</h1>
            {postId && <p className='text-2xl'>Post ID: {postId}</p>}
            {post && (
                <div>
                    <h2><strong>Title:</strong> {post.title}</h2>
                    <p><strong>Content:</strong>
                        {post.body}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PostPage;