<?php

namespace Wave\Plugins\ComponentCatalog\Components;

use Livewire\Component;

class ComponentCatalog extends Component
{
    public $message;

    public function mount($category = null)
    {
        $this->message = 'Hello World (dynamic)';
    }

    public function render()
    {
        $layout = (auth()->guest()) ? 'theme::components.layouts.marketing' : 'theme::components.layouts.app';
        
        return view('component-catalog::livewire.component-catalog')->layout($layout);
    }
}