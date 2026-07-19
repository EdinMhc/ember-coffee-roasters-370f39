export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <p className="section-label">Our Story</p>
          <h1>Ember Coffee Roasters</h1>
          <p>
            We started in a 20-square-metre garage in Hamburg-Harburg with a
            second-hand Probat, a handful of green bean samples, and a belief
            that great coffee doesn&rsquo;t need to shout to be heard.
          </p>
        </div>

        {/* Story */}
        <div className="about-story">
          <div className="about-story-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=600&q=80&auto=format&fit=crop"
              alt="Inside the Ember roastery with vintage Probat roaster"
            />
          </div>
          <div className="about-story-text">
            <h2>From garage to roastery</h2>
            <p>
              Mira and Jonas met working the bar at a specialty café in Berlin.
              She was the one who could tell you the farm, altitude, and
              processing method of every single-origin on the shelf; he was the
              one who&rsquo;d stay late dialling in the espresso until it sang.
              They both knew the same thing: the best coffees in the world
              deserved more than commodity roasting.
            </p>
            <p>
              In 2018 they bought a battered 15-kilo Probat, rented a tiny
              space in Harburg, and started roasting on weekends while keeping
              their day jobs. Word spread through the Hamburg food scene faster
              than they expected — within a year, Ember was in a dozen
              independent cafés across the city, and Mira was roasting full-time.
            </p>
            <p>
              Today, we source directly from producers in Ethiopia, Colombia,
              Guatemala, Brazil, Sumatra, and Kenya — relationships built over
              years of visits, cupping sessions, and shared commitment to
              quality. Every lot is roasted to order, and every bag that leaves
              our roastery carries the name of the people who grew it.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="about-values">
          <div className="about-value">
            <div className="about-value-icon">&#9679;</div>
            <h3>Direct Trade</h3>
            <p>
              We buy directly from producers and cooperatives, paying well above
              Fair Trade minimums. Long-term relationships mean better coffee and
              stronger communities.
            </p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">&#9679;</div>
            <h3>Small Batches</h3>
            <p>
              Our 15-kilo roaster means every batch gets individual attention.
              We roast four days a week so your coffee arrives at peak freshness
              — never from a warehouse shelf.
            </p>
          </div>
          <div className="about-value">
            <div className="about-value-icon">&#9679;</div>
            <h3>Sustainable</h3>
            <p>
              All our packaging is plastic-free and fully compostable, from the
              kraft bags to the plant-based valves. Good for your cup, good for
              the planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
