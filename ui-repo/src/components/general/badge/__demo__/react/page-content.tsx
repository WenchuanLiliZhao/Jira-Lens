import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Badge } from '../../the-component';
import { Icon } from '../../../icon';
import { Button } from '../../../button';

/**
 * Badge Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the Badge component.
 */
const PageContent: React.FC = () => {
  const [count, setCount] = useState(5);

  return (
    <div className={styles["component-demo-container"]}>
      <h1>Badge Component Demo</h1>

      {/* Dot vs Standard */}
      <section className={styles["component-demo-section"]}>
        <h2>Variants</h2>
        <p>Dot: presence-only indicator. Standard: shows count or text.</p>
        <div className={styles["demo-row"]} style={{ gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={1} variant="dot">
              <span className={styles["icon-button"]}>
                <Icon icon="notifications" />
              </span>
            </Badge>
            <span>Dot</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={5} variant="standard">
              <span className={styles["icon-button"]}>
                <Icon icon="mail" />
              </span>
            </Badge>
            <span>Standard</span>
          </div>
        </div>
      </section>

      {/* Wrapping Icon */}
      <section className={styles["component-demo-section"]}>
        <h2>On Icon</h2>
        <p>Badge overlays an icon button.</p>
        <div className={styles["demo-row"]}>
          <Badge badgeContent={3}>
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
          <Badge badgeContent={12}>
            <span className={styles["icon-button"]}>
              <Icon icon="shopping_cart" />
            </span>
          </Badge>
          <Badge badgeContent={1} variant="dot">
            <span className={styles["icon-button"]}>
              <Icon icon="notifications" />
            </span>
          </Badge>
        </div>
      </section>

      {/* Wrapping Button */}
      <section className={styles["component-demo-section"]}>
        <h2>On Button</h2>
        <p>Badge overlays a text button.</p>
        <div className={styles["demo-row"]}>
          <Badge badgeContent={count}>
            <Button variant="contained" startIcon="mail" onClick={() => setCount(c => c + 1)}>
              Messages
            </Button>
          </Badge>
          <Badge badgeContent={0} showZero>
            <Button variant="outlined" startIcon="shopping_cart">
              Cart
            </Button>
          </Badge>
        </div>
      </section>

      {/* showZero and max */}
      <section className={styles["component-demo-section"]}>
        <h2>showZero and max</h2>
        <p>showZero: display badge when count is 0. max: cap displayed number (e.g. 99+).</p>
        <div className={styles["demo-row"]}>
          <Badge badgeContent={0} showZero>
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
          <Badge badgeContent={99} max={99}>
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
          <Badge badgeContent={150} max={99}>
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
        </div>
      </section>

      {/* Colors */}
      <section className={styles["component-demo-section"]}>
        <h2>Colors</h2>
        <div className={styles["demo-row"]}>
          <Badge badgeContent={5} color="default">
            <span className={styles["icon-button"]}>
              <Icon icon="settings" />
            </span>
          </Badge>
          <Badge badgeContent={5} color="primary">
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
          <Badge badgeContent={5} color="error">
            <span className={styles["icon-button"]}>
              <Icon icon="notifications" />
            </span>
          </Badge>
          <Badge badgeContent={5} color="info">
            <span className={styles["icon-button"]}>
              <Icon icon="info" />
            </span>
          </Badge>
          <Badge badgeContent={5} color="warning">
            <span className={styles["icon-button"]}>
              <Icon icon="warning" />
            </span>
          </Badge>
        </div>
      </section>

      {/* Anchor positions */}
      <section className={styles["component-demo-section"]}>
        <h2>Anchor Origin</h2>
        <p>Badge position relative to the wrapped element.</p>
        <div className={styles["demo-row"]} style={{ gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <span className={styles["icon-button"]}>
                <Icon icon="mail" />
              </span>
            </Badge>
            <span>Top Right</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={3} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <span className={styles["icon-button"]}>
                <Icon icon="mail" />
              </span>
            </Badge>
            <span>Top Left</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <span className={styles["icon-button"]}>
                <Icon icon="mail" />
              </span>
            </Badge>
            <span>Bottom Right</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Badge badgeContent={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
              <span className={styles["icon-button"]}>
                <Icon icon="mail" />
              </span>
            </Badge>
            <span>Bottom Left</span>
          </div>
        </div>
      </section>

      {/* invisible */}
      <section className={styles["component-demo-section"]}>
        <h2>Invisible</h2>
        <p>Force hide the badge with invisible prop.</p>
        <div className={styles["demo-row"]}>
          <Badge badgeContent={5} invisible>
            <span className={styles["icon-button"]}>
              <Icon icon="mail" />
            </span>
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
