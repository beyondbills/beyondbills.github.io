# Prompt

I am building an ideological think tank called "Beyond Bills". Its mission is to advocate for a shift from a fiat-currency economy to a service-based economy where a global network of individuals and companies provisions a conglomerate in which every adult has one job, works from 9 to 1, and gets all life essentials as remuneration. Note that "Beyond Bills" will eventually be structured as a NGO.

Build a static website for the "Beyond Bills" enterprise. It should be slick and smooth using a diversity of colors and must support multiple languages. The website code goes in the index.html root file. You should also generate a README.md file that contains all necessary information. All the assets to use are in the 'assets' root directory. The 'assets' directory contains the contents of the manifesto to publish on the site both in pdf and html formats and their filenames end in the name of the language supported by the contents. That is how you know all the supported languages. The 'assets' folder also contains the background image known by its explicit name as well as hero images in all the supported languages. Note that we plan to add more languages later.

The hero message is: "Beyond Bills imagines a post-currency economy where technology frees people from excessive work, every adult contributes through one ability-suited job, and a global network directly provisions life's essentials—turning four hours of meaningful work into more time, security, dignity, and human possibility."

Provison three sections: the hero section, the manifesto section, and the "join community" form section. The form section should be navigated to using the '#community' appended to the url. The manifesto section leads with the summary of the manifesto and allows the user to navigate to the html version of the manifesto. For each HTML version of the manifesto, improve the HTML code to extract headings and subheadings to be accessible from a menu that shrinks in a standard hamburger icon at the top of the file in the navigation bar. The hamburger menu should be implemented as a left sidebar on all devices. Along with the hamburger icon should be three icons, that is, 'back to site', 'copy link', and 'download' icons, allowing the user to go back to main site, to copy the link to the HTML version of the manifesto, and to download the PDF version of the manifesto, respectfully. Improve the font family and the font size to make the HTML manifesto readable and slick on all types of devices. Prioritize the 'Nunito' font-family, available using this html line of code: `<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">`. Remove all the per-manifesto CSS and Javascript code to centralize them, leaving only the text content which you will properly display as a well-organized html reading material with generally same central design. Headings and subheadings should be well placed so that a reader reads through conveniently.

Use animations (AOS library and more) and TailwindCSS but avoid using curved corners. It must have a navigation bar that leads to the different sections in the code along with a contact menu item that leads to a section that gives the contact information and a form to fill in to send a message using formsubmit.co to onkezabahizi@gmail.com. The contact form has three fields: Subject (input), Phone (input), Message (text area). Add inline validations for the form making sure even the phone number is validated as full phone number with the country code and indicating that it should preferably be a WhatsApp number. The form labels should end with a red star to indicate that they are mandatory. The website must also be responsive both on big, medium, and small devices. In the 'assets' folder, infer the use of the images from their file names.

Use the Google language icon for the button that gives a dropdown menu of all supported languages to switch to. Use ISO language codes as query values on URLS in such a way that navigating to the URL leads to the version of the contents in that language.

Add Search Engine Optimization (SEO) features all over the site so that search engine finds the site easily.
Use beautiful slick visible icons all over the site and do not forget the footer that says: © 'Current Year' Beyond Bills.
Fot the motto '9 to 1. One job. No bills. Together', find the equivalent in all the supported languages in the corresponding manifesto files.

# Default Language detection

In the following sample we seek to detect whether a user is in a French speaking country. Patern the rest of the languages after this code to figure out the default language in which to serve the website contents. Serve English as the default language for a user who is located in a country whose official language is not supported. Sample code:
```
function preciseDefaultLanguage()
{
        let isFr = "en";

        // Set containing official/co-official French speaking country ISO 2-letter codes 
        const frenchSpeakingCountries = new Set([
                'FR', 'CA', 'CD', 'MG', 'CM', 'CI', 'NE', 'BF', 'ML', 'SN', 'TD', 'GN', 'RW', 'BI', 
                'BJ', 'HT', 'CH', 'TG', 'CF', 'CG', 'GA', 'DJ', 'GQ', 'KM', 'LU', 'VU', 'SC', 'MC', 'BE'
        ]);

        try {
                                        
                // Call the geojs.io combined data endpoint asynchronously
                const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
                if (!response.ok) throw new Error('API server unreachable');
                                        
                const data = await response.json();

                // Extract variables out of the geojs payload
                const countryCode = data.country_code ? data.country_code.toUpperCase() : null;

                // Evaluate whether the extracted country is French-speaking
                if (countryCode && frenchSpeakingCountries.has(countryCode)) {
                        isFr = "fr";
                } 

        } catch (error) {
                console.error("GeoJS Error: ", error);
                isFr = null;
        }

        return isFr;
}
```

N.B: All the behavior should be consistent in all the supported languages.

# More behavior 1

1. Remove the 'Contact' section, the 'Join Community' form section is enough. Edit the 'Join Community' section form to add
'Phone, preferably WhatsApp' input field as mandatory below email as well as inline validations accordingly.
2. Make the menu bar of the manifesto html version more slick, smooth, and engaging.
NB: Make sure the new behavior is consistent in all languages.