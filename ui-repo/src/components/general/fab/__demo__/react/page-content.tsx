import React from 'react';
import styles from './styles.module.scss';
import { FAB } from '../../the-component';
import { DropdownMenu } from '../../../dropdown-menu';

/**
 * FAB Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the FAB component.
 */
const PageContent: React.FC = () => {
  const handleClick = (label: string) => {
    alert(`${label} clicked`);
  };

  return (
    <div className={styles["component-demo-container"]}>
      <h1>FAB Component Demo</h1>
      
      {/* Variants Section */}
      <section className={styles["component-demo-section"]}>
        <h2>Variants</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <FAB icon="add" onClick={() => handleClick('Circular')} />
            <span>Circular</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <FAB variant="extended" icon="edit" label="Edit Item" onClick={() => handleClick('Extended')} />
            <span>Extended</span>
          </div>
        </div>
      </section>

      {/* Sizes Section */}
      <section className={styles["component-demo-section"]}>
        <h2>Sizes</h2>
        <h3>Circular</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <FAB size="small" icon="add" onClick={() => handleClick('Small')} />
          <FAB size="medium" icon="add" onClick={() => handleClick('Medium')} />
          <FAB size="large" icon="add" onClick={() => handleClick('Large')} />
        </div>
        <h3>Extended</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <FAB size="small" variant="extended" icon="add" label="Small" onClick={() => handleClick('Extended Small')} />
          <FAB size="medium" variant="extended" icon="add" label="Medium" onClick={() => handleClick('Extended Medium')} />
          <FAB size="large" variant="extended" icon="add" label="Large" onClick={() => handleClick('Extended Large')} />
        </div>
      </section>

      {/* Colors Section */}
      <section className={styles["component-demo-section"]}>
        <h2>Colors</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <FAB color="primary" icon="favorite" onClick={() => handleClick('Primary')} />
          <FAB color="secondary" icon="share" onClick={() => handleClick('Secondary')} />
          <FAB color="success" icon="check" onClick={() => handleClick('Success')} />
          <FAB color="error" icon="delete" onClick={() => handleClick('Error')} />
          <FAB color="info" icon="info" onClick={() => handleClick('Info')} />
          <FAB color="warning" icon="warning" onClick={() => handleClick('Warning')} />
          <FAB color="default" icon="settings" onClick={() => handleClick('Default')} />
        </div>
      </section>

      {/* States Section */}
      <section className={styles["component-demo-section"]}>
        <h2>States</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <FAB icon="add" />
            <span>Normal</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <FAB icon="add" disabled />
            <span>Disabled</span>
          </div>
        </div>
      </section>

      {/* As Link Section */}
      <section className={styles["component-demo-section"]}>
        <h2>As Link</h2>
        <p>Renders as an <code>&lt;a&gt;</code> tag when <code>href</code> is provided.</p>
        <FAB icon="launch" label="Google" href="https://google.com" target="_blank" />
      </section>

      {/* With Dropdown Menu Section */}
      <section className={styles["component-demo-section"]}>
        <h2>With Dropdown Menu</h2>
        <p>FAB can be used as a trigger for a <code>DropdownMenu</code>.</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <FAB icon="more_vert" color="primary" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.ItemButton label="Edit" icon="edit" onSelect={() => handleClick('Edit')} />
              <DropdownMenu.ItemButton label="Share" icon="share" onSelect={() => handleClick('Share')} />
              <DropdownMenu.Separator />
              <DropdownMenu.ItemButton label="Delete" icon="delete" onSelect={() => handleClick('Delete')} />
            </DropdownMenu.Content>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <FAB variant="extended" icon="settings" label="Options" color="secondary" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              <DropdownMenu.Label>Settings</DropdownMenu.Label>
              <DropdownMenu.ItemButton label="Account" icon="person" />
              <DropdownMenu.ItemButton label="Privacy" icon="lock" />
              <DropdownMenu.ItemButton label="Help" icon="help" />
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </section>

      {/* Floating Example */}
      <section className={styles["component-demo-section"]}>
        <h2>Floating Context</h2>
        <p>Typically used at the bottom right of a container.</p>
        <div style={{ 
          height: '200px', 
          width: '100%', 
          border: '1px solid #ccc', 
          position: 'relative', 
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          <div style={{ padding: '20px' }}>Scrollable content...</div>
          <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
            <FAB color="primary" icon="add" onClick={() => handleClick('Floating')} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
