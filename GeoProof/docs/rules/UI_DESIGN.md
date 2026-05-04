# UI Design Rules

## Philosophy

GeoProof UI should feel **professional**, **trustworthy**, and **technical**. Avoid generic SaaS aesthetics. Design for operators who work in agricultural and blockchain contexts.

---

## Color System

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `oklch(0.7 0.18 175)` | CTAs, links, emphasis |
| `--accent` | `oklch(0.65 0.18 145)` | Secondary actions, highlights |
| `--background` | `oklch(0.12 0.015 240)` | Page background |
| `--card` | `oklch(0.16 0.02 240)` | Card surfaces |
| `--muted` | `oklch(0.22 0.02 240)` | Disabled, secondary |

### Status Colors

| Status | Color | Token |
|--------|-------|-------|
| Success | Green | `oklch(0.7 0.2 145)` |
| Warning | Amber | `oklch(0.75 0.15 85)` |
| Error | Red | `oklch(0.55 0.2 25)` |
| Info | Blue | `oklch(0.65 0.15 240)` |
| Pending | Yellow | `oklch(0.75 0.15 95)` |

### Rules

1. **Never use pure black or white** - always use tinted variants
2. **Limit to 5 colors max** per view
3. **Accent sparingly** - only for key interactive elements
4. **Status colors are semantic** - don't use red for non-error states

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Scale

| Size | Class | Usage |
|------|-------|-------|
| 11px | `text-xs` | Labels, timestamps |
| 14px | `text-sm` | Body, secondary |
| 16px | `text-base` | Body, primary |
| 18px | `text-lg` | Subheadings |
| 24px | `text-2xl` | Card titles |
| 32px | `text-3xl` | Page titles |
| 48px | `text-5xl` | Hero headlines |

### Rules

1. **Use Inter for UI** - never decorative fonts
2. **Monospace for data** - addresses, hashes, amounts
3. **Max 2 weights per page** - regular (400) and semibold (600)
4. **Line height 1.5** minimum for body text
5. **No text smaller than 11px**

---

## Spacing

### Scale

```
4px  → gap-1, p-1
8px  → gap-2, p-2
12px → gap-3, p-3
16px → gap-4, p-4
24px → gap-6, p-6
32px → gap-8, p-8
48px → gap-12, p-12
64px → gap-16, p-16
```

### Rules

1. **Use 8px grid** for all spacing
2. **Consistent internal padding** - Cards: 24px, Buttons: 16px horizontal
3. **Section spacing** - 48px between major sections
4. **Related items** - 8-16px apart
5. **Unrelated items** - 24-32px apart

---

## Components

### Cards

```tsx
// Standard card
<Card className="border-border/50 bg-card">
  <CardHeader className="pb-4">
    <CardTitle className="text-lg">Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

Rules:
- Always use `border-border/50` (50% opacity)
- No drop shadows in dark mode
- Consistent 24px padding
- Max nesting: 2 levels

### Buttons

| Variant | Usage |
|---------|-------|
| `default` | Primary actions |
| `secondary` | Secondary actions |
| `outline` | Tertiary actions |
| `ghost` | Navigation, toolbars |
| `destructive` | Delete, cancel |

Rules:
- One primary button per section
- Icons on left, text on right
- Min width 80px for text buttons
- Loading state must disable

### Tables

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-border/50 hover:bg-transparent">
      <TableHead className="text-muted-foreground">Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-border/50">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Rules:
- Zebra striping: Use `hover:bg-muted/50`
- Align numbers right
- Truncate with ellipsis, show full on hover
- Max 7 columns on desktop, 3 on mobile

### Forms

```tsx
<FieldGroup>
  <Field>
    <FieldLabel>Label</FieldLabel>
    <Input />
    <FieldDescription>Help text</FieldDescription>
  </Field>
</FieldGroup>
```

Rules:
- Always include labels
- Error messages below input
- Required fields marked with asterisk
- Group related fields with `FieldSet`

---

## Layout

### Grid System

```tsx
// Page layout
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Dashboard grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Sidebar layout
<div className="flex">
  <aside className="w-64 shrink-0">
  <main className="flex-1">
```

### Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| Mobile | < 640px | 1 |
| Tablet | 640-1024px | 2 |
| Desktop | > 1024px | 4 |

### Rules

1. **Mobile-first** - design for 375px, enhance up
2. **Max content width** - 1280px
3. **Sidebar** - 256px fixed, collapsible on mobile
4. **No horizontal scroll** - ever
5. **Touch targets** - min 44px on mobile

---

## Data Display

### Numbers

| Type | Format | Example |
|------|--------|---------|
| Currency | 2 decimals, comma | $1,234.56 |
| Tokens | Symbol suffix | 1,284 PROOF |
| Percentage | 1 decimal | 92.5% |
| Large | Abbreviate | 156K, 4.2M |
| Address | Truncate middle | Gh4...x9Kp |

### Dates

| Type | Format |
|------|--------|
| Relative | "2 hours ago" |
| Absolute | "May 3, 2026" |
| Timestamp | "May 3, 2026 14:32" |

### Status Badges

```tsx
<Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
  Completed
</Badge>
```

---

## Icons

### Library

Use **Lucide React** exclusively.

### Sizing

| Context | Size | Class |
|---------|------|-------|
| Inline text | 16px | `h-4 w-4` |
| Buttons | 18px | `h-[18px] w-[18px]` |
| Cards | 20px | `h-5 w-5` |
| Features | 24px | `h-6 w-6` |
| Empty states | 48px | `h-12 w-12` |

### Rules

1. **Consistent stroke width** - use default (2px)
2. **Match text color** - `text-muted-foreground` for secondary
3. **Always include sr-only label** for icon-only buttons
4. **No emoji** - use icons instead

---

## Animation

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| Hover | 150ms | ease-out |
| Expand | 200ms | ease-in-out |
| Page | 300ms | ease-out |
| Loading | 1000ms | linear |

### Rules

1. **Subtle only** - no bounces, no excessive movement
2. **Purpose-driven** - animate to communicate state
3. **Reduce motion** - respect `prefers-reduced-motion`
4. **No skeleton flicker** - min 300ms before showing

---

## Accessibility

### Requirements

1. **Color contrast** - WCAG AA minimum (4.5:1 text, 3:1 UI)
2. **Focus indicators** - visible ring on all interactives
3. **Keyboard navigation** - full functionality
4. **Screen readers** - proper ARIA labels
5. **Touch targets** - 44px minimum

### Testing

```bash
# Check accessibility
pnpm dlx @axe-core/cli
```

---

## Anti-patterns

### Don't

- Gradients on primary elements
- Blurred background blobs as decoration
- Centered hero text on all pages
- Generic "Built with love" footers
- Excessive whitespace (>100px)
- Drop shadows in dark mode
- Rainbow or neon accent colors
- Animations without purpose
- Icon-only buttons without labels
- Low-contrast placeholder text

### Do

- Sharp, intentional borders
- Data-driven visualizations
- Left-aligned dashboard content
- Specific, technical copy
- Functional use of space
- Subtle elevation with borders
- Professional, muted palette
- State-communicating transitions
- Clear, labeled actions
- Readable form placeholders
