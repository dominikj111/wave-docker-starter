<?php

namespace Wave\Plugins\ThemeInheritance\Components;

use Livewire\Component;

class ThemeInheritance extends Component
{
    public $message;

    public function mount($category = null)
    {
        $this->message = 'Hello World';
    }

    public function render()
    {
        $layout = (auth()->guest()) ? 'theme::components.layouts.marketing' : 'theme::components.layouts.app';
        
        return view('theme-inheritance::livewire.theme-inheritance')->layout($layout);
    }
}