import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Modal } from '../../the-component';
import { Button } from '../../../../general/button';

/**
 * Modal Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the Modal component.
 */
const PageContent: React.FC = () => {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className={styles['component-demo-container']}>
      <h1>Modal Component Demo</h1>

      {/* Header / Body / Footer Layout */}
      <section className={styles['component-demo-section']}>
        <h2>Header / Body / Footer Layout</h2>
        <p>
          A Modal has three parts: <strong>Header</strong> (title), <strong>Body</strong> (content),
          and <strong>Footer</strong> (action buttons). The top-right close button is built-in.
          Use Footer for confirm, cancel, or other action buttons.
        </p>
        <div className={styles['demo-row']}>
          <Modal>
            <Modal.Trigger>
              <Button variant="contained">View Layout</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Confirm Delete</Modal.Header>
              <Modal.Body>
                This action cannot be undone. Are you sure you want to delete this file?
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button variant="outlined">Cancel</Button>
                </Modal.Close>
                <Modal.Close>
                  <Button variant="contained" color="error">Delete</Button>
                </Modal.Close>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </div>
      </section>

      {/* Basic Usage */}
      <section className={styles['component-demo-section']}>
        <h2>Basic Usage</h2>
        <p>Click the button to open a modal. Close via the top-right button, overlay click, or Escape key.</p>
        <div className={styles['demo-row']}>
          <Modal>
            <Modal.Trigger>
              <Button variant="contained">Open Modal</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Modal Title</Modal.Header>
              <Modal.Body>
                This is the modal content. You can put any content here.
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      </section>

      {/* Controlled Mode */}
      <section className={styles['component-demo-section']}>
        <h2>Controlled Mode</h2>
        <p>Control the modal open state with open and onOpenChange props.</p>
        <div className={styles['demo-row']}>
          <Button variant="contained" onClick={() => setControlledOpen(true)}>
            Open Controlled Modal
          </Button>
          <Modal open={controlledOpen} onOpenChange={setControlledOpen}>
            <Modal.Content>
              <Modal.Header>Controlled Modal</Modal.Header>
              <Modal.Body>
                This modal is controlled by the parent. The open state is managed externally.
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      </section>

      {/* Size Variants */}
      <section className={styles['component-demo-section']}>
        <h2>Size Variants</h2>
        <p>Modal supports small, medium (default), and large sizes.</p>
        <div className={styles['demo-row']}>
          <Modal size="small">
            <Modal.Trigger>
              <Button variant="outlined">Small</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Small Modal</Modal.Header>
              <Modal.Body>Max width: 400px</Modal.Body>
            </Modal.Content>
          </Modal>
          <Modal size="medium">
            <Modal.Trigger>
              <Button variant="outlined">Medium</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Medium Modal</Modal.Header>
              <Modal.Body>Max width: 520px (default)</Modal.Body>
            </Modal.Content>
          </Modal>
          <Modal size="large">
            <Modal.Trigger>
              <Button variant="outlined">Large</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Large Modal</Modal.Header>
              <Modal.Body>Max width: 640px</Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      </section>

      {/* Close on Overlay Click */}
      <section className={styles['component-demo-section']}>
        <h2>Close on Overlay Click</h2>
        <p>When closeOnOverlayClick is false, clicking the overlay does not close the modal. Use the close button or Escape.</p>
        <div className={styles['demo-row']}>
          <Modal closeOnOverlayClick={false}>
            <Modal.Trigger>
              <Button variant="outlined">Modal (no overlay close)</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Must Use Button to Close</Modal.Header>
              <Modal.Body>
                Clicking outside will not close this modal. Use the close button (×) or press Escape.
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      </section>

      {/* Long Content */}
      <section className={styles['component-demo-section']}>
        <h2>Scrollable Content</h2>
        <p>The body scrolls when content exceeds the available height.</p>
        <div className={styles['demo-row']}>
          <Modal>
            <Modal.Trigger>
              <Button variant="outlined">Open Long Content</Button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>Scrollable Modal</Modal.Header>
              <Modal.Body>
                <p>Line 1</p>
                <p>Line 2</p>
                <p>Line 3</p>
                <p>Line 4</p>
                <p>Line 5</p>
                <p>Line 6</p>
                <p>Line 7</p>
                <p>Line 8</p>
                <p>Line 9</p>
                <p>Line 10</p>
                <p>Line 11</p>
                <p>Line 12</p>
                <p>Line 13</p>
                <p>Line 14</p>
                <p>Line 15</p>
                <p>Line 16</p>
                <p>Line 17</p>
                <p>Line 18</p>
                <p>Line 19</p>
                <p>Line 20</p>
                <p>Line 21</p>
                <p>Line 22</p>
                <p>Line 23</p>
                <p>Line 24</p>
                <p>Line 25</p>
                <p>Line 26</p>
                <p>Line 27</p>
                <p>Line 28</p>
                <p>Line 29</p>
                <p>Line 30</p>
                <p>Line 31</p>
                <p>Line 32</p>
                <p>Line 33</p>
                <p>Line 34</p>
                <p>Line 35</p>
                <p>Line 36</p>
                <p>Line 37</p>
                <p>Line 38</p>
                <p>Line 39</p>
                <p>Line 40</p>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
