import React from 'react';
import '../styles/About.css';
import { Link } from 'react-router-dom';
import WaveDivider from '../components/WaveDivider';

function About() {
  return (
    <div className="about">
      <section className="join-cta">
        <div className="container">
          <h2>Our Mission</h2>
          <p>The mission of the Yale Artificial Intelligence Student Association is to reduce catastrophic risks from AI through research, education, and capacity building.</p>
          
          <p>Many experts believe that we will create AI systems as capable as humans in all domains within the next one or two decades. There are many reasons to believe this is true, such as the billions of dollars of investment into AI labs and the current effectiveness of scaling up AI training runs.</p>
          
          <p>There could be catastrophic consequences if powerful AIs are developed without the appropriate safety measures. Bad actors could use AIs to design more potent chemical or biological weapons. Rampant automation and delegation of decisionmaking could result in our collective disempowerment and an inability to steer the course of history. An AI that develops internal goals during training that don't align with human values could seek to defeat humanity on its own accord. The economic incentives and geopolitical dynamics surrounding the "AI race" only make it harder to coordinate responsible AI development.</p>
          
          <p>Thus, we believe managing risks from advanced artificial intelligence is one of the most important problems of our time. We are a community at Yale aimed at reducing these risks and steering the trajectory of AI development for the better. In addition to running our AI Safety Introductory Fellowship, we run a paper reading group, host workshops and socials, and engage the Yale community with discussion about AI safety.</p>
          
          <p className="quote">"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war."<br/>
          <span className="quote-attribution">— Center for AI Safety, signed by hundreds of AI experts and public figures</span></p>
        </div>
      </section>
    </div>
  );
}

export default About;