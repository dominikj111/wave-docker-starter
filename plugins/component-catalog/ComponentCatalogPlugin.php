<?php

namespace Wave\Plugins\ComponentCatalog;

use Livewire\Livewire;
use Wave\Plugins\Plugin;
use Illuminate\Support\Facades\File;
use Filament\Facades\Filament;
use Filament\Navigation\NavigationItem;

class ComponentCatalogPlugin extends Plugin
{
    protected $name = 'ComponentCatalog';

    protected $description = 'React Component Catalog with Headless UI';

    public function register(): void
    {
        // Empty - matches parent signature
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'component-catalog');
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');

        Livewire::component('component-catalog', \Wave\Plugins\ComponentCatalog\Components\ComponentCatalog::class);

        // Publish SPA assets to public directory
        $this->publishes([
            __DIR__ . '/ui/dist' => public_path('plugins/component-catalog'),
        ], 'component-catalog-assets');

        // Register custom admin navigation items
        $this->registerAdminNavigation();
    }

    protected function registerAdminNavigation(): void
    {
        // Use configuring callback to add navigation items before panel is finalized
        try {
            $panel = Filament::getPanel('admin');
            
            if ($panel) {
                $panel->navigationItems([
                    NavigationItem::make('Custom Page')
                        ->url('/admin/custom-page', shouldOpenInNewTab: false)
                        ->icon('heroicon-o-star')
                        ->group('Custom')
                        ->sort(100)
                        ->isActiveWhen(fn () => request()->is('admin/custom-page')),
                        
                    NavigationItem::make('External Link')
                        ->url('https://devdojo.com/wave/docs', shouldOpenInNewTab: true)
                        ->icon('heroicon-o-globe-alt')
                        ->group('Custom')
                        ->sort(101),
                ]);
            }
        } catch (\Exception $e) {
            // Panel might not be available yet
        }
    }

    public function getPluginInfo(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'version' => $this->getPluginVersion()
        ];
    }

    public function getPluginVersion(): array
    {
        return File::json(__DIR__ . '/version.json');
    }

    public function getPostActivationCommands(): array
    {
        return [
            'vendor:publish --tag=component-catalog-assets --force',
        ];
    }

    /**
     * Get the main JS asset file from the dist directory
     * Automatically detects the hashed filename (returns newest file)
     */
    public static function getSpaAsset(): ?string
    {
        $assetsPath = public_path('plugins/component-catalog/assets');
        
        if (!File::isDirectory($assetsPath)) {
            return null;
        }

        // Find all main JS files (index-*.js)
        $files = File::glob($assetsPath . '/index-*.js');
        
        if (empty($files)) {
            return null;
        }

        // Sort by modification time (newest first)
        usort($files, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        // Get the filename without the full path
        $filename = basename($files[0]);
        
        return 'plugins/component-catalog/assets/' . $filename;
    }
}