import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HeroLines from '../components/HeroLines';
import MissionScroller from '../components/MissionScroller';
import WaveRule from '../components/WaveRule';
import '../styles/Home.css';

export const INTEREST_FORM_URL = 'https://forms.gle/vmNG2pdZBcdwdU1X6';

function Home() {
  return (
    <div className="home">
      <Helmet>
        <title>Yale AI Alignment</title>
        <meta
          name="description"
          content="Dedicated to reducing catastrophic risks from advanced AI."
        />
      </Helmet>

      <section className="hero">
        <HeroLines speed={1} />
        <div className="hero-content">
          <h1>A community at Yale focused on catastrophic risk from AI.</h1>
          <p>
            Managing risks from advanced artificial intelligence is one of the
            most important problems of our time. We are a community at Yale
            aimed at reducing these risks and steering the trajectory of AI
            development for the better.
          </p>
          <div className="hero-ctas">
            <Link className="hero-cta-primary" to="/involve">
              Explore our programs →
            </Link>
            <a
              className="hero-cta-secondary"
              href={INTEREST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Interest form
            </a>
          </div>
        </div>
      </section>

      <WaveRule />

      <section id="mission" className="mission">
        <MissionScroller />
      </section>

      <section className="mission-quote-band" aria-label="Expert statement">
        <WaveRule />
        <div className="mission-quote-inner">
          <blockquote className="mission-quote">
            “Mitigating the risk of extinction from AI should be a global
            priority alongside other societal-scale risks such as pandemics
            and nuclear war.”
          </blockquote>
          <div className="mission-attr">
            — Center for AI Safety, signed by hundreds of AI experts and public
            figures
          </div>
        </div>
        <WaveRule mirror />
      </section>
    </div>
  );
}

export default Home;
