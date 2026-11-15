# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

This portfolio is for employers, collaborators, and mentors who need to quickly understand Ye Mai's commercial value, creative range, technical depth, and professional energy. Visitors may be evaluating fit for hiring, collaboration, graduate supervision, research partnership, or creative technology work.

## Product Purpose

The site presents Ye Mai as a young, bold, technically capable creative professional who can turn immersive media, XR, web, sound, visual systems, and research ideas into credible work. Success means visitors leave with a clear sense of capability, originality, craft, and positive professional momentum, then feel confident enough to contact Ye Mai or continue exploring project details.

## Positioning

Ye Mai's work connects spatial interfaces and immersive learning with web engineering and visual storytelling. The portfolio makes that combination concrete through project media, implementation details, research questions, and recorded outcomes. Technical capability and creative authorship should be understandable through the work itself.

## Operating Context

Visitors use the homepage to understand Ye Mai's practice, skills, education, and industry experience, then explore work grouped into XR-Related and Playground. Selected projects open as case studies; other work links to external demonstrations or videos. Email, GitHub, LinkedIn, and Itch.io provide paths to contact Ye Mai or explore further work.

Case studies support closer evaluation of the problem, Ye Mai's involvement, the design or technical approach, supporting media, and outcomes. Project content is authored in `data/content.json`; `CONTEXT.md` and `docs/project-authoring.md` define the shared authoring language and workflow.

## Capabilities and Constraints

- The current site uses static HTML, CSS, and vanilla JavaScript with JSON-loaded content. `index.html` is the homepage; HTML shells under `projects/` use the shared project renderer.
- English is the primary polished locale. Chinese content is available, with completion and consistency maintained as content evolves.
- Project entries can present images, video, case-study narratives, project facts, and external links. Unfinished case studies must remain visibly provisional.
- Distinguish a working prototype, an empirical study, and an exhibition proposal. Do not describe a proposal as a delivered exhibition or a research question as a demonstrated effect. For Midnight at the Pagoda, the confirmed progression is a hackathon VR prototype, an empirical HCI study of artifact interaction and visitors' retention of museum information, and a substantially expanded digital exhibition proposal.
- Keep factual claims tied to supplied information and recorded evidence. Do not invent credentials, clients, testimonials, study findings, or performance results.

## Brand Commitments

Fresh, young, bold, technical. The voice should feel energetic and positive without becoming casual or unserious. The image is creative, highly capable, warm, enthusiastic, and professional.

Use Ye Mai's name and actual work as the basis of the identity. Preserve the creative and technical personality while making the portfolio commercially useful for employers, collaborators, and mentors. The current visual system is recorded separately in `DESIGN.md`.

## Anti-references

Do not make the site feel like a generic corporate homepage, a standard portfolio template, or an AI SaaS landing page. Avoid interchangeable card grids, bland dark-tech styling, empty futurism, overused marketing phrases, and visual choices that hide the artist behind generic polish. The design should not feel cold, stiff, cute, timid, or template-driven.

## Evidence on Hand

- `data/content.json` contains bilingual biographies, skills, education and industry entries, project roles, deliverables, and recorded outcomes. Treat these as the current content record, rather than independent verification of every claim.
- `assets/projects/midnight-at-the-pagoda/` contains prototype development and presentation photos, interaction video, route diagrams, rendered scenes, and an exhibition proposal visual. The project's research purpose and progression are confirmed in the project copy; any claim about improved memory retention needs supplied study results.
- `assets/projects/vislab-onboarding-panel/` contains showreel and walkthrough videos, gesture demonstrations, workflow and architecture diagrams, and user-study photos supporting the GAVIS VR case study.
- Other project media under `assets/projects/`, the hero media under `assets/hero/`, portraits under `assets/portraits/`, and existing brand assets provide material for presenting the practice. A logo or photograph alone is not evidence of an endorsement or measured result.

## Product Principles

- Lead with creative proof: actual work and supporting evidence should establish capability and originality.
- Connect technical range to practice: explain what Ye Mai built, contributed, or investigated rather than relying on lists of tools.
- Make evaluation easy: visitors should quickly understand the work, individual involvement, and the scope of its outcomes.
- Preserve personal energy: remain young, optimistic, direct, and professionally credible.
- Let the work determine the story: preserve each project's substance and avoid interchangeable portfolio narratives.

## Accessibility & Inclusion

Target WCAG AA contrast and keyboard access as the baseline. Preserve `prefers-reduced-motion` support for all animation, keep visible focus states clear, and ensure text remains readable over video or image media. The bilingual content path should remain robust, with English as the primary polished locale and Chinese available without layout breakage when completed.
