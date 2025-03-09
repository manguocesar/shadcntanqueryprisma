// app/api/posts/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const post = await prisma.post.create({
      data: {
        title: json.title,
        body: json.body,
        author: {
          connectOrCreate: {
            where: {
              email: json.authorEmail || "default@example.com",
            },
            create: {
              email: json.authorEmail || "default@example.com",
              name: json.authorName || "Anonymous",
            },
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
