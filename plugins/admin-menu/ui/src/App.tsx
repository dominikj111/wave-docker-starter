import { useState, Fragment } from 'react'
import { Dialog, Transition, Switch, Listbox, Tab } from '@headlessui/react'
import { Check, ChevronDown, X, Bell, Settings, User, BarChart3 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 300, revenue: 1398 },
  { name: 'Mar', users: 200, revenue: 9800 },
  { name: 'Apr', users: 278, revenue: 3908 },
  { name: 'May', users: 189, revenue: 4800 },
  { name: 'Jun', users: 239, revenue: 3800 },
]

const people = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
  { id: 4, name: 'Option 4' },
]

function App() {
  const [count, setCount] = useState(0)
  const [sliderValue, setSliderValue] = useState(50)
  const [selected, setSelected] = useState(people[0])
  const [enabled, setEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      {/* Small info banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6 p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Tech Stack:</strong> Headless UI components with Wave's Tailwind CSS, Lucide Icons, and Recharts
        </p>
      </div>

      {/* Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>🔘</span> Buttons
        </h2>
        
        <h3 className="text-lg font-semibold mb-3">Button Variants</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Primary
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            Secondary
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Success
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Danger
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium">
            Warning
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium">
            Outline
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Counter: {count}
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3">With Icons (Lucide React)</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <Bell size={18} /> Notifications
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2">
            <Settings size={18} /> Settings
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
            <User size={18} /> Profile
          </button>
        </div>
      </div>

      {/* Headless UI Components */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>🎛️</span> Headless UI Components
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Listbox (Dropdown) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Listbox (Dropdown)</h3>
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="block truncate">{selected.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {people.map((person) => (
                      <Listbox.Option
                        key={person.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                          }`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {person.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: <strong>{selected.name}</strong>
            </p>
          </div>

          {/* Switch (Toggle) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Switch (Toggle)</h3>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Status: <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <Switch
                  checked={false}
                  onChange={() => {}}
                  className="bg-gray-200 dark:bg-gray-700 relative inline-flex h-6 w-11 items-center rounded-full"
                >
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                </Switch>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <Switch
                  checked={true}
                  onChange={() => {}}
                  className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full"
                >
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog (Modal) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Dialog (Modal)</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Open Modal
          </button>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                      <Dialog.Title className="text-lg font-bold mb-4">
                        Modal Title
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This is a Headless UI Dialog component. It's fully accessible and customizable with Tailwind CSS.
                      </Dialog.Description>

                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>

      {/* Form Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>📝</span> Form Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Inputs */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Text Inputs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Input</label>
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Input</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Textarea</label>
                <textarea
                  rows={3}
                  placeholder="Enter description..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes & Radio */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Checkboxes & Radio</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                  <span className="text-sm">Enable notifications</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm">Subscribe to newsletter</span>
                </label>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="radio" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm">Option A</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="radio" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm">Option B</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Range Slider</h3>
          <label className="block text-sm font-medium mb-2">
            Volume: {sliderValue}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>📑</span> Tabs (Headless UI)
        </h2>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Overview
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Analytics
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Settings
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-2">Overview Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This is the overview tab content. Tabs are fully accessible and animated.
              </p>
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-2">Analytics Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analytics data and charts would go here.
              </p>
            </Tab.Panel>
            <Tab.Panel className="rounded-xl bg-white dark:bg-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-2">Settings Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configuration options and preferences.
              </p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Charts (Recharts) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>📊</span> Charts (Recharts)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Line Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Bar Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3b82f6" />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges & Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <span>🏷️</span> Badges & Alerts
        </h2>

        <h3 className="text-lg font-semibold mb-3">Badges</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Primary
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Success
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Warning
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Error
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Neutral
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-3">Alerts</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Info Alert</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">This is an informational message.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Success Alert</h4>
                <p className="text-sm text-green-800 dark:text-green-200">Operation completed successfully!</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">Error Alert</h4>
                <p className="text-sm text-red-800 dark:text-red-200">Something went wrong!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>💡</span> Tech Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">UI Components</h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Headless UI</li>
              <li>• Lucide React Icons</li>
              <li>• Wave's Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Charts</h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Recharts</li>
              <li>• Fully responsive</li>
              <li>• No CSS conflicts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Benefits</h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Zero CSS conflicts</li>
              <li>• Fully accessible</li>
              <li>• Works in Filament</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
