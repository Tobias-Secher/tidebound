import type { Header, Page } from '@repo/api-types';

export type ResolvedNavItem = {
  id?: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: ResolvedNavItem[];
};

type NavItemLink = {
  linkType: 'internal' | 'external';
  page?: string | Page | null;
  externalUrl?: string | null;
};

function resolveNavItemUrl(item: NavItemLink): string {
  if (item.linkType === 'external' && item.externalUrl) {
    return item.externalUrl;
  }

  if (item.linkType === 'internal' && item.page) {
    if (typeof item.page === 'string') {
      return '/';
    }
    return `/${item.page.slug}`;
  }

  return '/';
}

export function resolveNavItems(
  navItems: Header['navItems'],
): ResolvedNavItem[] {
  if (!navItems) return [];

  return navItems.map((item) => ({
    id: item.id ?? undefined,
    label: item.label,
    href: resolveNavItemUrl(item),
    openInNewTab: item.openInNewTab ?? undefined,
    children: item.children?.map((child) => ({
      id: child.id ?? undefined,
      label: child.label,
      href: resolveNavItemUrl(child),
      openInNewTab: child.openInNewTab ?? undefined,
    })),
  }));
}
