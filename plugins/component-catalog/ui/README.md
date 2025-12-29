# Component Catalog SPA

A React-based component catalog demonstrating Headless UI integration within Wave's Filament admin panel.

## Architecture

**Tech Stack:**

- **React 19** - UI framework
- **Headless UI** - Accessible, unstyled components
- **Wave's Tailwind CSS** - Styling (no custom CSS needed)
- **Lucide React** - Icon library
- **Recharts** - Chart library
- **Vite** - Build tool

**Key Design Decisions:**

- ✅ Zero CSS conflicts - uses Wave's existing Tailwind
- ✅ No custom CSS files - pure Tailwind utility classes
- ✅ Works seamlessly within Filament admin panels
- ✅ Fully accessible components via Headless UI
- ✅ Dynamic asset loading (no manual filename updates)

## Development

### Prerequisites

```bash
cd plugins/component-catalog/ui
npm install
```

### Build & Deploy

```bash
# Build and deploy in one command
npm run build && npm run deploy

# Or separately:
npm run build   # Build the SPA
npm run deploy  # Publish assets to Wave
```

### Development Workflow

1. Make changes to `src/App.tsx`
2. Run `npm run build && npm run deploy`
3. Refresh `/admin/custom-page` in browser
4. Changes appear automatically (dynamic asset loading)

## Project Structure

```
ui/
├── src/
│   ├── App.tsx          # Main React component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── dist/                # Build output (gitignored)
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript config
```

## Components Included

### Headless UI Components

- **Listbox** - Accessible dropdown with search
- **Switch** - Toggle switches
- **Dialog** - Modal dialogs
- **Tabs** - Tab navigation

### Form Controls

- Text inputs, email, textarea
- Checkboxes and radio buttons
- Range sliders

### Data Visualization

- Line charts (Recharts)
- Bar charts (Recharts)

### UI Elements

- Buttons with variants
- Badges and alerts
- Icons (Lucide React)

## Styling Guidelines

**Use Wave's Tailwind classes directly:**

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Primary Button
</button>
```

**Do NOT:**

- ❌ Create custom CSS files
- ❌ Import external CSS frameworks
- ❌ Use CSS-in-JS libraries
- ❌ Add Tailwind config (use Wave's)

**Why?** This ensures zero CSS conflicts with Filament's admin panel.

## Dynamic Asset Loading

The Blade view automatically detects the latest built JS file:

```php
// AdminMenuPlugin.php
public static function getSpaAsset(): ?string
{
    // Finds newest index-*.js file automatically
    // No manual filename updates needed!
}
```

## Adding New Components

1. Install the package:

```bash
npm install package-name
```

2. Import and use in `src/App.tsx`:

```tsx
import { NewComponent } from "package-name";

function App() {
  return (
    <NewComponent className="px-4 py-2 bg-blue-600 text-white rounded-lg" />
  );
}
```

3. Build and deploy:

```bash
npm run build && npm run deploy
```

## Troubleshooting

**SPA not loading?**

```bash
php artisan vendor:publish --tag=component-catalog-assets --force
php artisan view:clear
```

**Old version showing?**

- The helper automatically picks the newest file by modification time
- Clear browser cache if needed

**Build errors?**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```
