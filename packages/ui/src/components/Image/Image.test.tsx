import { render, screen, fireEvent } from '@testing-library/react';
import type { Media } from '@repo/api-types';
import { Image } from './Image';

function makeMedia(overrides: Partial<Media> = {}): Media {
  return {
    id: 'media-1',
    alt: 'A descriptive alt',
    url: 'https://example.com/desktop.jpg',
    width: 600,
    height: 400,
    updatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('Image', () => {
  it('returns null when desktop is null', () => {
    const { container } = render(<Image desktop={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when desktop is undefined', () => {
    const { container } = render(<Image desktop={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a single img (no picture) when only desktop is provided', () => {
    const { container } = render(<Image desktop={makeMedia()} />);
    expect(container.querySelector('picture')).toBeNull();
    expect(screen.getByAltText('A descriptive alt')).toBeInTheDocument();
  });

  it('uses media.alt when no alt prop is provided', () => {
    render(<Image desktop={makeMedia({ alt: 'From CMS' })} />);
    expect(screen.getByAltText('From CMS')).toBeInTheDocument();
  });

  it('overrides media.alt with the alt prop', () => {
    render(<Image desktop={makeMedia({ alt: 'CMS alt' })} alt="Override" />);
    expect(screen.getByAltText('Override')).toBeInTheDocument();
    expect(screen.queryByAltText('CMS alt')).toBeNull();
  });

  it('honors empty-string alt as decorative (?? semantics)', () => {
    const { container } = render(
      <Image desktop={makeMedia({ alt: 'CMS alt' })} alt="" />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('');
  });

  it('uses ImageSource width/height overrides over media values', () => {
    const media = makeMedia({ width: 9999, height: 9999 });
    const { container } = render(
      <Image desktop={{ media, width: 320, height: 240 }} />,
    );
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('320');
    expect(img?.getAttribute('height')).toBe('240');
  });

  it('renders <picture> with one <source> when mobile is provided', () => {
    const { container } = render(
      <Image desktop={makeMedia()} mobile={makeMedia({ id: 'm', url: 'https://example.com/m.jpg' })} />,
    );
    const picture = container.querySelector('picture');
    expect(picture).not.toBeNull();
    const sources = picture!.querySelectorAll('source');
    expect(sources).toHaveLength(1);
    expect(sources[0]?.getAttribute('media')).toBe('(min-width: 1000px)');
  });

  it('uses the configured breakpoint on the source', () => {
    const { container } = render(
      <Image
        desktop={makeMedia()}
        mobile={makeMedia({ id: 'm', url: 'https://example.com/m.jpg' })}
        breakpoint="(min-width: 768px)"
      />,
    );
    expect(container.querySelector('source')?.getAttribute('media')).toBe(
      '(min-width: 768px)',
    );
  });

  it('throws when media.url is missing and no override exists', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Image desktop={makeMedia({ url: null })} />),
    ).toThrow(/missing a url/);
    spy.mockRestore();
  });

  it('throws when media.width is missing and no override exists', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Image desktop={makeMedia({ width: null })} />),
    ).toThrow(/missing width/);
    spy.mockRestore();
  });

  it('throws when media.height is missing and no override exists', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Image desktop={makeMedia({ height: null })} />),
    ).toThrow(/missing height/);
    spy.mockRestore();
  });

  it('does not throw when missing dimensions are supplied via overrides', () => {
    const media = makeMedia({ width: null, height: null });
    expect(() =>
      render(<Image desktop={{ media, width: 600, height: 400 }} />),
    ).not.toThrow();
  });

  it('calls onImageLoaderError when the rendered image errors', () => {
    const onError = jest.fn();
    render(<Image desktop={makeMedia()} onImageLoaderError={onError} />);
    fireEvent.error(screen.getByAltText('A descriptive alt'));
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
