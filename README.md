# Friend of a Friend Dinner

A minimal, elegant website for documenting a monthly dinner series where friends bring friends.

## Quick Start

1. Open `index.html` in a browser, or
2. Deploy to GitHub Pages / Vercel / Netlify

## Adding a New Dinner

Edit `data/dinners.json` and add a new entry to the `dinners` array:

```json
{
  "id": "restaurant-month-year",
  "restaurant": "Restaurant Name",
  "date": "YYYY-MM-DD",
  "location": "City, State",
  "description": "A brief, evocative description of the evening.",
  "photos": [
    {
      "src": "images/restaurant-month-year/photo1.jpg",
      "alt": "Description of the photo"
    }
  ]
}
```

### Adding Photos

1. Create a folder in `images/` named after the dinner (e.g., `images/ayah-january-2026/`)
2. Add your photos to that folder
3. Reference them in the JSON file
4. Recommended: Use descriptive alt text for accessibility

### Photo Tips

- Recommended aspect ratio: 4:3 (landscape)
- Suggested resolution: 1200-1600px on the long edge
- Compress images for web (tools: Squoosh, ImageOptim)
- Formats: JPG for photos, PNG for graphics

## Project Structure

```
friendofafriendwebsite/
├── index.html          # Main page
├── css/
│   └── styles.css      # All styling
├── js/
│   └── main.js         # Dynamic content & lightbox
├── data/
│   └── dinners.json    # Dinner data (edit this!)
├── images/
│   └── [dinner-id]/    # Photos organized by dinner
└── README.md
```

## Deployment

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select the branch to deploy from
4. Your site will be live at `https://username.github.io/repo-name`

### Vercel

1. Connect your GitHub repo to Vercel
2. Deploy with default settings
3. Done!

## Customization

### Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
  --color-cream: #FAF8F5;       /* Background */
  --color-charcoal: #2C2C2C;    /* Text */
  --color-accent: #8B7355;      /* Accent color */
  /* ... */
}
```

### Fonts

The site uses:
- **Cormorant Garamond** for headings (elegant serif)
- **Inter** for body text (clean sans-serif)

Change fonts in the `<head>` of `index.html` and update `--font-serif` / `--font-sans` in CSS.

## License

Personal project. Feel free to adapt for your own dinner series.
