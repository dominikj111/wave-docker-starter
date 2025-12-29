<?php

namespace Wave\Plugins\AdminMenu;

use Livewire\Livewire;
use Wave\Plugins\Plugin;
use Illuminate\Support\Facades\File;
use Filament\Facades\Filament;
use Filament\Navigation\NavigationItem;

class AdminMenuPlugin extends Plugin
{
    protected $name = 'AdminMenu';

    protected $description = 'Admin Menu Items';

    public function register(): void
    {
        // Empty - matches parent signature
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'admin-menu');
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');

        Livewire::component('admin-menu', \Wave\Plugins\AdminMenu\Components\AdminMenu::class);

        // Register custom admin navigation items
        $this->registerAdminNavigation();
    }

    protected function registerAdminNavigation(): void
    {
        // Register navigation items for the admin panel
        Filament::serving(function () {
            Filament::registerNavigationItems([
                NavigationItem::make('Custom Link')
                    ->url('/admin/custom-page', shouldOpenInNewTab: false)
                    ->icon('heroicon-o-star')
                    ->group('Custom')
                    ->sort(100),
                    
                NavigationItem::make('External Link')
                    ->url('https://devdojo.com/wave/docs', shouldOpenInNewTab: true)
                    ->icon('heroicon-o-globe-alt')
                    ->group('Custom')
                    ->sort(101),
            ]);
        });
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
}