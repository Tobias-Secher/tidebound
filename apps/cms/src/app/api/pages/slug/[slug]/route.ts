import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.docs[0])
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
