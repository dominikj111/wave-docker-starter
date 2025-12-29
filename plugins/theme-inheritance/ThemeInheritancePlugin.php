<?php

namespace Wave\Plugins\ThemeInheritance;

use Livewire\Livewire;
use Wave\Plugins\Plugin;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Blade;
use Laravel\Folio\Folio;

class ThemeInheritancePlugin extends Plugin
{
    protected $name = 'ThemeInheritance';

    protected $description = 'Enables WordPress-style child theme inheritance with automatic fallback to parent theme';

    public function register(): void
    {
        // Empty - matches parent signature
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'theme-inheritance');
        $this->loadRoutesFrom(__DIR__ . '/routes/web.php');

        Livewire::component('theme-inheritance', \Wave\Plugins\ThemeInheritance\Components\ThemeInheritance::class);

        // Register parent theme paths after boot
        $this->registerParentThemePaths();
    }

    protected function registerParentThemePaths(): void
    {
        try {
            // Get active theme from database
            $activeTheme = DB::table('themes')
                ->where('active', 1)
                ->first();

            if (!$activeTheme) {
                Log::debug('ThemeInheritance: No active theme found');
                return;
            }

            $themePath = resource_path("themes/{$activeTheme->folder}");
            $themeJsonPath = "{$themePath}/theme.json";

            // Check if theme has parent defined
            if (File::exists($themeJsonPath)) {
                $config = json_decode(File::get($themeJsonPath), true);

                if (isset($config['parent'])) {
                    $this->registerParentTheme($config['parent'], $activeTheme->folder);
                    Log::info("ThemeInheritance: Registered parent theme '{$config['parent']}' for '{$activeTheme->folder}'");
                }
            }
        } catch (\Exception $e) {
            // Fail silently if database not ready (during migrations, etc.)
            Log::debug('ThemeInheritance: Could not register parent theme paths - ' . $e->getMessage());
        }
    }

    protected function registerParentTheme(string $parentFolder, string $childFolder): void
    {
        // Prevent circular references
        if ($parentFolder === $childFolder) {
            Log::warning("ThemeInheritance: Circular theme reference detected - {$parentFolder}");
            return;
        }

        $parentPath = resource_path("themes/{$parentFolder}");

        if (File::isDirectory($parentPath)) {
            // Add parent theme path as fallback to 'theme' namespace
            // Laravel checks paths in order, so parent becomes fallback
            View::addNamespace('theme', $parentPath);
            
            // Register component paths for Blade anonymous components
            $parentComponentsPath = "{$parentPath}/components";
            $parentElementsPath = "{$parentComponentsPath}/elements";
            
            if (File::isDirectory($parentComponentsPath)) {
                $this->loadViewsFrom($parentComponentsPath, 'components');
                Blade::anonymousComponentPath($parentComponentsPath);
                Log::info("ThemeInheritance: Registered parent components path: {$parentComponentsPath}");
            }
            
            if (File::isDirectory($parentElementsPath)) {
                Blade::anonymousComponentPath($parentElementsPath);
                Log::info("ThemeInheritance: Registered parent elements path: {$parentElementsPath}");
            }
            
            // Register Folio pages directory for file-based routing
            $parentPagesPath = "{$parentPath}/pages";
            if (File::isDirectory($parentPagesPath)) {
                Folio::path($parentPagesPath)->middleware([
                    '*' => [
                        //
                    ],
                ]);
                Log::info("ThemeInheritance: Registered parent Folio pages path: {$parentPagesPath}");
            }
            
            Log::info("ThemeInheritance: Added parent theme path: {$parentPath}");

            // Check if parent also has a parent (recursive support)
            $parentJsonPath = "{$parentPath}/theme.json";
            if (File::exists($parentJsonPath)) {
                $parentConfig = json_decode(File::get($parentJsonPath), true);
                if (isset($parentConfig['parent'])) {
                    $this->registerParentTheme($parentConfig['parent'], $parentFolder);
                }
            }
        } else {
            Log::warning("ThemeInheritance: Parent theme not found - {$parentFolder}");
        }
    }

    public function getPostActivationCommands(): array
    {
        return [
            'view:clear',
            'config:clear',
        ];
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