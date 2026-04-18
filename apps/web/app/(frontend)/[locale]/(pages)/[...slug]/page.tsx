import { getPage } from '@repo/services';
// import type { Page } from "@repo/api-types";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function CatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  let page = await getPage({ slug });
  let error = false;

  // try {
  //   page = await getPage({ slug });
  // } catch (e) {
  //   error = true;
  // }

  console.log('**page: ', page);

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>

      <div className="space-y-8">
        {page.modules?.map((module: any, index: number) => {
          switch (module.blockType) {
            case 'hero':
              return (
                <div key={index} className="hero relative bg-gray-100 p-12 rounded-lg">
                  <h2 className="text-3xl font-bold mb-2">{module.heading}</h2>
                  {module.subheading && (
                    <p className="text-xl text-gray-600">{module.subheading}</p>
                  )}
                </div>
              );

            case 'content':
              return (
                <div key={index} className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: module.richText }} />
                </div>
              );

            case 'imageBlock':
              return (
                <div key={index} className="image-block">
                  {module.image && (
                    <div>
                      <img
                        src={module.image.url}
                        alt={module.caption || ''}
                        className="w-full rounded-lg"
                      />
                      {module.caption && (
                        <p className="text-sm text-gray-600 mt-2">{module.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              );

            case 'twoColumn':
              return (
                <div key={index} className="grid md:grid-cols-2 gap-8">
                  <div className="prose" dangerouslySetInnerHTML={{ __html: module.leftColumn }} />
                  <div className="prose" dangerouslySetInnerHTML={{ __html: module.rightColumn }} />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
