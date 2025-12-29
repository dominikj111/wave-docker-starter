<?php

namespace Wave\Plugins\AdminMenu\Components;

use Livewire\Component;

class AdminMenu extends Component
{
    public $message;

    public function mount($category = null)
    {
        $this->message = 'Hello World';
    }

    public function render()
    {
        $layout = (auth()->guest()) ? 'theme::components.layouts.marketing' : 'theme::components.layouts.app';
        
        return view('admin-menu::livewire.admin-menu')->layout($layout);
    }
}