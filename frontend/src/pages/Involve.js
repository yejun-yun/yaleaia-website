    import React, { useState } from 'react';
    import '../styles/Involve.css';
    import { Link } from 'react-router-dom';
    
    function Involve() {
      const [activeFaq, setActiveFaq] = useState(null);
    
      const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
      };
    
      return (
        <div className="involve">
    
          <section className="fellowship-section">
            <div className="container">
              <div className="fellowship-content">
                <h2>AI Safety Fellowship</h2>
                <div className="fellowship-description">
                  <p>
                    YAIA is offering an 8-week AI Safety Fellowship focused on technical AI safety, covering topics such as:
                  </p>
                  <ul className="topics-list">
                    <li>Neural Network Interpretability</li>
                    <li>Learning from Human Feedback</li>
                    <li>Goal Misgeneralization in Reinforcement Learning Agents</li>
                    <li>Eliciting Latent Knowledge</li>
                  </ul>
                  <p>
                    The summer fellowship convenes weekly in small groups online and requires no additional work outside of meetings.
                  </p>
                  <div className="cta-links">
                    <Link to="https://docs.google.com/document/d/10lIir6tAQUe51wpwwdt6ICdd7WtdAIlgkknOku79VDk/edit?usp=sharing" className="link-button secondary" target="_blank" rel="noopener noreferrer">View Curriculum</Link>
                    <Link to="https://docs.google.com/forms/d/e/1FAIpQLSc5jqrujQSvH-N9sA7GN4bI1iBtV_YXxpnNxFuV4VYVlBT7nw/viewform?usp=sharing&ouid=109623917252404388178" className="link-button primary" target="_blank" rel="noopener noreferrer">Apply for Summer '26</Link>
                  </div>
                </div>
                
    
                <div className="faq-section">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-grid">
                    <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`} onClick={() => toggleFaq(0)}>
                      <h4>Who is eligible to join the fellowship?</h4>
                      <p>
                        The fellowship is open to all Yale students across any department or program.
                      </p>
                    </div>
    
                    <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`} onClick={() => toggleFaq(1)}>
                      <h4>What level of machine learning experience is required?</h4>
                      <p>
                      Participants should be familiar with basic concepts in machine learning, such as deep neural networks, stochastic gradient descent, and reinforcement learning. We may group cohorts according to previous experience.
                      </p>
                    </div>
    
                    <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`} onClick={() => toggleFaq(2)}>
                      <h4>When and where will the fellowship meetings take place?</h4>
                      <p>
                      We ask for your availability in the application, and will attempt to accommodate people's schedules when forming cohorts. The summer fellowship meets once a week for two hours online, while fellowships during the academic year meet in person. Meeting details will be announced in the Slack channel several days prior to each meeting.
                      </p>
                    </div>
    
                    <div className={`faq-item ${activeFaq === 3 ? 'active' : ''}`} onClick={() => toggleFaq(3)}>
                      <h4>What should I do if I am already familiar with the curriculum material?</h4>
                      <p>
                        If you've already familiar with all the material in the curriculum, please email us at yale.ai.alignment@gmail.com to discuss other ways of getting involved with YAIA! Also, consider joining our paper reading group!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
            <div style={{ width: '70%', height: '3px', backgroundColor: '#e0e0e0' }}></div>
          </div>

          <section className="fellowship-section">
            <div className="container">
              <div className="fellowship-content">
                <h2>Weekly Paper Reading Group</h2>
                <div className="fellowship-description">
                  <p>
                    YAIA members meet weekly to read and discuss selected papers on technical AI safety. This is a great way to stay up-to-date with current research and engage in thoughtful discussions with other interested students.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
    
    export default Involve;
