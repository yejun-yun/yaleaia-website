import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/Involve.css';
import ContourField from '../components/ContourField';
import ProgramPathway from '../components/ProgramPathway';
import Lettermark from '../components/Lettermark';
import WaveRule from '../components/WaveRule';
import { INTEREST_FORM_URL } from './Home';

const FELLOWSHIPS = [
  {
    title: 'Future of AI Fellowship',
    blurb:
      'What does the best empirical evidence actually suggest about AI ' +
      'progress? How intelligent could AI become in the future, and what ' +
      'could it do? Will AI assist bad actors in conducting massive ' +
      'cyberattacks, creating biological weapons, and staging coups? How ' +
      'can we mitigate these risks through approaches within policy, ' +
      'governance, advocacy, communications, and field-building? What are ' +
      'the strongest counterarguments to our concerns?',
    facts: [
      { k: 'Prerequisites', v: 'None' },
      {
        k: 'Intended audience',
        v:
          'Anyone interested in AI risk through paths other than technical ' +
          'research, including aspiring policymakers, political staffers, ' +
          'civil servants, advocates, communicators, generalists, and more.',
      },
    ],
  },
  {
    title: 'Technical AI Safety Fellowship',
    blurb:
      'What are the most rigorous empirical approaches for modeling and ' +
      'predicting AI progress? Can we use theoretical frameworks to ' +
      'predict certain behaviors or tendencies of superintelligences? How ' +
      'does research in mechanistic interpretability, evaluations, ' +
      'control, and alignment science contribute to mitigating AI risks? ' +
      'Are there tractable technical approaches to preventing issues like ' +
      'goal misgeneralization and specification gaming? What does this ' +
      'research look like, day-to-day, hands-on?',
    facts: [
      {
        k: 'Prerequisites',
        v: 'Empirical ML background, linear algebra, multivariate calculus',
      },
      {
        k: 'Intended audience',
        v: 'Future technical researchers in AI safety, strategy, or forecasting.',
      },
    ],
  },
];

const OTHER_PROGRAMS = [
  {
    stage: 'ENGAGE',
    title: 'Paper reading group',
    blurb:
      'Members meet weekly to read and discuss recent papers and other ' +
      'developments in strategy, governance, capabilities research, and ' +
      'technical AI safety.',
  },
  {
    stage: 'ENGAGE',
    title: 'Tracks program',
    blurb:
      'Starting Fall 2026, YAIA will host synchronous cohorts for ' +
      'the UChicago XLab Tracks program, facilitating more in-depth courses ' +
      'in topics like control, evaluations, verification, and general AI safety.'
  },
  {
    stage: 'CONTRIBUTE',
    title: 'Research support',
    blurb:
      'YAIA supports members pursuing technical AI safety research ' +
      'through mentorship, research coworking groups, compute access, ' +
      'application workshops for technical research programs, and other ' +
      'initiatives.'
  },
  {
    stage: 'ENGAGE',
    title: 'Retreats',
    blurb:
      'YAIA sends groups to the AISST/MAIA workshops and other AI safety-related retreats, facilitating member connections to professionals and mentors in the field and other students in the AI safety community.'
  },
  {
    stage: 'ENGAGE',
    title: 'Conferences',
    blurb:
      'YAIA sends groups to AI safety-related conferences, like ControlConf and EAG, also facilitating member connections to professionals and mentors in the field and others in the AI safety community.'  },
  {
    stage: 'DISCOVER',
    title: 'Events',
    blurb:
      'YAIA hosts speakers, panels, and discussions throughout the term.'
  },
];

const FAQS = [
  {
    q: 'Who can apply?',
    a: 'The fellowships are open to all Yale students, in any department or program.',
  },
  {
    q: 'How much ML experience do I need?',
    a:
      'None for the Future of AI Fellowship. The Technical AI Safety ' +
      'Fellowship expects an empirical ML background, linear algebra, and ' +
      'multivariate calculus.',
  },
  {
    q: 'When and where are meetings?',
    a:
      'We collect availability in the application and schedule cohorts ' +
      'around it. Cohorts meet weekly in person, and dinner is provided.',
  },
  {
    q: 'Already know this material?',
    a:
      'Email us at yale.ai.alignment@gmail.com to talk about other ways ' +
      'to get involved.',
  },
];

function ProgramCarousel() {
  const trackRef = useRef(null);

  const nudge = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="other-programs">
      <div className="other-programs-head">
        <h3>Other programs</h3>
        <div className="carousel-arrows">
          <button
            type="button"
            aria-label="Scroll programs left"
            onClick={() => nudge(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Scroll programs right"
            onClick={() => nudge(1)}
          >
            →
          </button>
        </div>
      </div>
      <div className="carousel-track" ref={trackRef}>
        {OTHER_PROGRAMS.map((program) => (
          <article className="program-card" key={program.title}>
            <h4>{program.title}</h4>
            <p>{program.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Involve() {
  return (
    <div className="involve">
      <Helmet>
        <title>Programs — Yale AI Alignment</title>
        <meta
          name="description"
          content="YAIA's Future of AI and Technical AI Safety Fellowships, paper reading group, and community programs."
        />
      </Helmet>

      <header className="involve-hero">
        <ContourField />
        <div className="involve-hero-fade" />
        <div className="involve-hero-copy">
          <h1>Programs</h1>
        </div>
      </header>

      <ProgramPathway />

      <WaveRule />

      <section className="fellowship">
        <div className="fellowship-left">
          <div className="involve-eyebrow">FLAGSHIP</div>
          <h2>
            <Lettermark className="fellowship-logo" /> Fall fellowships
          </h2>
          <p>
            This fall, YAIA is running our Technical AI Safety Fellowship
            and a new Future of AI Fellowship, for which no technical
            background is required. Fellowships meet weekly in small
            cohorts, and dinner is provided. All readings are done during
            the meetings, with none outside.
          </p>
          <ul className="fellowship-facts">
            <li>
              <span className="k">Applications</span>
              <span className="v">Open until September 10, rolling</span>
            </li>
            <li>
              <span className="k">Time commitment</span>
              <span className="v">2-hour weekly meeting, 7 weeks</span>
            </li>
            <li>
              <span className="k">Format</span>
              <span className="v">Small cohorts, dinner provided</span>
            </li>
            <li>
              <span className="k">Readings</span>
              <span className="v">Done during meetings</span>
            </li>
            <li>
              <span className="k">Eligibility</span>
              <span className="v">All Yale students</span>
            </li>
          </ul>
          <a
            className="fellowship-cta"
            href={INTEREST_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply →
          </a>
        </div>

        <div className="fellowship-right">
          {FELLOWSHIPS.map((program) => (
            <article className="fellowship-program" key={program.title}>
              <h3>{program.title}</h3>
              <p>{program.blurb}</p>
              <ul className="program-facts">
                {program.facts.map((fact) => (
                  <li key={fact.k}>
                    <span className="k">{fact.k}</span>
                    <span className="v">{fact.v}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <WaveRule mirror />

      <ProgramCarousel />

      <WaveRule />

      <section className="involve-faq">
        <h3>Frequently asked questions</h3>
        <div className="faq-grid">
          {FAQS.map((faq) => (
            <div className="faq-item" key={faq.q}>
              <h5>{faq.q}</h5>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Involve;
