import React, { useState } from 'react';
import '../styles/Resources.css';

function Resources() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: "Introduction to AI Alignment",
      type: "course",
      difficulty: "Beginner",
      description: "A comprehensive introduction to key concepts in AI alignment and safety.",
      author: "YAIA Education Team",
      duration: "6 weeks",
      links: {
        materials: "#",
        slides: "#",
        video: "#"
      },
      tags: ["Fundamentals", "Self-paced", "Video content"]
    },
    {
      id: 2,
      title: "Technical AI Safety Problems",
      type: "paper",
      difficulty: "Advanced",
      description: "Research paper exploring current technical challenges in AI alignment.",
      author: "Dr. Emily Chen, Yale CS",
      publishDate: "March 2024",
      links: {
        pdf: "#",
        code: "#"
      },
      tags: ["Technical", "Research", "Contemporary"]
    },
  ];

  return (
    <div className="resources-page">
      <section className="resources-hero">
        <div className="container">
          <h1>Learning Resources</h1>
          <p className="lead">Explore our curated collection of AI alignment materials</p>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      <section className="learning-paths">
        <div className="container">
          <h2>Learning Paths</h2>
          <div className="paths-grid">
            <div className="path-card">
              <div className="path-icon">🎓</div>
              <h3>Beginner Track</h3>
              <p>Start your journey in AI alignment</p>
              <ul className="path-topics">
                <li>Fundamentals of AI Safety</li>
                <li>Ethics in AI</li>
                <li>Basic Technical Concepts</li>
              </ul>
              <button className="start-path-button">Start Learning</button>
            </div>
            <div className="path-card">
              <div className="path-icon">⚡</div>
              <h3>Technical Track</h3>
              <p>Deep dive into technical aspects</p>
              <ul className="path-topics">
                <li>Advanced ML Concepts</li>
                <li>Robustness & Safety</li>
                <li>Implementation Techniques</li>
              </ul>
              <button className="start-path-button">Start Learning</button>
            </div>
            <div className="path-card">
              <div className="path-icon">🌍</div>
              <h3>Policy Track</h3>
              <p>Focus on governance and policy</p>
              <ul className="path-topics">
                <li>AI Governance</li>
                <li>Policy Frameworks</li>
                <li>Global Coordination</li>
              </ul>
              <button className="start-path-button">Start Learning</button>
            </div>
          </div>
        </div>
      </section>

      <section className="resource-library">
        <div className="container">
          <div className="library-header">
            <h2>Resource Library</h2>
            <div className="resource-filters">
              <button 
                className={selectedType === 'all' ? 'active' : ''}
                onClick={() => setSelectedType('all')}
              >
                All Resources
              </button>
              <button 
                className={selectedType === 'course' ? 'active' : ''}
                onClick={() => setSelectedType('course')}
              >
                Courses
              </button>
              <button 
                className={selectedType === 'paper' ? 'active' : ''}
                onClick={() => setSelectedType('paper')}
              >
                Papers
              </button>
              <button 
                className={selectedType === 'video' ? 'active' : ''}
                onClick={() => setSelectedType('video')}
              >
                Videos
              </button>
            </div>
          </div>

          <div className="resources-grid">
            {resources
              .filter(resource => 
                (selectedType === 'all' || resource.type === selectedType) &&
                (searchQuery === '' || 
                  resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <span className={`resource-type ${resource.type}`}>
                      {resource.type}
                    </span>
                    <span className="difficulty-badge">
                      {resource.difficulty}
                    </span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p className="resource-author">{resource.author}</p>
                  <p className="resource-description">{resource.description}</p>
                  <div className="resource-tags">
                    {resource.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="resource-links">
                    {Object.entries(resource.links).map(([key, value]) => (
                      <a key={key} href={value} className="resource-link">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="featured-publications">
        <div className="container">
          <h2>Featured Publications</h2>
          <div className="publications-grid">
            <div className="publication-card">
              <h3>AI Alignment: A Comprehensive Review</h3>
              <p className="authors">Zhang, J., Smith, K., et al.</p>
              <p className="journal">Journal of AI Safety, 2024</p>
              <a href="#" className="read-more">Read Paper →</a>
            </div>
            {/* Add more publications */}
          </div>
        </div>
      </section>

      <section className="discussion-forum">
        <div className="container">
          <h2>Join the Discussion</h2>
          <p>Engage with other learners and researchers in our community forum</p>
          <button className="forum-button">Visit Forum</button>
        </div>
      </section>
    </div>
  );
}

export default Resources;