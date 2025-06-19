import React, { useState } from 'react';
import '../styles/Events.css';
import WaveDivider from '../components/WaveDivider';


function Events() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = [
    {
      id: 1,
      title: "AI Safety Workshop Series",
      date: "April 15, 2024",
      time: "3:00 PM - 5:00 PM EDT",
      location: "Yale SEAS Building, Room 201",
      category: "workshop",
      description: "A hands-on workshop exploring current challenges in AI alignment. Learn practical approaches to ensuring AI systems behave in alignment with human values.",
      speaker: "Dr. Sarah Mitchell",
      speakerTitle: "AI Safety Researcher, OpenAI",
      registerLink: "#",
      tags: ["Technical", "Hands-on", "Beginner-friendly"]
    },
    {
      id: 2,
      title: "Distinguished Speaker Series: The Future of AI Governance",
      date: "April 22, 2024",
      time: "5:00 PM - 6:30 PM EDT",
      location: "Virtual Event",
      category: "speaker",
      description: "Join us for an insightful discussion on the current state and future of AI governance with one of the leading experts in the field.",
      speaker: "Prof. James Anderson",
      speakerTitle: "Director, AI Policy Institute",
      registerLink: "#",
      tags: ["Policy", "Governance", "Virtual"]
    },
    {
      id: 3,
      title: "Student Research Symposium",
      date: "May 1, 2024",
      time: "1:00 PM - 5:00 PM EDT",
      location: "Yale Center for Engineering Innovation",
      category: "research",
      description: "Annual showcase of undergraduate and graduate research projects in AI alignment and safety. Features poster presentations and lightning talks.",
      speaker: "Multiple Student Presenters",
      registerLink: "#",
      tags: ["Research", "Student Projects", "Networking"]
    }
  ];

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="container">
          <h1>Events & Programs</h1>
          <p className="lead">Join us for workshops, talks, and conferences focused on AI safety and alignment</p>
        </div>
        <WaveDivider position="bottom" color="var(--dark-gray)" />
      </section>

      <section className="featured-event">
        <div className="container">
          <div className="featured-event-card">
            <div className="featured-event-content">
              <span className="featured-label">Featured Event</span>
              <h2>AI Safety Summit 2024</h2>
              <p className="date">June 1-2, 2024</p>
              <p className="description">
                A two-day conference bringing together leading researchers, practitioners, and students in AI safety. 
                Featuring keynote speeches, workshops, and networking opportunities.
              </p>
              <button className="register-button">Register Now</button>
            </div>
            <div className="featured-event-image">
              {/* Placeholder for event image */}
            </div>
          </div>
        </div>
        <WaveDivider position="bottom" color="var(--medium-gray)" />
      </section>

      <section className="events-filter">
        <div className="container">
          <div className="filter-buttons">
            <button 
              className={selectedCategory === 'all' ? 'active' : ''} 
              onClick={() => setSelectedCategory('all')}
            >
              All Events
            </button>
            <button 
              className={selectedCategory === 'workshop' ? 'active' : ''} 
              onClick={() => setSelectedCategory('workshop')}
            >
              Workshops
            </button>
            <button 
              className={selectedCategory === 'speaker' ? 'active' : ''} 
              onClick={() => setSelectedCategory('speaker')}
            >
              Speaker Series
            </button>
            <button 
              className={selectedCategory === 'research' ? 'active' : ''} 
              onClick={() => setSelectedCategory('research')}
            >
              Research Events
            </button>
          </div>
        </div>
      </section>

      <section className="events-list">
        <div className="container">
          <div className="events-grid">
            {events
              .filter(event => selectedCategory === 'all' || event.category === selectedCategory)
              .map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-date">
                      <span className="date">{event.date}</span>
                      <span className="time">{event.time}</span>
                    </div>
                    <div className="event-tags">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <h3>{event.title}</h3>
                  <p className="event-speaker">{event.speaker}</p>
                  <p className="event-speaker-title">{event.speakerTitle}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <div className="event-location">
                      <span className="location-icon">📍</span>
                      {event.location}
                    </div>
                    <button className="register-button">Register</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
      </section>

      <section className="past-events">
      <WaveDivider position="top" color="var(--medium-gray)" />
        <div className="container">
          <h2>Past Events</h2>
          <div className="past-events-slider">
            {/* Add past events carousel here */}
            <div className="past-event-card">
              <h3>AI Alignment Bootcamp</h3>
              <p>March 2024</p>
              <a href="#" className="view-resources">View Resources →</a>
            </div>
            {/* Add more past events */}
          </div>
        </div>
      </section>

      <section className="event-newsletter">
      <WaveDivider position="top" color="var(--dark-gray)" />
        <div className="container">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for event updates and announcements</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <WaveDivider position="bottom" color="var(--dark-gray)" />
      </section>
    </div>
  );
}

export default Events;