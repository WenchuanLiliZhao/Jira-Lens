/**
 * DropdownMenu Component Demo - Content
 */

import React, { useState } from 'react';
import { DropdownMenu } from '../../the-component';
import { Button } from '../../../button';
import { Icon } from '../../../icon';
import { Calendar } from '../../../../form/calendar';
import styles from './styles.module.scss';

const PageContent: React.FC = () => {
  // State for controlled example
  const [isOpen, setIsOpen] = useState(false);
  
  // State for switches
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  // State for active state example
  const [theme, setTheme] = useState('Light');

  // State for Notion-style date picker
  const [datePickerDate, setDatePickerDate] = useState<Date | null>(null);
  const [datePickerRange, setDatePickerRange] = useState<[Date, Date] | null>(null);
  const [datePickerEndDateEnabled, setDatePickerEndDateEnabled] = useState(false);

  const handleEndDateToggle = (checked: boolean) => {
    setDatePickerEndDateEnabled(checked);
    if (checked && datePickerDate) {
      setDatePickerRange([datePickerDate, datePickerDate]);
    } else if (!checked && datePickerRange) {
      setDatePickerDate(datePickerRange[0]);
    }
  };

  const handleTodaySelect = () => {
    const today = new Date();
    if (datePickerEndDateEnabled) {
      setDatePickerRange([today, today]);
    } else {
      setDatePickerDate(today);
    }
  };

  const formatDateDisplay = () => {
    if (datePickerEndDateEnabled && datePickerRange) {
      return `${datePickerRange[0].toLocaleDateString()} – ${datePickerRange[1].toLocaleDateString()}`;
    }
    return datePickerDate ? datePickerDate.toLocaleDateString() : 'Pick date';
  };
  
  return (
    <div className={styles['demo-container']}>
      <h1>DropdownMenu Component Demo</h1>
      
      {/* Basic Example */}
      <section className={styles['demo-section']}>
        <h2>Basic Menu</h2>
        <p>Simple dropdown menu with icon buttons.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined">Options</Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              <DropdownMenu.ItemButton 
                label="Edit" 
                icon="edit"
                onSelect={() => alert('Edit clicked')}
              />
              <DropdownMenu.ItemButton 
                label="Duplicate" 
                icon="content_copy"
                onSelect={() => alert('Duplicate clicked')}
              />
              <DropdownMenu.Separator />
              <DropdownMenu.ItemButton 
                label="Delete" 
                icon="delete"
                onSelect={() => alert('Delete clicked')}
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>
      
      {/* With Shortcuts */}
      <section className={styles['demo-section']}>
        <h2>With Keyboard Shortcuts</h2>
        <p>Menu items with keyboard shortcut displays.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="contained">File</Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              <DropdownMenu.Group>
                <DropdownMenu.ItemWithShortcut 
                  label="New File"
                  icon="note_add"
                  shortcut="⌘N"
                  onSelect={() => alert('New File')}
                />
                <DropdownMenu.ItemWithShortcut 
                  label="Open"
                  icon="folder"
                  shortcut="⌘O"
                  onSelect={() => alert('Open')}
                />
                <DropdownMenu.ItemWithShortcut 
                  label="Save"
                  icon="save"
                  shortcut="⌘S"
                  onSelect={() => alert('Save')}
                />
              </DropdownMenu.Group>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.ItemWithShortcut 
                label="Print"
                icon="print"
                shortcut="⌘P"
                onSelect={() => alert('Print')}
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>
      
      {/* With Switches */}
      <section className={styles['demo-section']}>
        <h2>Settings Menu</h2>
        <p>Menu with toggle switches for settings.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined" startIcon="settings">
                Settings
              </Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              <DropdownMenu.Label>Preferences</DropdownMenu.Label>
              <DropdownMenu.ItemWithSwitch
                label="Dark Mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <DropdownMenu.ItemWithSwitch
                label="Auto Save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <DropdownMenu.ItemWithSwitch
                label="Notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        
        <div className={styles['demo-info']}>
          <strong>Current Settings:</strong>
          <ul>
            <li>Dark Mode: {darkMode ? 'On' : 'Off'}</li>
            <li>Auto Save: {autoSave ? 'On' : 'Off'}</li>
            <li>Notifications: {notifications ? 'On' : 'Off'}</li>
          </ul>
        </div>
      </section>
      
      {/* Active State Example */}
      <section className={styles['demo-section']}>
        <h2>Active/Selected State</h2>
        <p>Menu items can show which option is currently active/selected.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined" startIcon="palette">
                Theme: {theme}
              </Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              <DropdownMenu.Label>Select Theme</DropdownMenu.Label>
              <DropdownMenu.ItemButton
                label="Light"
                icon="light_mode"
                active={theme === 'Light'}
                onSelect={() => setTheme('Light')}
              />
              <DropdownMenu.ItemButton
                label="Dark"
                icon="dark_mode"
                active={theme === 'Dark'}
                onSelect={() => setTheme('Dark')}
              />
              <DropdownMenu.ItemButton
                label="Auto"
                icon="brightness_auto"
                active={theme === 'Auto'}
                onSelect={() => setTheme('Auto')}
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        
        <div className={styles['demo-info']}>
          <strong>Selected Theme:</strong> {theme}
        </div>
      </section>
      
      {/* Nested Submenu */}
      <section className={styles['demo-section']}>
        <h2>Nested Submenu</h2>
        <p>Menu with nested submenus (hover to open submenu).</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="contained">Menu</Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              <DropdownMenu.ItemButton label="New" icon="add" />
              <DropdownMenu.ItemButton label="Open" icon="folder" />
              
              <DropdownMenu.Separator />
              
              {/* Nested submenu */}
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <DropdownMenu.Item>
                    <span>Export</span>
                    <Icon icon="chevron_right" />
                  </DropdownMenu.Item>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="right" align="start">
                  <DropdownMenu.ItemButton 
                    label="PDF" 
                    icon="picture_as_pdf"
                    onSelect={() => alert('Export as PDF')}
                  />
                  <DropdownMenu.ItemButton 
                    label="PNG" 
                    icon="image"
                    onSelect={() => alert('Export as PNG')}
                  />
                  <DropdownMenu.ItemButton 
                    label="SVG" 
                    icon="code"
                    onSelect={() => alert('Export as SVG')}
                  />
                </DropdownMenu.Content>
              </DropdownMenu>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.ItemButton label="Close" icon="close" />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>
      
      {/* Custom Content */}
      <section className={styles['demo-section']}>
        <h2>Custom Content</h2>
        <p>Using DropdownMenu.Item for completely custom content.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined">User Menu</Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content>
              {/* Custom user profile item */}
              <DropdownMenu.Item>
                <div className={styles['user-profile']}>
                  <div className={styles['user-avatar']}>
                    <Icon icon="person" />
                  </div>
                  <div className={styles['user-info']}>
                    <div className={styles['user-name']}>John Doe</div>
                    <div className={styles['user-email']}>john@example.com</div>
                  </div>
                </div>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.ItemButton label="Profile" icon="person" />
              <DropdownMenu.ItemButton label="Settings" icon="settings" />
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.ItemButton label="Logout" icon="logout" />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>

      {/* Notion-style Date Picker */}
      <section className={styles['demo-section']}>
        <h2>Date Picker (Notion-style)</h2>
        <p>Calendar in menu with End date toggle. Mimics Notion date property picker layout.</p>
        
        <div className={styles['demo-example']}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined" startIcon="calendar_today">
                {formatDateDisplay()}
              </Button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content className={styles['date-picker-content']}>
              <DropdownMenu.Label>Date</DropdownMenu.Label>
              <DropdownMenu.ItemWithSwitch
                label="End date"
                checked={datePickerEndDateEnabled}
                onCheckedChange={handleEndDateToggle}
              />
              <DropdownMenu.Separator />
              <div className={styles['date-picker-calendar']}>
                {datePickerEndDateEnabled ? (
                  <Calendar
                    selectionMode="range"
                    value={datePickerRange}
                    onChange={setDatePickerRange}
                  />
                ) : (
                  <Calendar
                    value={datePickerDate}
                    onChange={setDatePickerDate}
                  />
                )}
              </div>
              <DropdownMenu.Separator />
              <DropdownMenu.ItemButton
                label="Today"
                icon="today"
                onSelect={handleTodaySelect}
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        
        <div className={styles['demo-info']}>
          <strong>Selected:</strong>{' '}
          {datePickerEndDateEnabled && datePickerRange
            ? `${datePickerRange[0].toLocaleDateString()} – ${datePickerRange[1].toLocaleDateString()}`
            : datePickerDate
              ? datePickerDate.toLocaleDateString()
              : 'None'}
        </div>
      </section>
      
      {/* Size Variants */}
      <section className={styles['demo-section']}>
        <h2>Size Variants</h2>
        <p>Different size options for the dropdown menu.</p>
        
        <div className={styles['demo-example']}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <DropdownMenu size="small">
              <DropdownMenu.Trigger asChild>
                <Button size="small">Small</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Item 1" />
                <DropdownMenu.ItemButton label="Item 2" />
                <DropdownMenu.ItemButton label="Item 3" />
              </DropdownMenu.Content>
            </DropdownMenu>
            
            <DropdownMenu size="medium">
              <DropdownMenu.Trigger asChild>
                <Button size="medium">Medium</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Item 1" />
                <DropdownMenu.ItemButton label="Item 2" />
                <DropdownMenu.ItemButton label="Item 3" />
              </DropdownMenu.Content>
            </DropdownMenu>
            
            <DropdownMenu size="large">
              <DropdownMenu.Trigger asChild>
                <Button size="large">Large</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Item 1" />
                <DropdownMenu.ItemButton label="Item 2" />
                <DropdownMenu.ItemButton label="Item 3" />
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
      </section>
      
      {/* Controlled Example */}
      <section className={styles['demo-section']}>
        <h2>Controlled Mode</h2>
        <p>Menu with controlled open state.</p>
        
        <div className={styles['demo-example']}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenu.Trigger asChild>
                <Button variant="outlined">Controlled Menu</Button>
              </DropdownMenu.Trigger>
              
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Option 1" />
                <DropdownMenu.ItemButton label="Option 2" />
                <DropdownMenu.ItemButton label="Option 3" />
              </DropdownMenu.Content>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Close' : 'Open'} Programmatically
            </Button>
          </div>
        </div>
        
        <div className={styles['demo-info']}>
          Menu is currently: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
        </div>
      </section>
      
      {/* Disabled State */}
      <section className={styles['demo-section']}>
        <h2>Disabled States</h2>
        <p>Disabled menu and disabled items.</p>
        
        <div className={styles['demo-example']}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <DropdownMenu disabled>
              <DropdownMenu.Trigger asChild>
                <Button variant="outlined">Disabled Menu</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Item 1" />
              </DropdownMenu.Content>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outlined">Disabled Items</Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.ItemButton label="Enabled Item" />
                <DropdownMenu.ItemButton label="Disabled Item" disabled />
                <DropdownMenu.ItemButton label="Another Enabled" />
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Positioning & Flipping */}
      <section className={styles['demo-section']}>
        <h2>Positioning & Flipping</h2>
        <p>The menu automatically flips when it reaches viewport edges.</p>
        
        <div className={styles['demo-example']} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined">Flip Right (Start {'->'} End)</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              <DropdownMenu.ItemButton label="This menu flips to 'end' alignment" />
              <DropdownMenu.ItemButton label="if there is no space on the right" />
            </DropdownMenu.Content>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outlined">Flip Left (End {'->'} Start)</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.ItemButton label="This menu flips to 'start' alignment" />
              <DropdownMenu.ItemButton label="if there is no space on the left" />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        <div className={styles['demo-example']} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <p>Try scrolling or resizing the window to see flipping in action.</p>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="contained">Auto Flip Top/Bottom</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="bottom" align="center">
              <DropdownMenu.ItemButton label="Item 1" />
              <DropdownMenu.ItemButton label="Item 2" />
              <DropdownMenu.ItemButton label="Item 3" />
              <DropdownMenu.ItemButton label="Item 4" />
              <DropdownMenu.ItemButton label="Item 5" />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
