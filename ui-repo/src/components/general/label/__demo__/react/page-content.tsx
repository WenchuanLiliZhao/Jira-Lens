import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Label } from '../../the-component';
import { chartRainbow, chartNeutral } from '../../../../../global-styles/colors';

/**
 * Label Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the Label component.
 */
const PageContent: React.FC = () => {
  const [tags, setTags] = useState(['frontend', 'react', 'typescript', 'docs']);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles["component-demo-container"]}>
      <h1>Label Component Demo</h1>
      
      {/* Basic Colors */}
      <section className={styles["component-demo-section"]}>
        <h2>Basic Color Combinations</h2>
        <p>Labels with different color schemes using CSS variables from color.scss</p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label>Default</Label>
          
          <Label 
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Blue
          </Label>
          
          <Label 
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Green
          </Label>
          
          <Label 
            textColor={chartRainbow['orange-100']}
            backgroundColor={chartRainbow['orange-20']}
          >
            Orange
          </Label>
          
          <Label 
            textColor={chartRainbow['red-100']}
            backgroundColor={chartRainbow['red-20']}
          >
            Red
          </Label>
          
          <Label 
            textColor={chartRainbow['purple-100']}
            backgroundColor={chartRainbow['purple-20']}
          >
            Purple
          </Label>
          
          <Label 
            textColor="#FF1493"
            backgroundColor="rgba(255, 20, 147, 0.15)"
          >
            Custom CSS
          </Label>
        </div>
      </section>

      {/* Size Variants */}
      <section className={styles["component-demo-section"]}>
        <h2>Size Variants</h2>
        <p>Three size options: small (20px), medium (24px), large (28px)</p>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Label 
            size="small"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Small
          </Label>
          
          <Label 
            size="medium"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Medium (Default)
          </Label>
          
          <Label 
            size="large"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Large
          </Label>
        </div>
      </section>

      {/* Variants */}
      <section className={styles["component-demo-section"]}>
        <h2>Visual Variants</h2>
        <p>Filled (solid background) and outlined (border only) styles</p>
        
        <h3>Filled (Default)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label 
            variant="filled"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Filled Blue
          </Label>
          
          <Label 
            variant="filled"
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Filled Green
          </Label>
          
          <Label 
            variant="filled"
            textColor={chartRainbow['red-100']}
            backgroundColor={chartRainbow['red-20']}
          >
            Filled Red
          </Label>
        </div>
        
        <h3>Outlined</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label 
            variant="outlined"
            textColor={chartRainbow['blue-100']}
            borderColor={chartRainbow['blue-100']}
          >
            Outlined Blue
          </Label>
          
          <Label 
            variant="outlined"
            textColor={chartRainbow['green-100']}
            borderColor={chartRainbow['green-100']}
          >
            Outlined Green
          </Label>
          
          <Label 
            variant="outlined"
            textColor={chartRainbow['red-100']}
            borderColor={chartRainbow['red-100']}
          >
            Outlined Red
          </Label>
        </div>
      </section>

      {/* Icon Variations */}
      <section className={styles["component-demo-section"]}>
        <h2>Icon Variations</h2>
        <p>Labels can have startIcon, endIcon, or both simultaneously</p>
        
        <h3>Start Icon Only</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label 
            startIcon="check"
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Verified
          </Label>
          
          <Label 
            startIcon="info"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Information
          </Label>
          
          <Label 
            startIcon="star"
            textColor={chartRainbow['orange-100']}
            backgroundColor={chartRainbow['orange-20']}
          >
            Featured
          </Label>
        </div>
        
        <h3>End Icon Only</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label 
            endIcon="arrow_forward"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Next
          </Label>
          
          <Label 
            endIcon="cancel"
            textColor={chartRainbow['red-100']}
            backgroundColor={chartRainbow['red-20']}
          >
            Removable
          </Label>
          
          <Label 
            endIcon="done"
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Complete
          </Label>
        </div>
        
        <h3>Both Icons</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label 
            startIcon="label"
            endIcon="cancel"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Tag Item
          </Label>
          
          <Label 
            startIcon="check_circle"
            endIcon="close"
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Done Task
          </Label>
          
          <Label 
            startIcon="flag"
            endIcon="more_vert"
            textColor={chartRainbow['orange-100']}
            backgroundColor={chartRainbow['orange-20']}
          >
            Priority Item
          </Label>
        </div>
      </section>

      {/* Removable Labels */}
      <section className={styles["component-demo-section"]}>
        <h2>Removable Labels</h2>
        <p>Labels with onRemove callback become interactive. Click the icon to remove.</p>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Label
              key={tag}
              startIcon="label"
              textColor={chartRainbow['blue-100']}
              backgroundColor={chartRainbow['blue-20']}
              onRemove={() => removeTag(tag)}
            >
              {tag}
            </Label>
          ))}
          {tags.length === 0 && <p style={{ color: 'var(--chart-black-alpha-40-hex)' }}>All tags removed! Refresh to reset.</p>}
        </div>
      </section>

      {/* Real-World Examples */}
      <section className={styles["component-demo-section"]}>
        <h2>Real-World Examples</h2>
        <p>Common usage patterns matching DataTable requirements</p>
        
        <h3>Status Labels</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label
            size="small"
            startIcon="radio_button_unchecked"
            endIcon="cancel"
            textColor={chartNeutral['7']}
            backgroundColor={chartNeutral['2']}
          >
            To Do
          </Label>
          
          <Label
            size="small"
            startIcon="pending"
            endIcon="cancel"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            In Progress
          </Label>
          
          <Label
            size="small"
            startIcon="check_circle"
            endIcon="cancel"
            textColor={chartRainbow['green-100']}
            backgroundColor={chartRainbow['green-20']}
          >
            Done
          </Label>
        </div>
        
        <h3>Priority Badges</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label
            size="small"
            startIcon="flag"
            endIcon="cancel"
            textColor={chartNeutral['7']}
            backgroundColor={chartNeutral['2']}
          >
            Low
          </Label>
          
          <Label
            size="small"
            startIcon="flag"
            endIcon="cancel"
            textColor={chartRainbow['orange-100']}
            backgroundColor={chartRainbow['orange-20']}
          >
            Medium
          </Label>
          
          <Label
            size="small"
            startIcon="flag"
            endIcon="cancel"
            textColor={chartRainbow['red-100']}
            backgroundColor={chartRainbow['red-20']}
          >
            High
          </Label>
        </div>
        
        <h3>Tags</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Label
            size="small"
            startIcon="label"
            endIcon="cancel"
          >
            frontend
          </Label>
          
          <Label
            size="small"
            startIcon="label"
            endIcon="cancel"
          >
            react
          </Label>
          
          <Label
            size="small"
            startIcon="label"
            endIcon="cancel"
          >
            typescript
          </Label>
          
          <Label
            size="small"
            startIcon="label"
            endIcon="cancel"
          >
            docs
          </Label>
        </div>
      </section>

      {/* Size Comparison */}
      <section className={styles["component-demo-section"]}>
        <h2>All Sizes Side by Side</h2>
        <p>Visual comparison of all three sizes with icons</p>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Label
            size="small"
            startIcon="label"
            endIcon="cancel"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Small 20px
          </Label>
          
          <Label
            size="medium"
            startIcon="label"
            endIcon="cancel"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Medium 24px
          </Label>
          
          <Label
            size="large"
            startIcon="label"
            endIcon="cancel"
            textColor={chartRainbow['blue-100']}
            backgroundColor={chartRainbow['blue-20']}
          >
            Large 28px
          </Label>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
