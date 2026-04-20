import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Clock, Users, Shield, Compass } from "lucide-react";
import PanoModal from "@/components/PanoModal";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const [pano, setPano] = useState<{ src: string; title: string } | null>(null);
  
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-serif text-xl tracking-wide uppercase">Astley Green</div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
          <a href="#about" className="hover:text-primary transition-colors" data-testid="link-about">About</a>
          <a href="#landmarks" className="hover:text-primary transition-colors" data-testid="link-landmarks">Landmarks</a>
          <a href="#community" className="hover:text-primary transition-colors" data-testid="link-community">Community</a>
          <a href="#archive" className="hover:text-primary transition-colors" data-testid="link-archive">Archive</a>
        </div>
        <a href="#visit" className="border border-white/30 px-6 py-2 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors" data-testid="link-visit">
          Plan Visit
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: y1 }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-10" />
          <img 
            src="/images/newminer01.jpg" 
            alt="Astley Green Colliery" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <p className="text-primary font-sans tracking-[0.3em] uppercase text-sm mb-6">Lancashire's Last Pit Headgear</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight mb-8">
              Heavy Industry <br/><span className="italic text-muted-foreground">Preserved in Amber</span>
            </h1>
            <a 
              href="#about"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="btn-start-tour"
            >
              Start the Tour <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ABOUT / THE MUSEUM */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-foreground">A Living Memorial</h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Situated on the edge of Chat Moss, in an area once full of collieries, Astley Green Colliery Museum stands as a testament to the mining communities of Lancashire. 
              </p>
              <p>
                Preserved through community foresight and care, this site was saved from demolition by Lancashire County Council and dedicated local figures. Today, it is run and maintained by the Lancashire Mining Museum charity, offering free access to all who wish to understand the weight of real working lives.
              </p>
              <p>
                Occupying fifteen acres with the Bridgewater Canal and Astley Moss to the south, the picturesque village of Astley Green remains at the heart of the site.
              </p>
            </div>
          </div>
          <div className="relative h-[600px]">
            <img src="/images/miners001.jpg" alt="Miners at Astley Green" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 border border-border/50 m-4 pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* LANDMARKS */}
      <section id="landmarks" className="py-32 bg-card relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Site Highlights</h2>
            <p className="text-muted-foreground text-lg">Three key landmarks that halted demolition and preserved history.</p>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-32"
          >
            {/* Highlight 1 */}
            <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 h-[500px] relative">
                <img src="/images/miners002.jpg" alt="Headgear" className="w-full h-full object-cover" />
              </div>
              <div className="lg:col-span-5">
                <div className="text-primary font-mono text-sm mb-4">01 // Grade II Listed</div>
                <h3 className="text-3xl font-serif mb-4">The Headgear</h3>
                <p className="text-muted-foreground mb-6">
                  The last surviving Lancashire pit headgear. Standing almost 30 metres (98 ft) tall, built in riveted wrought-iron lattice construction, carrying two sheave wheels 6.1 metres in diameter. Visible for many miles, it is the only surviving headgear from the once great Lancashire Coalfield.
                </p>
              </div>
            </motion.div>

            {/* Highlight 2 */}
            <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 lg:order-1 order-2">
                <div className="text-primary font-mono text-sm mb-4">02 // Grade II Listed</div>
                <h3 className="text-3xl font-serif mb-4">Engine House</h3>
                <p className="text-muted-foreground mb-6">
                  Built for the largest winding engine in the coalfield. A classic red-brick and blue-slate building with inset panels and large arched windows. It now houses a rich display detailing the history of the colliery site.
                </p>
              </div>
              <div className="lg:col-span-7 h-[500px] relative lg:order-2 order-1">
                <img src="/images/miners003.jpg" alt="Engine House" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Highlight 3 */}
            <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 h-[500px] relative">
                <img src="/images/miners004.jpg" alt="Winding Engine" className="w-full h-full object-cover" />
              </div>
              <div className="lg:col-span-5">
                <div className="text-primary font-mono text-sm mb-4">03 // 3,300 Horsepower</div>
                <h3 className="text-3xl font-serif mb-4">Winding Engine</h3>
                <p className="text-muted-foreground mb-6">
                  Made by Yates and Thom of Blackburn. This twin tandem compound arrangement develops 3,300 horsepower. It remains operational today with regular running displays. The sheer uniqueness of this massive engine is what halted the site's demolition.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* THEMES / PILLARS */}
      <section id="community" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-border">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ThemeCard 
            icon={<MapPin />}
            title="Visitors"
            desc="Welcoming new arrivals. The site offers a first glimpse into the mining story of Astley, helping newcomers connect with the place and the people who shaped it."
            testId="theme-visitors"
          />
          <ThemeCard 
            icon={<Users />}
            title="Volunteers"
            desc="Stewardship in action. Volunteers keep the museum experience alive through care, research, storytelling, and practical support across the colliery."
            testId="theme-volunteers"
          />
          <ThemeCard 
            icon={<Shield />}
            title="Heritage"
            desc="Protecting the story. Every preserved space, object, and viewpoint helps tell the wider story of work, industry, and everyday life around the pit."
            testId="theme-heritage"
          />
          <ThemeCard 
            icon={<Compass />}
            title="Community"
            desc="Serving Astley today. The colliery remains a shared local space where residents, families, and supporters can gather around their history and identity."
            testId="theme-community"
          />
        </div>
      </section>

      {/* ARCHIVE FILMS */}
      <section id="archive" className="py-32 relative bg-black overflow-hidden border-y border-border">
        <div className="absolute inset-0 opacity-40">
          <img src="/images/newminer01.jpg" alt="Miners Archive" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Archive Films</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-2xl">
              Watch footage from the collection. Explore newly added video clips from the Astley archive and see more of the people, spaces, and working life connected to the colliery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { src: "/video/archive-01.mp4", label: "Archive Film 01" },
                { src: "/video/archive-02.mp4", label: "Archive Film 02" },
                { src: "/video/archive-03.mp4", label: "Archive Film 03" },
              ].map((v) => (
                <div key={v.src} className="flex flex-col gap-2">
                  <video
                    src={v.src}
                    controls
                    className="w-full aspect-video bg-black border border-white/10"
                  />
                  <p className="text-white/50 text-xs uppercase tracking-widest">{v.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <h2 className="text-4xl font-serif mb-4">Site Gallery</h2>
          <p className="text-muted-foreground">Historic structures, preserved industrial details, and objects from Astley's mining history.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GalleryItem src="/images/miners001.jpg" alt="Miners at the pit" />
          <GalleryItem src="/images/miners002.jpg" alt="Colliery workers" />
          <GalleryItem
            src="/images/astley-colliery-360.JPG"
            alt="Astley Green site"
            is360
            onClick={() => setPano({ src: "/images/astley-colliery-360.JPG", title: "Astley Green — 360° View" })}
          />
        </div>
      </section>

      {pano && <PanoModal src={pano.src} title={pano.title} onClose={() => setPano(null)} />}

      {/* FOOTER */}
      <footer id="visit" className="bg-card border-t border-border py-16 px-6 md:px-12 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl mb-4 text-foreground">Astley Green Colliery</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              A living memorial to the mining communities of Lancashire. Run and maintained by Lancashire Mining Museum, a registered charity.
            </p>
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Open to all. No charge for access.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground uppercase tracking-widest text-sm mb-6">Navigation</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">Start Tour</a></li>
              <li><a href="#landmarks" className="hover:text-primary transition-colors">Heritage</a></li>
              <li><a href="#community" className="hover:text-primary transition-colors">Community & Volunteers</a></li>
              <li><a href="#archive" className="hover:text-primary transition-colors">Archive Videos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground uppercase tracking-widest text-sm mb-6">Visit</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Astley Green, Lancashire<br/>Edge of Chat Moss</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span>Check local times for engine runs</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}

function ThemeCard({ icon, title, desc, testId }: { icon: React.ReactNode, title: string, desc: string, testId: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className="p-8 border border-border bg-card/50 hover:bg-card transition-colors group cursor-default"
      data-testid={testId}
    >
      <div className="text-primary mb-6 transition-transform group-hover:-translate-y-1">
        {icon}
      </div>
      <h4 className="text-2xl font-serif mb-4 text-foreground">{title}</h4>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  );
}

function GalleryItem({ src, alt, is360, onClick }: { src: string, alt: string, is360?: boolean, onClick?: () => void }) {
  return (
    <div
      className="relative group overflow-hidden bg-muted aspect-[4/3] cursor-pointer"
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
        <span className="text-white font-medium uppercase tracking-widest text-sm">{alt}</span>
      </div>
      {is360 && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", border: "1px solid rgba(212,175,55,0.5)", padding: "0.35rem 0.75rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.2" width="13" height="13">
            <ellipse cx="12" cy="12" rx="10" ry="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
          <span style={{ fontSize: "0.55rem", letterSpacing: "0.18em", color: "#d4af37", textTransform: "uppercase" }}>View 360°</span>
        </div>
      )}
    </div>
  );
}
