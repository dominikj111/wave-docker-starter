<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::view('theme-inheritance', 'theme-inheritance::home')->name('theme-inheritance');
    Route::get('theme-inheritance/component', \Wave\Plugins\ThemeInheritance\Components\ThemeInheritance::class)->name('theme-inheritance.component');
});