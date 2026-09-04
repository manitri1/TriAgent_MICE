// Google Apps Script: createStrategyForm()
// Paste this code into script.google.com (New project) and run createStrategyForm()

function createStrategyForm() {
  var title = 'Pohang MICE Academy — Strategy Plan Submission';
  var description = ''
    + 'Submit your team\'s strategy plan for the Pohang content discovery contest. '
    + 'Follow the template sections (Executive Summary, Why, Brand, Objectives, Target, Positioning, Impact, How, KPI, Roadmap, Budget, Risks, Stakeholders, Deliverables). '
    + 'Submission deadline: 2026-10-20 23:59. If you cannot upload files, provide a public link (Drive/Dropbox) in the form.';

  var form = FormApp.create(title).setDescription(description);
  form.setCollectEmail(true);
  form.setConfirmationMessage('Thank you — your proposal has been received. Selected finalists will be notified by 2026-10-28.');

  form.addTextItem().setTitle('Team name (or Individual name)').setRequired(true).setHelpText('Team name; for individuals enter your name.');
  form.addTextItem().setTitle('Representative name').setRequired(true).setHelpText('Full name of team representative.');
  form.addTextItem().setTitle('Representative email').setRequired(true).setHelpText('We will contact finalists via email.');
  form.addTextItem().setTitle('Representative contact (phone)').setRequired(true).setHelpText('Mobile number for contact during selection and event.');
  form.addTextItem().setTitle('Affiliation / Organization / University').setHelpText('e.g., Pohang University, Local resident, Company.');
  form.addParagraphTextItem().setTitle('Team members (names, max 4)').setHelpText('Comma-separated names; for individual leave blank.');

  form.addTextItem().setTitle('Document title (e.g. [Event] - Strategy by Team)').setRequired(true);
  form.addTextItem().setTitle('Document date (YYYY-MM-DD)').setRequired(true);
  form.addTextItem().setTitle('Project / Event name (e.g. Pohang MICE Academy)').setRequired(true);
  form.addTextItem().setTitle('Event date & venue (e.g. 2026-11-03 18:00 · Parangtteul 2F)').setRequired(true);

  form.addParagraphTextItem().setTitle('Executive Summary (150-250 chars)').setRequired(true).setHelpText('What is your proposal? Who benefits? What value will it create? (150-250 chars)');
  form.addParagraphTextItem().setTitle('Why (Background & Problem Definition, 200-400 chars)').setRequired(true).setHelpText('Why is this needed? What gap or demand does it address? Provide evidence/observation.');

  form.addTextItem().setTitle('Brand name (recommended)').setRequired(true);
  form.addParagraphTextItem().setTitle('Alternative brand names (2-3) and 2 taglines').setHelpText('List alternatives and two short taglines (2-6 words each).');

  form.addParagraphTextItem().setTitle('Objectives — Quantitative (SMART) and Qualitative').setRequired(true).setHelpText('List quantitative goals (numbers & deadlines) and qualitative goals (networking, prototypes, follow-up).');
  form.addParagraphTextItem().setTitle('Target — Primary & Secondary (who & motivation)').setRequired(true).setHelpText('Define primary target (who to recruit) and secondary (partners, stakeholders). For each: why would they participate?');
  form.addParagraphTextItem().setTitle('Positioning & Direction (what makes this different?)').setRequired(true).setHelpText('Describe the hub/role you want to create and the core principles (accessibility, feasibility, sustainability).');
  form.addParagraphTextItem().setTitle('Impact — Short/Mid/Long term (0-3 months / 3-12 months / 1 year+)').setRequired(true).setHelpText('Be as specific as possible (metrics if available).');
  form.addParagraphTextItem().setTitle('Strategy — Channels, Judging & Support, Operations, Resources').setRequired(true).setHelpText('For each of the 4 areas, describe WHAT, WHO, WHEN, and HOW.');
  form.addParagraphTextItem().setTitle('KPI & Measurement (list input/activity/output/outcome/impact)').setHelpText('For each KPI add: metric | target | measurement method | owner');
  form.addParagraphTextItem().setTitle('Roadmap (D-90, D-60, D-30, D-7, D-Day, D+14)').setRequired(true).setHelpText('Add dates and a short description for each milestone.');
  form.addParagraphTextItem().setTitle('Budget summary (allocate remaining budget by item and justify)').setHelpText('Example: Equipment 120,000 KRW — reason: projector rental.');
  form.addParagraphTextItem().setTitle('Top 5 Risks & Mitigations (brief)').setRequired(true).setHelpText('List up to 5 major risks (e.g., low signups, AV failure) and Plan B for each.');
  form.addParagraphTextItem().setTitle('Stakeholders — Who & role & contact (table)').setHelpText('Provide stakeholder | role | contact notes.');
  form.addParagraphTextItem().setTitle('Deliverables (pre / during / post)').setHelpText('List concrete outputs (program, participant list, videos, press release, final report).');
  form.addTextItem().setTitle('Submission file (public link if upload impossible)').setHelpText('Provide a public link (Google Drive/Dropbox) OR upload file below.');

  try {
    var uploadItem = form.addFileUploadItem().setTitle('Attach detailed proposal (PDF / PPTX, max 10MB)').setHelpText('If you cannot upload, provide a public link in the previous question. Note: file uploads require Google sign-in.');
  } catch(e) {
    Logger.log('File upload creation failed: ' + e.message);
  }

  form.addMultipleChoiceItem().setTitle('Preferred presentation format').setChoices([
    form.createChoice('Live on-site'),
    form.createChoice('Pre-recorded video'),
    form.createChoice('Slide + demo')
  ]).setRequired(true);

  form.addParagraphTextItem().setTitle('Technical requirements (power, network, special equipment)').setHelpText('List any AV/equipment needs.');
  form.addMultipleChoiceItem().setTitle('Consent to use photos/videos for promotion').setChoices([
    form.createChoice('Yes - I agree'),
    form.createChoice('No - I do not agree')
  ]).setRequired(true);

  form.addMultipleChoiceItem().setTitle('Interested in mentorship / follow-up support?').setChoices([
    form.createChoice('Yes'),
    form.createChoice('No'),
    form.createChoice('Maybe later')
  ]);

  form.addMultipleChoiceItem().setTitle('How did you hear about us?').setChoices([
    form.createChoice('University'),
    form.createChoice('SNS'),
    form.createChoice('Poster'),
    form.createChoice('Friend/Colleague'),
    form.createChoice('Other')
  ]);

  form.addParagraphTextItem().setTitle('Additional notes / comments').setHelpText('Anything else you want the reviewers to know.');

  form.addCheckboxItem().setTitle('Submission agreement (originality & acceptance of terms)').setChoices([
    form.createChoice('I confirm this submission is original and we agree to the evaluation rules and promotional use if selected')
  ]).setRequired(true);

  form.setAcceptingResponses(true);
  form.setAllowResponseEdits(false);
  form.setShuffleQuestions(false);

  var ss = SpreadsheetApp.create(title + ' — Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  PropertiesService.getScriptProperties().setProperty('STRATEGY_FORM_ID', form.getId());

  Logger.log('Form edit URL: ' + form.getEditUrl());
  Logger.log('Form live URL: ' + form.getPublishedUrl());
  Logger.log('Responses spreadsheet URL: ' + ss.getUrl());
}

function closeStrategyForm() {
  var id = PropertiesService.getScriptProperties().getProperty('STRATEGY_FORM_ID');
  if (!id) { Logger.log('No form id set.'); return; }
  var form = FormApp.openById(id);
  form.setAcceptingResponses(false);
  Logger.log('Closed form: ' + form.getEditUrl());
}

function scheduleFormClosure(isoDateString) {
  var when = new Date(isoDateString);
  ScriptApp.newTrigger('closeStrategyForm').timeBased().at(when).create();
  Logger.log('Scheduled closure at: ' + when);
}
