<?php

use Illuminate\Support\Facades\Route;
use Wave\Plugins\ComponentCatalog\Pages\CustomPage;

Route::middleware(['web'])->group(function () {
    Route::view('component-catalog', 'component-catalog::home')->name('component-catalog');
    Route::get('component-catalog/component', \Wave\Plugins\ComponentCatalog\Components\ComponentCatalog::class)->name('component-catalog.component');
});

// Admin routes with Filament middleware
Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    Route::get('custom-page', CustomPage::class)->name('filament.admin.pages.custom-page');
});