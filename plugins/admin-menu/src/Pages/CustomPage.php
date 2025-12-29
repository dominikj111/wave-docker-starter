<?php

namespace Wave\Plugins\AdminMenu\Pages;

use BackedEnum;
use Filament\Pages\Page;

class CustomPage extends Page
{
    protected static BackedEnum|string|null $navigationIcon = 'heroicon-o-star';

    protected static ?string $slug = 'custom-page';

    // Hide from navigation since we're adding it via the plugin
    protected static bool $shouldRegisterNavigation = false;

    protected string $view = 'admin-menu::filament.custom-page';

    public static function getNavigationLabel(): string
    {
        return 'Component Catalog';
    }

    public function getTitle(): string
    {
        return 'Component Catalog';
    }

    public function getHeading(): string
    {
        return 'Component Catalog';
    }

    public function mount(): void
    {
        // You can add authorization checks here
        // abort_unless(auth()->user()->can('view_custom_page'), 403);
    }
}
