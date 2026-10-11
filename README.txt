R26-DS-002 research website
===========================

Open index.html in a browser to view the site. It is plain HTML, CSS and JavaScript:
no build step and no external services. The whole site is under 1 MB.

Folder structure
  index.html                 the single page (Home, Domain, Milestones, Documents,
                             Presentations, About us, Contact us)
  assets/css/style.css       all styling (light and dark themes)
  assets/js/main.js          small scripts: theme, text size, menu, hero animation,
                             milestone drop-down, contact form
  assets/fonts/              self-hosted fonts (IBM Plex Sans, Noto Sans Sinhala)
  assets/img/team/           member photos (square, 360 x 360)
  docs/                      documents and slides (currently placeholders)

What to replace before publishing
  1. Documents and slides: put the real PDF in docs/ with the SAME file name,
     e.g. docs/thesis-IT22259134.pdf. To use a Google Drive link instead,
     change the href in index.html (search for the file name).
     Pending items: change <li class="is-pending"> to a normal row with a View link.
  2. Member photos: square images in assets/img/team/ (about 360 x 360).
  3. LinkedIn: search index.html for https://www.linkedin.com/ (4 places).
  4. Emails: member emails, supervisor emails (supervisor@sliit.lk,
     cosupervisor@sliit.lk), group email r26ds002.research@gmail.com
     (also in assets/js/main.js, TEAM_EMAIL) and the phone number.
  5. Milestones: dates, marks and status are inside each <article class="ms-panel">
     and the dates are repeated in the timeline buttons (<ol class="ms-track">).
