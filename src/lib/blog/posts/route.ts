import { NextResponse } from 'next/server'
import { getAllPosts, getPost } from '@/lib/blog/mdx'
import { createPost, updatePost, deletePost } from '@/lib/blog/admin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const post = await getPost(slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  }

  const posts = await getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const { slug, title, content, metadata } = await req.json()
    await createPost(slug, title, content, metadata)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { slug, content, metadata } = await req.json()
    await updatePost(slug, content, metadata)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    )
  }

  try {
    await deletePost(slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}