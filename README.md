# Viking website — revised design

Run `npm install` then `npm start` to preview at http://localhost:3026. Run `npm run build` to create the public `dist` folder. Netlify settings are included in netlify.toml.

## Publishing
Connect the client-owned repository to Netlify. Enable Netlify form detection before deploying. This site includes a static HTML form named `estimate`, with honeypot protection and a thank-you page. In Netlify, configure form submission email notifications to the confirmed client inbox, then submit an actual test and verify both the saved entry and email delivery. Local previews intentionally do not send requests or store customer information. Hosting on a platform other than Netlify requires a real form endpoint; do not deploy this form unchanged to another static host.

The public build includes only pages, styles, browser JavaScript, and images. It excludes server code, worksheets and data/leads.json. The former local customer-file storage is no longer used.

## Content and handoff
The page now contains its content directly in index.html for reliable rendering and indexing. Edit index.html for live copy. site-config.json is retained as a historical content reference, not a live editor. CONTENT-WORKSHEET.md is the original agent worksheet and may contain superseded copy.

Confirm the phone number, service@vikingconstructionct.com inbox, service area, photo permissions and business naming before launch. Supplied images contain licensing claims and HIC number; verify those with the client before public use. Standalone licensing claims were not carried into the revised text pending confirmation. No reviews or ratings have been invented.

Domain and DNS have not been changed. Preserve Google Workspace mail records when connecting the domain. Accounts and billing should belong to the client.

## Selected design
Mobile concept 3: dark navy service chooser, four photo service tiles, horizontally scrollable recent work, collapsible mobile navigation, and fixed call/estimate actions. Service tiles preselect the estimate service. Photos and logo are from the original supplied project.
