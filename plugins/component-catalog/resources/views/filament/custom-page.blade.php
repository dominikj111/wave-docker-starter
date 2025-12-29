<x-filament-panels::page>
    <div id="root"></div>
    
    @php
        $spaAsset = \Wave\Plugins\ComponentCatalog\ComponentCatalogPlugin::getSpaAsset();
    @endphp
    
    @if($spaAsset)
        <script type="module" src="{{ asset($spaAsset) }}"></script>
    @else
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p class="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>SPA assets not found.</strong> Please run: <code class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded">php artisan vendor:publish --tag=component-catalog-assets --force</code>
            </p>
        </div>
    @endif
</x-filament-panels::page>
