'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Heart,
  Monitor,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  X,
} from 'lucide-react'
import {
  Reorder,
  useDragControls,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { AdminActionButton } from '@/components/admin/AdminActionButton'
import { useUnsavedChanges } from '@/components/admin/unsaved-changes'
import { FormError, FormSuccess } from '@/components/admin/ui'
import { SiteMediaPicker } from '@/components/website/SiteMediaPicker'
import { WysiwygInput } from '@/components/website/WysiwygFields'
import { departmentHref } from '@/lib/catalog/nav'
import { saveNavigationContent } from '@/lib/website/actions'
import type {
  NavigationContent,
  NavigationItemContent,
} from '@/lib/website/types'

export type NavEditorCategory = {
  id: string
  name: string
  slug: string
  active: boolean
}

type PreviewMode = 'mobile' | 'desktop'

const GROUP_IDS = new Set(['shoes', 'bags', 'accessories'])

function canHoldCategories(item: NavigationItemContent) {
  return GROUP_IDS.has(item.id) || item.categorySlugs.length > 0
}

function nestedCategories(
  item: NavigationItemContent,
  categories: NavEditorCategory[],
) {
  return item.categorySlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NavEditorCategory => Boolean(c))
}

function CategoryPicker({
  unassigned,
  onPick,
  onCancel,
  className = '',
}: {
  unassigned: NavEditorCategory[]
  onPick: (slug: string) => void
  onCancel: () => void
  className?: string
}) {
  return (
    <select
      autoFocus
      className={`rounded-lg border border-cloud bg-white px-2 py-1.5 text-[13px] text-ink outline-none focus:border-navy/40 ${className}`}
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) onPick(e.target.value)
      }}
      onBlur={onCancel}
    >
      <option value="">Choose…</option>
      {unassigned.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}

function addCategoryToItem(
  item: NavigationItemContent,
  slug: string,
): NavigationItemContent {
  return {
    ...item,
    href: item.href.includes('department=')
      ? departmentHref(item.id)
      : item.href,
    categorySlugs: item.categorySlugs.includes(slug)
      ? item.categorySlugs
      : [...item.categorySlugs, slug],
  }
}

/* ─── Mobile drawer row ─────────────────────────────────────────────── */

function MobileMenuRow({
  item,
  categories,
  unassigned,
  onChange,
}: {
  item: NavigationItemContent
  categories: NavEditorCategory[]
  unassigned: NavEditorCategory[]
  onChange: (next: NavigationItemContent) => void
}) {
  const controls = useDragControls()
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const [picking, setPicking] = useState(false)
  const nested = nestedCategories(item, categories)
  const showNesting = canHoldCategories(item)

  return (
    <Reorder.Item
      value={item}
      as="div"
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => x.set(0)}
      style={{ x }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
      }
      whileDrag={{
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12)',
        backgroundColor: 'rgba(255,255,255,1)',
        zIndex: 20,
        cursor: 'grabbing',
      }}
      className={`group/row relative ${item.enabled ? '' : 'opacity-45'}`}
    >
      <div className="relative flex items-center">
        <button
          type="button"
          aria-label={`Drag ${item.label}`}
          className="absolute left-0 top-1/2 z-10 inline-flex h-8 w-7 -translate-y-1/2 -translate-x-1 cursor-grab items-center justify-center rounded-md text-mute opacity-0 transition hover:bg-mist group-hover/row:opacity-100 focus:opacity-100 active:cursor-grabbing"
          onPointerDown={(event) => {
            event.preventDefault()
            controls.start(event)
          }}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-center rounded-xl px-4 py-3">
          <WysiwygInput
            value={item.label}
            onChange={(e) => onChange({ ...item, label: e.target.value })}
            className={`min-w-0 flex-1 text-[15px] ${
              item.accent
                ? 'font-semibold text-ink underline decoration-ink/40 underline-offset-4'
                : 'font-medium text-ink'
            }`}
            aria-label="Menu label"
          />
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={item.enabled}
          aria-label={item.enabled ? 'Hide from menu' : 'Show in menu'}
          title={item.enabled ? 'Hide' : 'Show'}
          onClick={() => onChange({ ...item, enabled: !item.enabled })}
          className="absolute right-1 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-mute opacity-0 transition hover:bg-mist hover:text-navy group-hover/row:opacity-100 focus:opacity-100"
        >
          {item.enabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>

      {showNesting ? (
        <div className="flex flex-col">
          {nested.map((cat) => (
            <div
              key={cat.slug}
              className="group/child relative flex items-center rounded-xl py-2.5 pl-10 pr-4"
            >
              <span className="min-w-0 flex-1 text-[14px] font-medium text-ink/70">
                {cat.name}
              </span>
              <button
                type="button"
                aria-label={`Remove ${cat.name}`}
                onClick={() =>
                  onChange({
                    ...item,
                    categorySlugs: item.categorySlugs.filter(
                      (s) => s !== cat.slug,
                    ),
                  })
                }
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-mute opacity-0 transition hover:bg-mist hover:text-ink group-hover/child:opacity-100 focus:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {picking ? (
            <div className="px-4 pb-2 pl-10">
              <CategoryPicker
                unassigned={unassigned}
                onPick={(slug) => {
                  onChange(addCategoryToItem(item, slug))
                  setPicking(false)
                }}
                onCancel={() => setPicking(false)}
                className="w-full max-w-[14rem]"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPicking(true)}
              disabled={unassigned.length === 0}
              className="flex items-center gap-1 rounded-xl py-2 pl-10 pr-4 text-left text-[13px] font-medium text-mute transition hover:bg-navy/5 hover:text-navy disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
              Add category
            </button>
          )}
        </div>
      ) : null}
    </Reorder.Item>
  )
}

/* ─── Desktop header link ───────────────────────────────────────────── */

function DesktopMenuItem({
  item,
  categories,
  unassigned,
  open,
  onOpen,
  onClose,
  onChange,
}: {
  item: NavigationItemContent
  categories: NavEditorCategory[]
  unassigned: NavEditorCategory[]
  open: boolean
  onOpen: () => void
  onClose: () => void
  onChange: (next: NavigationItemContent) => void
}) {
  const controls = useDragControls()
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const [picking, setPicking] = useState(false)
  const nested = nestedCategories(item, categories)
  const showNesting = canHoldCategories(item)
  const hasChildren = nested.length > 0 || showNesting

  return (
    <Reorder.Item
      value={item}
      as="div"
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => x.set(0)}
      style={{ x }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
      }
      whileDrag={{
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.1)',
        backgroundColor: '#fff',
        zIndex: 30,
        cursor: 'grabbing',
      }}
      className={`group/desk relative ${item.enabled ? '' : 'opacity-45'}`}
      onMouseEnter={() => {
        if (hasChildren) onOpen()
      }}
      onMouseLeave={() => {
        if (!picking) onClose()
      }}
    >
      <div className="relative flex items-center gap-0.5">
        <button
          type="button"
          aria-label={`Drag ${item.label}`}
          className="inline-flex h-6 w-5 cursor-grab items-center justify-center rounded text-mute opacity-0 transition hover:bg-mist group-hover/desk:opacity-100 focus:opacity-100 active:cursor-grabbing"
          onPointerDown={(event) => {
            event.preventDefault()
            controls.start(event)
          }}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <div className="relative inline-flex items-center gap-1">
          <WysiwygInput
            value={item.label}
            onChange={(e) => onChange({ ...item, label: e.target.value })}
            className={`w-[4.5rem] max-w-[7rem] text-[13px] tracking-wide sm:w-auto ${
              item.accent
                ? 'font-semibold text-ink underline decoration-ink/40 underline-offset-4'
                : 'font-medium text-ink/70'
            }`}
            style={{ width: `${Math.max(item.label.length, 4) + 1}ch` }}
            aria-label="Menu label"
          />
          {hasChildren ? (
            <ChevronDown
              className={`h-3.5 w-3.5 text-ink/50 transition ${open ? 'rotate-180' : ''}`}
              aria-hidden
            />
          ) : null}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={item.enabled}
          aria-label={item.enabled ? 'Hide from menu' : 'Show in menu'}
          title={item.enabled ? 'Hide' : 'Show'}
          onClick={() => onChange({ ...item, enabled: !item.enabled })}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-mute opacity-0 transition hover:bg-mist hover:text-navy group-hover/desk:opacity-100 focus:opacity-100"
        >
          {item.enabled ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {hasChildren && open ? (
        <div className="absolute left-0 top-full z-40 min-w-[11rem] pt-3">
          <div className="rounded-xl border border-navy/10 bg-white py-2 shadow-lift">
            {nested.map((cat) => (
              <div
                key={cat.slug}
                className="group/dd relative flex items-center px-4 py-2"
              >
                <span className="min-w-0 flex-1 text-[13px] font-medium text-ink/75">
                  {cat.name}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${cat.name}`}
                  onClick={() =>
                    onChange({
                      ...item,
                      categorySlugs: item.categorySlugs.filter(
                        (s) => s !== cat.slug,
                      ),
                    })
                  }
                  className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-mute opacity-0 transition hover:bg-mist hover:text-ink group-hover/dd:opacity-100 focus:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {picking ? (
              <div className="px-3 py-1.5">
                <CategoryPicker
                  unassigned={unassigned}
                  onPick={(slug) => {
                    onChange(addCategoryToItem(item, slug))
                    setPicking(false)
                  }}
                  onCancel={() => setPicking(false)}
                  className="w-full"
                />
              </div>
            ) : showNesting ? (
              <button
                type="button"
                onClick={() => setPicking(true)}
                disabled={unassigned.length === 0}
                className="flex w-full items-center gap-1 px-4 py-2 text-left text-[12px] font-medium text-mute transition hover:bg-navy/5 hover:text-navy disabled:opacity-30"
              >
                <Plus className="h-3 w-3" />
                Add category
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </Reorder.Item>
  )
}

/**
 * WYSIWYG navigation editor — mobile drawer + desktop header, same data.
 */
export function WebsiteNavigationEditor({
  initial,
  categories,
}: {
  initial: NavigationContent
  categories: NavEditorCategory[]
}) {
  const [content, setContent] = useState(initial)
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(initial),
  )
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [desktopOpenId, setDesktopOpenId] = useState<string | null>(null)

  const isDirty = JSON.stringify(content) !== savedSnapshot

  const unassigned = useMemo(() => {
    const taken = new Set(content.items.flatMap((i) => i.categorySlugs))
    return categories.filter((c) => c.active && !taken.has(c.slug))
  }, [categories, content.items])

  const groupItems = content.items.filter((item) => canHoldCategories(item))

  const updateItem = (id: string, next: NavigationItemContent) => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? next : item)),
    }))
  }

  const setLogoSrc = (logoSrc: string) => {
    setContent((prev) => ({ ...prev, logoSrc }))
  }

  const placeCategory = (slug: string, itemId: string) => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        const without = item.categorySlugs.filter((s) => s !== slug)
        if (item.id !== itemId) return { ...item, categorySlugs: without }
        return {
          ...item,
          href: item.href.includes('department=')
            ? departmentHref(item.id)
            : item.href,
          categorySlugs: without.includes(slug) ? without : [...without, slug],
        }
      }),
    }))
  }

  const logoPicker = (
    <div className="w-[7.5rem] shrink-0 sm:w-[8.5rem]">
      <SiteMediaPicker
        pageKey="navigation"
        value={content.logoSrc}
        onChange={setLogoSrc}
        label="Replace logo"
        aspectClassName="aspect-[3/1]"
        fallback="/logo-dark.png"
        objectFit="contain"
        className="rounded-md"
      />
    </div>
  )

  const performSave = async (): Promise<boolean> => {
    setError(null)
    setSuccess(null)
    const result = await saveNavigationContent(content)
    if (!result.ok) {
      setError(result.error)
      return false
    }
    setSavedSnapshot(JSON.stringify(content))
    setSuccess('Menu saved.')
    return true
  }

  useUnsavedChanges(isDirty, performSave)

  const iconBtnClass =
    'flex h-10 w-10 items-center justify-center rounded-full text-navy/40'

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-cloud bg-paper/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/website"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white transition hover:bg-navy-deep"
            aria-label="Back to Website Modifier"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-[14px] font-semibold text-ink">Menu</p>
            <p className="text-[12px] text-mute">
              Edit the real menu — click a name to rename
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-cloud bg-white p-0.5">
            <button
              type="button"
              onClick={() => setMode('desktop')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                mode === 'desktop'
                  ? 'bg-navy text-white'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setMode('mobile')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                mode === 'mobile'
                  ? 'bg-navy text-white'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>
          <AdminActionButton
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await performSave()
              })
            }}
          >
            {pending ? 'Saving…' : isDirty ? 'Save' : 'Saved'}
          </AdminActionButton>
        </div>
      </div>

      <FormError message={error} />
      <FormSuccess message={success} />

      {mode === 'desktop' ? (
        <div className="space-y-4">
          {/* Real sticky header chrome */}
          <div className="overflow-visible rounded-2xl border border-navy/10 bg-paper/95 shadow-soft">
            <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
              {logoPicker}

              <Reorder.Group
                axis="x"
                values={content.items}
                onReorder={(items) => setContent((prev) => ({ ...prev, items }))}
                className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-visible xl:gap-5"
              >
                {content.items.map((item) => (
                  <DesktopMenuItem
                    key={item.id}
                    item={item}
                    categories={categories}
                    unassigned={unassigned}
                    open={desktopOpenId === item.id}
                    onOpen={() => setDesktopOpenId(item.id)}
                    onClose={() => setDesktopOpenId(null)}
                    onChange={(next) => updateItem(item.id, next)}
                  />
                ))}
              </Reorder.Group>

              <div className="flex shrink-0 items-center gap-0.5">
                <span className={iconBtnClass} aria-hidden>
                  <Search className="h-[18px] w-[18px]" />
                </span>
                <span className={iconBtnClass} aria-hidden>
                  <Heart className="h-[18px] w-[18px]" />
                </span>
                <span className={iconBtnClass} aria-hidden>
                  <ShoppingBag className="h-[18px] w-[18px]" />
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[12px] text-mute">
            Hover the logo to replace it · hover Shoes / Bags for dropdowns ·
            drag to reorder · click a name to rename
          </p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
              {logoPicker}
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-navy/40"
                aria-hidden
              >
                <X className="h-5 w-5" />
              </span>
            </div>

            <nav className="flex flex-col gap-0.5 p-4">
              <Reorder.Group
                axis="y"
                values={content.items}
                onReorder={(items) => setContent((prev) => ({ ...prev, items }))}
                className="flex flex-col gap-0.5"
              >
                {content.items.map((item) => (
                  <MobileMenuRow
                    key={item.id}
                    item={item}
                    categories={categories}
                    unassigned={unassigned}
                    onChange={(next) => updateItem(item.id, next)}
                  />
                ))}
              </Reorder.Group>
            </nav>
          </div>

          <p className="max-w-[320px] text-center text-[12px] text-mute">
            Hover a row for drag & hide · nested lines are categories under that
            item
          </p>
        </div>
      )}

      {unassigned.length > 0 ? (
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-dashed border-cloud bg-mist/40 p-3">
          <p className="text-[12px] font-semibold text-ink">
            Categories not in the menu
          </p>
          <ul className="mt-2 space-y-1.5">
            {unassigned.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2"
              >
                <span className="truncate text-[13px] font-medium text-ink">
                  {cat.name}
                </span>
                <select
                  className="max-w-[8.5rem] rounded-lg border border-cloud bg-white px-1.5 py-1 text-[12px] outline-none focus:border-navy/40"
                  defaultValue=""
                  aria-label={`Put ${cat.name} under`}
                  onChange={(e) => {
                    if (e.target.value) placeCategory(cat.slug, e.target.value)
                  }}
                >
                  <option value="">Put under…</option>
                  {groupItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
