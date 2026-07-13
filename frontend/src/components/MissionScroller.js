import React, { useEffect, useRef, useState } from 'react';

/*
 * Mission body as a scroll-driven two-column editorial spread. The left
 * column (label, lede, scroll-spy rail) is sticky; the right column is a
 * stack of large typographic rows divided by hairlines. A row stays
 * collapsed to its title until it crosses the middle band of the
 * viewport, at which point its title darkens and its body unfolds.
 * Clicking a rail item or a row scrolls it to the center, which in turn
 * activates it via the observer.
 */
const SECTIONS = [
  {
    id: 'trajectory',
    title: 'Advanced AI is coming',
    body:
      'Many experts believe we will create AI systems as capable as ' +
      'humans in all domains within the next decade. There are numerous reasons to believe this is ' +
      'true, such as the hundreds of billions of dollars flowing into AI ' +
      'labs each year, the current effectiveness of scaling up training ' +
      'runs, and the state-of-the-art performance of AI systems in ' +
      'domains like mathematics and programming.',
  },
  {
    id: 'stakes',
    title: 'The risks are existential',
    body:
      'There could be disastrous consequences if powerful AIs are ' +
      'developed without the appropriate safety measures. Bad actors could ' +
      'use AIs to design more potent chemical or biological weapons. ' +
      'Rampant automation and delegation of decisionmaking could result in ' +
      'our collective disempowerment and an inability to steer the course ' +
      'of history. An AI that develops internal goals during training that ' +
      "don't align with human values could seek to defeat humanity on its " +
      'own accord. The economic incentives and geopolitical dynamics ' +
      'surrounding the "AI race" only make it harder to coordinate ' +
      'responsible AI development.',
  },
  {
    id: 'response',
    title: 'We can help things go well',
    body:
      'We are a community at Yale aimed at reducing these risks and ' +
      'steering the trajectory of AI development for the better. Through ' +
      'our programs, we aim to introduce more people to problems within ' +
      'AI safety, help our community members gain the skills necessary to ' +
      'reduce existential risk, connect students with professionals, ' +
      'mentors, jobs, and other opportunities in AI safety, and ' +
      'facilitate an environment of critical and transparent reasoning ' +
      'about risks from advanced AI.',
  },
];

function MissionScroller() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      // Thin band around the vertical center of the viewport: whichever
      // row crosses it becomes the active one.
      { rootMargin: '-42% 0px -42% 0px' }
    );
    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (index) => {
    const el = rowRefs.current[index];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="mission-scroller">
      <div className="mission-scroller-left">
        <p className="mission-lede">
          The mission of Yale Artificial Intelligence Alignment is to reduce
          catastrophic risks from AI through research, education, and
          capacity building.
        </p>
        <nav className="mission-spy" aria-label="Mission sections">
          {SECTIONS.map((section, i) => (
            <button
              key={section.id}
              type="button"
              className={`mission-spy-item${i === active ? ' active' : ''}`}
              onClick={() => scrollTo(i)}
            >
              <span className="mission-spy-bar" aria-hidden="true" />
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="mission-scroller-right">
        {SECTIONS.map((section, i) => (
          <article
            key={section.id}
            data-index={i}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className={`mission-row${i === active ? ' active' : ''}`}
            onClick={() => scrollTo(i)}
          >
            <span className="mission-row-index">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{section.title}</h3>
            <div className="mission-row-body">
              <div className="mission-row-body-inner">
                <p>{section.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default MissionScroller;
