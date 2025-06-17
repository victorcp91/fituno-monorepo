# @fituno/ui

Shared UI components package for the Fituno monorepo, built with [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS.

## Overview

This package provides a centralized location for all UI components, utilities, and styles used across the Fituno ecosystem. It follows the [shadcn/ui monorepo structure](https://ui.shadcn.com/docs/monorepo) for optimal component sharing and maintenance.

## Structure

```
packages/ui/
├── src/
│   ├── components/          # shadcn/ui components (39 components)
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn, etc.)
│   ├── styles/
│   │   └── globals.css     # Global styles and CSS variables
│   └── index.ts            # Main export file
├── components.json         # shadcn/ui configuration
├── tailwind.config.mjs     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Package configuration
```

## Installation

This package is automatically included in Fituno workspace apps. No additional installation required.

## Available Components

### Form Components
- `Button` - Interactive button with multiple variants
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Label` - Form field labels
- `Checkbox` - Boolean selection component
- `Switch` - Toggle switch component
- `RadioGroup` & `RadioGroupItem` - Radio button groups
- `Select` & related components - Dropdown selections
- `Slider` - Range input component

### Layout Components
- `Card` & related components - Content containers
- `Separator` - Visual dividers
- `AspectRatio` - Responsive aspect ratio containers
- `ScrollArea` & `ScrollBar` - Custom scrollable areas
- `Resizable` components - Resizable panels

### Navigation Components
- `Tabs` & related components - Tab navigation
- `Accordion` & related components - Collapsible content
- `NavigationMenu` & related components - Navigation menus
- `Menubar` & related components - Menu bars
- `DropdownMenu` & related components - Dropdown menus
- `ContextMenu` & related components - Context menus

### Feedback Components
- `Alert Dialog` & related components - Modal dialogs
- `Dialog` & related components - Modal dialogs
- `Drawer` & related components - Slide-out panels
- `Popover` & related components - Floating content
- `Tooltip` & related components - Hover information
- `HoverCard` & related components - Rich hover content
- `Progress` - Progress indicators
- `Badge` - Status indicators
- `Toaster` (Sonner) - Toast notifications

### Data Display Components
- `Table` & related components - Data tables
- `Calendar` - Date picker calendar
- `Chart` & related components - Data visualization
- `Avatar` & related components - User avatars
- `Carousel` & related components - Content carousels

### Input Components
- `Command` & related components - Command palette
- `InputOTP` & related components - OTP input fields

### Utility Components
- `Toggle` & `ToggleGroup` - Toggle buttons
- `Collapsible` & related components - Collapsible content

## Usage

Import components directly from the package:

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@fituno/ui'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Fituno</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

### Using the Utility Function

```tsx
import { cn } from '@fituno/ui'

export function MyStyledComponent({ className, ...props }) {
  return (
    <div className={cn("base-styles", className)} {...props} />
  )
}
```

### Theme Integration

The package includes the complete Fituno fitness theme with custom colors:

- **Primary**: Energetic Orange (`--primary`)
- **Secondary**: Vibrant Green (`--secondary`)
- **Accent**: Electric Blue (`--accent`)
- **Muted**: Soft Gray (`--muted`)

Both light and dark mode variants are included.

## Development

Build the package:
```bash
yarn workspace @fituno/ui build
```

Watch for changes:
```bash
yarn workspace @fituno/ui dev
```

Type check:
```bash
yarn workspace @fituno/ui type-check
```

## Adding New Components

To add new shadcn/ui components, run the command from any app directory:

```bash
# From apps/trainer-app or apps/client-app
npx shadcn@canary add [component-name]
```

Components will be automatically added to `packages/ui/src/components/` and should be exported in `src/index.ts`.

## Monorepo Integration

This package is consumed by:
- `@fituno/trainer-app` - Next.js trainer dashboard
- `@fituno/client-app` - React Native client app
- Any future Fituno applications

The shared package ensures design consistency and reduces duplication across the entire Fituno ecosystem. 