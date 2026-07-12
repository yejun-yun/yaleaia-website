import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../styles/Involve.css';
import ContourField from '../components/ContourField';
import ProgramPathway from '../components/ProgramPathway';
import Lettermark from '../components/Lettermark';
import { INTEREST_FORM_URL } from './Home';

// Week descriptions are the curriculum's Overview paragraphs, verbatim.
const WEEKS = [
  {
    num: '00',
    title: 'Machine learning fundamentals',
    blurb:
      'This week is optional and completed asynchronously. The goal is to ' +
      'ensure that fellows have a basic technical understanding of machine ' +
      'learning, which will help them grasp some of the research we cover ' +
      'in the fellowship. Many fellows already have this background and do ' +
      'not need to complete material for Week 0.',
  },
  {
    num: '01',
    title: 'Superintelligence and the current trajectory',
    blurb:
      'This week grounds participants in the empirical basis for the ' +
      'near-term development of advanced AI. The readings cover the ' +
      'current state of the frontier of AI models, the scaling trends ' +
      'that inform near-term capability forecasts, and the argument that ' +
      'once AI can accelerate AI research, the path to superintelligence ' +
      'may be shorter than intuition suggests.',
  },
  {
    num: '02',
    title: 'Superintelligent capabilities and will',
    blurb:
      'This week covers what superintelligence could do and what it might ' +
      'want. The readings cover the argument that a sufficiently capable ' +
      'system could overpower humanity collectively, the orthogonality ' +
      'thesis, instrumental convergence, and the problem of alignment ' +
      'target selection.',
  },
  {
    num: '03',
    title: 'Misalignment risks',
    blurb:
      'This week covers the ways alignment can fail and whether current ' +
      'systems already show signs of failure. The readings cover the ' +
      'difference between outer alignment and inner alignment and ' +
      "evidence that today's models are somewhat misaligned.",
  },
  {
    num: '04',
    title: 'Misuse risks',
    blurb:
      'This week covers the ways capable AI could amplify what malicious ' +
      'actors can do. The readings cover biorisk, where models may give ' +
      'novices uplift toward engineering catastrophic pathogens; ' +
      'cybersecurity, where frontier systems are gaining offensive ' +
      'capability; and the risk that AI could let a small group seize and ' +
      'hold power, including through a coup.',
  },
  {
    num: '05',
    title: 'Scalable oversight and automated alignment',
    blurb:
      'This week covers one of the main suggested approaches to aligning ' +
      'a superintelligence: handing off the problem to models more ' +
      'capable than ourselves. Scalable oversight asks how humans can ' +
      'train and evaluate models that outstrip them, with weak-to-strong ' +
      'generalization as one empirical handle. Automated alignment asks ' +
      'whether we can hand the alignment problem itself to AI, and why ' +
      'delegating it may be harder than it sounds.',
  },
  {
    num: '06',
    title: 'AI control',
    blurb:
      'This week covers one approach to safety that does not require ' +
      'solving alignment outright. Control asks how we can extract useful ' +
      'work from powerful AIs, limit the damage they can do, and ' +
      'incriminate them, even assuming they may be misaligned and trying ' +
      'to subvert us.',
  },
  {
    num: '07',
    title: 'Mechanistic interpretability and evals',
    blurb:
      'This week introduces two of the most important empirical ' +
      'approaches to understanding what frontier models are doing under ' +
      'the hood: mechanistic interpretability and evaluations. The week ' +
      'emphasizes how these two threads are converging into alignment ' +
      'auditing: using interpretability tools to check whether a model ' +
      'has the goals it appears to have.',
  },
  {
    num: '08',
    title: 'AI safety careers',
    blurb:
      'The course closes by turning from the problem to the participant: ' +
      'how to actually contribute. The readings survey the landscape of ' +
      'AI safety career paths.',
  },
];

const OTHER_PROGRAMS = [
  {
    stage: 'ENGAGE',
    title: 'Paper reading group',
    blurb:
      'Members meet weekly to read and discuss recent papers and other recent developments in strategy, governance, capabilities research, and technical ' +
      'AI safety',
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
      'YAIA supports members pursuing technical AI safety research through mentorship support, research coworking groups, compute access, application workshops to technical research programs, and other initiatives.'
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
    title: 'Hackathons',
    blurb:
      'In Fall 2026, YAIA will host the inagural Yale AI Safety Hackathon.'
  },
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
    a: 'The fellowship is open to all Yale students, in any department or program.',
  },
  {
    q: 'How much ML experience do I need?',
    a:
      'Familiarity with basic concepts helps, and cohorts are grouped by ' +
      'experience. The optional Week 0 primer covers the fundamentals ' +
      'asynchronously.',
  },
  {
    q: 'When and where are meetings?',
    a:
      'We collect availability in the application and schedule cohorts ' +
      'around it. Summer cohorts meet online; academic-year cohorts meet ' +
      'in person.',
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
          content="YAIA's Technical AI Safety Fellowship, paper reading group, and community programs."
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

      <section className="fellowship">
        <div className="fellowship-left">
          <div className="involve-eyebrow">FLAGSHIP</div>
          <h2>
            <Lettermark className="fellowship-logo" /> Technical AI Safety
            Fellowship
          </h2>
          <p>
            YAIA runs a selective fellowship on technical AI safety every
            fall, spring, and summer, covering topics like AI futures,
            misalignment and misuse risks, scalable oversight, control, and
            mechanistic interpretability. The fellowship meets weekly in
            small cohorts for one hour and aims to prepare participants for
            further learning and direct contribution in technical AI safety.
          </p>
          <ul className="fellowship-facts">
            <li>
              <span className="k">Next cohort</span>
              <span className="v">Fall 2026</span>
            </li>
            <li>
              <span className="k">Offered</span>
              <span className="v">Every fall, spring, and summer</span>
            </li>
            <li>
              <span className="k">Format</span>
              <span className="v">Weekly 1-hour cohort meetings</span>
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
            Join the interest list →
          </a>
        </div>

        <div className="fellowship-right">
          {WEEKS.map((week) => (
            <div className="week-row" key={week.num}>
              <span className="week-num">{week.num}</span>
              <div>
                <h4>{week.title}</h4>
                <p>{week.blurb}</p>
              </div>
            </div>
          ))}
          <Link className="curriculum-link" to="/curriculum">
            Read the full curriculum, with all readings →
          </Link>
        </div>
      </section>

      <ProgramCarousel />

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
