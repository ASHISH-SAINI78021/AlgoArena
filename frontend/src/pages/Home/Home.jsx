import React, { useState, useEffect } from 'react';
import { Code, Zap, Trophy, Users, Sparkles, ChevronRight, Play, Target, Brain, Award } from 'lucide-react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className={styles.featureIcon} />,
      title: "AI-Powered Hints",
      description: "Get intelligent hints when you're stuck, without spoiling the solution"
    },
    {
      icon: <Zap className={styles.featureIcon} />,
      title: "Real-time Battles",
      description: "Compete with peers in live 1v1 coding challenges"
    },
    {
      icon: <Target className={styles.featureIcon} />,
      title: "Pattern Recognition",
      description: "Auto-detect problem patterns and master DSA concepts faster"
    },
    {
      icon: <Trophy className={styles.featureIcon} />,
      title: "Arena Rankings",
      description: "Climb from Bronze to Legend through consistent practice"
    }
  ];

  const stats = [
    { label: "Problems", value: "500+", icon: <Code /> },
    { label: "Active Users", value: "10K+", icon: <Users /> },
    { label: "Battles Fought", value: "50K+", icon: <Trophy /> },
    { label: "Success Rate", value: "94%", icon: <Award /> }
  ];

  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Apple"];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Trophy className={styles.logoIconSvg} />
          </div>
          <span className={styles.logoText}>AlgoArena</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#problems" className={styles.navLink}>Problems</a>
          <a href="#battles" className={styles.navLink}>Battles</a>
          <a href="#leaderboard" className={styles.navLink}>Leaderboard</a>
          <a href="#pricing" className={styles.navLink}>Pricing</a>
        </div>
        <div className={styles.navButtons}>
          {user ? (
            <>
              <span style={{ color: '#fff', marginRight: '10px' }}>Hi, {user.username}</span>
              <button className={styles.navLink} onClick={() => navigate('/saved-codes')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>Saved Codes</button>
              <button className={styles.btnSecondary} onClick={logout}>Logout</button>
              <button className={styles.btnPrimary} onClick={() => navigate('/realtime-coding')}>
                Go to Arena <ChevronRight className={styles.btnIcon} />
              </button>
            </>
          ) : (
            <>
              <button className={styles.btnSecondary} onClick={() => navigate('/login')}>Login</button>
              <button className={styles.btnPrimary} onClick={() => navigate('/signup')}>
                Start Free <ChevronRight className={styles.btnIcon} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles className={styles.badgeIcon} />
          <span>AI-Powered DSA Practice Platform</span>
        </div>

        <h1 className={styles.heroTitle}>
          Master Algorithms
          <br />
          <span className={styles.heroGradient}>Through Battle</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Practice DSA with AI mentorship, compete in real-time battles, and climb the ranks from Bronze to Legend
        </p>

        <div className={styles.heroCta}>
          <button className={styles.btnLarge} onClick={() => navigate(user ? '/realtime-coding' : '/signup')}>
            <Play className={styles.btnIcon} />
            {user ? 'Enter the Arena' : 'Join Now'}
          </button>
          <button className={styles.btnLargeSecondary}>
            <Code className={styles.btnIcon} />
            View Problems
          </button>
        </div>

        {/* Animated Code Window */}
        <div className={styles.codeWindow}>
          <div className={styles.codeHeader}>
            <div className={styles.codeDots}>
              <span className={styles.dotRed}></span>
              <span className={styles.dotYellow}></span>
              <span className={styles.dotGreen}></span>
            </div>
            <span className={styles.codeTitle}>two_sum.py</span>
          </div>
          <div className={styles.codeBody}>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>1</span>
              <span className={styles.keyword}>def</span> <span className={styles.function}>twoSum</span>(nums, target):
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>2</span>
              <span className={styles.indent}>seen = {'{}'}</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>3</span>
              <span className={styles.indent}><span className={styles.keyword}>for</span> i, num <span className={styles.keyword}>in</span> <span className={styles.function}>enumerate</span>(nums):</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>4</span>
              <span className={styles.indent2}>complement = target - num</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>5</span>
              <span className={styles.indent2}><span className={styles.keyword}>if</span> complement <span className={styles.keyword}>in</span> seen:</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>6</span>
              <span className={styles.indent3}><span className={styles.keyword}>return</span> [seen[complement], i]</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>7</span>
              <span className={styles.indent2}>seen[num] = i</span>
            </div>
            <div className={styles.codeSuccess}>
              ✓ All test cases passed • Runtime: {counter}ms • O(n) complexity
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose AlgoArena?</h2>
          <p className={styles.sectionSubtitle}>Practice smarter, not harder with AI-powered features</p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIconBox}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arena Modes Section */}
      <section className={styles.modes}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose Your Arena</h2>
          <p className={styles.sectionSubtitle}>Multiple ways to sharpen your skills</p>
        </div>

        <div className={styles.modeGrid}>
          <div className={`${styles.modeCard} ${styles.modeBlue}`}>
            <Code className={styles.modeIcon} />
            <h3 className={styles.modeTitle}>Solo Practice</h3>
            <p className={styles.modeDesc}>500+ curated problems with AI hints and detailed explanations</p>
            <ul className={styles.modeList}>
              <li>• Pattern-based learning</li>
              <li>• Company-specific questions</li>
              <li>• Progress tracking</li>
            </ul>
          </div>

          <div className={`${styles.modeCard} ${styles.modePurple}`}>
            <Zap className={styles.modeIcon} />
            <h3 className={styles.modeTitle}>Battle Mode</h3>
            <p className={styles.modeDesc}>Real-time 1v1 coding competitions with live leaderboards</p>
            <ul className={styles.modeList}>
              <li>• Live matchmaking</li>
              <li>• Ranked battles</li>
              <li>• Tournament mode</li>
            </ul>
          </div>

          <div className={`${styles.modeCard} ${styles.modeOrange}`}>
            <Trophy className={styles.modeIcon} />
            <h3 className={styles.modeTitle}>Daily Challenge</h3>
            <p className={styles.modeDesc}>Compete globally with one problem every day</p>
            <ul className={styles.modeList}>
              <li>• Global leaderboard</li>
              <li>• Streak rewards</li>
              <li>• XP multipliers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className={styles.companies}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Prepare For Top Companies</h2>
          <p className={styles.sectionSubtitle}>Practice questions asked at FAANG and more</p>
        </div>
        <div className={styles.companyGrid}>
          {companies.map((company, idx) => (
            <div key={idx} className={styles.companyCard}>{company}</div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to Enter the Arena?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of developers mastering DSA and landing their dream jobs
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnLarge} onClick={() => navigate(user ? '/realtime-coding' : '/signup')}>
              {user ? 'Start Practicing' : 'Start Free Trial'} <ChevronRight className={styles.btnIcon} />
            </button>
            <button className={styles.btnLargeSecondary}>View Pricing</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>
                <Trophy className={styles.logoIconSvg} />
              </div>
              AlgoArena
            </div>
            <p className={styles.footerDesc}>Master algorithms through competitive practice</p>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Product</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Problems</a></li>
              <li><a href="#">Battles</a></li>
              <li><a href="#">Leaderboard</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Blog</a></li>
              <li><a href="#">DSA Guide</a></li>
              <li><a href="#">Interview Prep</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Company</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © 2026 AlgoArena. Built for developers, by developers.
        </div>
      </footer>
    </div>
  );
}