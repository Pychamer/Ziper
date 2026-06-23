# Facebook Marketplace New Listing Notifier (Extension)

## What it does
- Monitors one Facebook Marketplace tab.
- Forces URL-based reloads (not normal refresh) by navigating to the Marketplace URL with a changing query parameter.
- Sends **only** this JSON payload to your webhook for each unseen listing:

```json
{
  "title": "Listing title",
  "url": "https://www.facebook.com/marketplace/item/...",
  "price": "$123"
}
```

## Load unpacked extension
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `facebook-marketplace-notifier-extension` folder from this repository.

## Use
1. Open the Marketplace page you want to monitor.
2. Click the extension icon.
3. Set:
   - Marketplace URL
   - Webhook URL
   - Refresh interval (seconds)
4. Click **Save + Start**.
5. Approve the webhook host permission prompt when Chrome asks.

## Notes
- Keep the monitored tab open.
- Use one extension config per tab.
- `Stop` clears monitoring and seen-listing cache for that tab.
