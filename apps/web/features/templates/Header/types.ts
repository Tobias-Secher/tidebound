import type { Header, Page } from '@repo/api-types';

export type ResolvedToast = {
  enabled: boolean;
  message: string;
  linkUrl?: string;
  linkText?: string;
};

export function resolveToast(toast: Header['toast']): ResolvedToast | null {
  if (!toast?.enabled || !toast.message) return null;

  return {
    enabled: true,
    message: toast.message,
    linkUrl: toast.linkUrl ?? undefined,
    linkText: toast.linkText ?? undefined,
  };
}

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

function resolveNavItemUrl(item: NavItemLink, locale: string): string {
  if (item.linkType === 'external' && item.externalUrl) {
    return item.externalUrl;
  }

  if (item.linkType === 'internal' && item.page) {
    if (typeof item.page === 'string') {
      return `/${locale}`;
    }
    return `/${locale}/${item.page.slug}`;
  }

  return `/${locale}`;
}

export function resolveNavItems(
  navItems: Header['navItems'],
  locale: string,
): ResolvedNavItem[] {
  if (!navItems) return [];

  return navItems.map((item) => ({
    id: item.id ?? undefined,
    label: item.label,
    href: resolveNavItemUrl(item, locale),
    openInNewTab: item.openInNewTab ?? undefined,
    children: item.children?.map((child) => ({
      id: child.id ?? undefined,
      label: child.label,
      href: resolveNavItemUrl(child, locale),
      openInNewTab: child.openInNewTab ?? undefined,
    })),
  }));
}
