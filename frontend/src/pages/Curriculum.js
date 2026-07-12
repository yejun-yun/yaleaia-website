import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet';
import '../styles/Curriculum.css';

/*
 * The curriculum page renders public/curriculum.md at runtime, so
 * updating the site's curriculum is: replace that file, redeploy.
 *
 * The markdown (a Google Docs export) is bold-paragraph structured
 * rather than heading-structured, so we slice it ourselves: week
 * boundaries on "**Week N: Title**" lines, then known section headers
 * within each week. Section bodies are handed to react-markdown intact.
 */

const SECTION_KEYS = [
  { key: 'overview', re: /^overview\b/i },
  { key: 'objectives', re: /^learning objectives\b/i },
  { key: 'core', re: /^core\b/i },
  { key: 'recommended', re: /^recommended\b/i },
  { key: 'supplementary', re: /^supplementary\b/i },
];

const TIER_LABELS = {
  objectives: 'LEARNING OBJECTIVES',
  core: 'CORE',
  recommended: 'RECOMMENDED',
  supplementary: 'SUPPLEMENTARY',
};

function parseCurriculum(text) {
  // Google Docs exports scatter runs of 4+ asterisks as noise; real
  // emphasis only ever uses one or two.
  const lines = text.replace(/\*{4,}/g, '').split('\n');
  const weekRe = /^\*{0,2}\s*Week\s+(\d+):\s*(.*?)\*{0,2}\s*$/;
  const sectionRe = /^\*{0,2}([A-Za-z][A-Za-z ]+?)\*{0,2}\s*$/;

  const weeks = [];
  let week = null;
  let section = null;

  for (const raw of lines) {
    const line = raw.trim();
    const w = line.match(weekRe);
    if (w) {
      week = { num: w[1], title: w[2].trim(), sections: {} };
      weeks.push(week);
      section = null;
      continue;
    }
    if (!week) continue;
    const s = line.match(sectionRe);
    const match = s && SECTION_KEYS.find((k) => k.re.test(s[1].trim()));
    if (match) {
      section = match.key;
      week.sections[section] = [];
      continue;
    }
    if (section) week.sections[section].push(raw);
  }

  weeks.forEach((wk) => {
    Object.keys(wk.sections).forEach((k) => {
      const body = wk.sections[k]
        .filter((line) => !/^\s*[-*]\s*TBD\s*$/i.test(line)) // draft placeholders
        .join('\n')
        .trim();
      if (body) wk.sections[k] = body;
      else delete wk.sections[k];
    });
  });
  return weeks;
}

const mdComponents = {
  a: ({ node, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

function Curriculum() {
  const [weeks, setWeeks] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/curriculum.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => setWeeks(parseCurriculum(text)))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="curriculum">
      <Helmet>
        <title>Curriculum — Yale AI Alignment</title>
        <meta
          name="description"
          content="The full curriculum for YAIA's Technical AI Safety Fellowship."
        />
      </Helmet>

      <div className="curriculum-page">
        <h1>Technical AI Safety Fellowship</h1>
        <p className="curriculum-season">Summer 2026, 8 Week Curriculum</p>
        <p className="curriculum-sub">
          The curriculum is divided into two sections. Below, we share the
          ideal outcomes we have in mind
        </p>
        <ul className="curriculum-outcomes">
          <li>
            <strong>Weeks 1–4</strong>: Fellows have engaged with and
            understand, in their own terms, the arguments for and against
            existential risk arising from advanced AI in the near future.
          </li>
          <li>
            <strong>Weeks 5–8</strong>: Fellows have a broad understanding
            of the different types of technical research being done to
            mitigate these risks, and they have concrete plans for
            upskilling and pursuing research or contributing to AI safety
            in another manner.
          </li>
        </ul>

        {failed && (
          <p className="curriculum-error">
            The curriculum failed to load. Please refresh, or email us at
            yale.ai.alignment@gmail.com.
          </p>
        )}

        {weeks &&
          weeks.map((week) => (
            <section
              className="curriculum-week"
              id={`week-${week.num}`}
              key={week.num}
            >
              <span className="curriculum-week-num">
                WEEK {week.num.padStart(2, '0')}
              </span>
              <h2>{week.title}</h2>
              {week.sections.overview && (
                <div className="curriculum-overview">
                  <ReactMarkdown components={mdComponents}>
                    {week.sections.overview}
                  </ReactMarkdown>
                </div>
              )}
              {['objectives', 'core', 'recommended', 'supplementary'].map(
                (key) =>
                  week.sections[key] && (
                    <div className="curriculum-tier" key={key}>
                      <h6>{TIER_LABELS[key]}</h6>
                      <div className="curriculum-tier-content">
                        <ReactMarkdown components={mdComponents}>
                          {week.sections[key]}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
              )}
            </section>
          ))}
      </div>
    </div>
  );
}

export default Curriculum;
