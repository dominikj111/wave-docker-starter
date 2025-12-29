<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::view('admin-menu', 'admin-menu::home')->name('admin-menu');
    Route::get('admin-menu/component', \Wave\Plugins\AdminMenu\Components\AdminMenu::class)->name('admin-menu.component');
});