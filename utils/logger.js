// utils/logger.js
class LiveLogger {
  constructor() {
    this.logs = [];
    this.logWindow = null;
    this.logWindowInterval = null;
    this.pendingLogs = [];
    this.windowBlocked = false;
  }

  ensureLogWindow() {
    // Only try to open if we don't know it's blocked yet
    if (!this.logWindow && !this.windowBlocked) {
      try {
        this.logWindow = window.open('', '_blank', 'width=800,height=600');

        // If popup was blocked
        if (!this.logWindow || this.logWindow.closed) {
          this.windowBlocked = true;
          console.warn('Log window blocked by browser. Showing logs in console instead.');
          return;
        }

        this.logWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Analytics Live Log</title>
            <style>
              body { font-family: monospace; margin: 0; padding: 10px; }
              .log-entry { margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #eee; }
              .log-entry pre { margin: 0; }
            </style>
          </head>
          <body>
            <h2>Live Analytics Log</h2>
            <button id="close-btn" style="position:fixed;top:10px;right:10px;">Close</button>
            <div id="log-container"></div>
            <script>
              document.getElementById('close-btn').addEventListener('click', () => {
                window.close();
              });
            </script>
          </body>
          </html>
        `);

        this.logWindowInterval = setInterval(() => {
          this.updateLogWindow();
        }, 500);

        // Process any logs that came in before window opened
        if (this.pendingLogs.length > 0) {
          this.logs.push(...this.pendingLogs);
          this.pendingLogs = [];
          this.updateLogWindow();
        }
      } catch (e) {
        this.windowBlocked = true;
        console.error('Could not open log window:', e);
      }
    }
  }

  log(eventData) {
    const entry = {
      timestamp: new Date().toISOString(),
      ...eventData
    };

    if (this.logWindow && !this.logWindow.closed) {
      this.logs.push(entry);
      this.updateLogWindow();
    } else {
      // Store logs until window is ready
      this.pendingLogs.push(entry);
      this.ensureLogWindow();

      // Fallback to console
      console.log('Analytics Log:', entry);
    }
  }

  updateLogWindow() {
    if (this.logWindow && !this.logWindow.closed) {
      try {
        const container = this.logWindow.document.getElementById('log-container');
        if (container) {
          container.innerHTML = this.logs
            .map(log => `
              <div class="log-entry">
                <pre>${JSON.stringify(log, null, 2)}</pre>
              </div>
            `)
            .join('');
          container.scrollTop = container.scrollHeight;
        }
      } catch (e) {
        // Window was closed
        this.logWindow = null;
        clearInterval(this.logWindowInterval);
      }
    }
  }

  clear() {
    this.logs = [];
    this.pendingLogs = [];
    this.updateLogWindow();
  }
}

// Initialize with lazy loading
export const logger = new LiveLogger();

// Safe initialization after user interaction
export function initLogger() {
  logger.ensureLogWindow();
}
