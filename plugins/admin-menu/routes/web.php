<?php

use Illuminate\Support\Facades\Route;
use Wave\Plugins\AdminMenu\Pages\CustomPage;

Route::middleware(['web'])->group(function () {
    Route::view('admin-menu', 'admin-menu::home')->name('admin-menu');
    Route::get('admin-menu/component', \Wave\Plugins\AdminMenu\Components\AdminMenu::class)->name('admin-menu.component');
});

// Admin routes with Filament middleware
Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    Route::get('custom-page', CustomPage::class)->name('filament.admin.pages.custom-page');
});