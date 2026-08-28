# Beyond Bills Static Website

Beyond Bills is a static multilingual website for an emerging NGO and ideological think tank advocating a post-currency, service-based economy.

## Files

- `index.html`: the full public landing site, including language switching, SEO metadata, navigation, manifesto links, community form, and default language detection.
- `assets/manifesto.css`: shared styling for all HTML manifesto readers.
- `assets/manifesto.js`: shared manifesto sidebar, copy-link action, and icon initialization.
- `assets/Beyond_Bills_Manifesto_[Language].html`: readable manifesto pages for each supported language.
- `assets/Beyond_Bills_Manifesto_[Language].pdf`: downloadable manifesto PDFs.
- `assets/Beyond_Bills_Hero_Image_[Language].png`: hero images matched to each language.
- `assets/Beyond_Bills_Background_Image.png`: main site background image.
- `assets/Beyond_Bills_Logo.png` and `assets/favicon.svg`: brand assets.

## Supported Languages

The current site supports:

- English: `?lang=en`
- French: `?lang=fr`
- Spanish: `?lang=es`
- German: `?lang=de`
- Italian: `?lang=it`
- Russian: `?lang=ru`
- Chinese: `?lang=zh`
- Arabic: `?lang=ar`

The language switcher uses ISO language codes in the URL query string. If no `lang` query value is present, the site calls GeoJS and maps the visitor country to a supported official language. English is used when no supported official language is detected or the lookup fails.

## Forms

The Join Community form submits to FormSubmit:

```text
https://formsubmit.co/onkezabahizi@gmail.com
```

The community form contains these required fields:

- Name
- Email
- Phone, preferably WhatsApp
- How would you like to contribute?

Phone validation expects a full international number with country code, such as `+250788123456`.

## Adding A Language

Add these files to `assets` using the existing naming convention:

```text
Beyond_Bills_Hero_Image_[Language].png
Beyond_Bills_Manifesto_[Language].html
Beyond_Bills_Manifesto_[Language].pdf
```

Then add one entry in the `LANGUAGE_CONFIG` object inside `index.html`, with:

- ISO code
- display name
- asset language name
- text direction
- locale
- translated motto
- translated interface strings

If the language should be selected automatically by country, also add the relevant ISO 3166-1 alpha-2 country codes to `countryLanguageSets`.

## Manifesto Reader

Each manifesto page uses one shared reader layout:

- left sidebar generated from `h1`, `h2`, and `h3` headings
- hamburger menu on all devices
- animated reader progress bar
- active section highlighting
- back-to-site action
- copy-link action
- PDF download action
- shared Nunito typography
- responsive reading width

The manifesto HTML files should keep only content inside the shared reader shell. Styling and behavior belong in `assets/manifesto.css` and `assets/manifesto.js`.

## Libraries

The website uses CDN-loaded libraries:

- TailwindCSS
- AOS animation library
- Google Fonts Nunito
- Google Material Symbols
- Lucide icons for manifesto reader actions

Because these are CDN resources, the richest visual behavior requires an internet connection.