// src/pages/BookmarkCollection.tsx
import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, FolderOpen, Play, Search, Settings2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BookmarkRow } from '../components/bookmarks/BookmarkRow';

// Motion Orchestration
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 24 } }
};

const viewportConfig = { once: true, margin: "-50px" };

// Deep Mock Data for a specific Collection
const COLLECTION_DATA = {
  id: 'networking-traps',
  title: 'Networking Traps',
  count: 12,
  colorClass: 'text-rose-500',
  bgClass: 'bg-rose-500/10',
  borderColorClass: 'border-rose-500/30',
  items: [
    {
      id: 'FE-NET-088',
      category: 'Networking & Communication',
      dateAdded: '3 days ago',
      text: 'Which transport layer protocol is connectionless and does not guarantee delivery of packets?',
      options: {
        A: 'TCP (Transmission Control Protocol)',
        B: 'UDP (User Datagram Protocol)',
        C: 'ICMP (Internet Control Message Protocol)',
        D: 'IGMP (Internet Group Management Protocol)'
      },
      correctAnswer: 'B',
      explanation: 'UDP is a connectionless protocol that prioritizes speed over reliability. Unlike TCP, it has no handshaking, error checking, or packet sequencing.'
    },
    {
      id: 'FE-NET-112',
      category: 'Networking & Communication',
      dateAdded: '5 days ago',
      text: 'In the OSI model, at which layer does a standard network switch operate?',
      options: {
        A: 'Layer 1 (Physical)',
        B: 'Layer 2 (Data Link)',
        C: 'Layer 3 (Network)',
        D: 'Layer 4 (Transport)'
      },
      correctAnswer: 'B',
      explanation: 'Standard switches operate at Layer 2 (Data Link) using MAC addresses to forward frames. Routers operate at Layer 3 using IP addresses.'
    },
    {
      id: 'FE-NET-042',
      category: 'Networking & Communication',
      dateAdded: '1 week ago',
      text: 'In IPv4 addressing, which of the following perfectly describes the primary function of a Subnet Mask?',
      options: {
        A: 'It converts private IP addresses into globally routable public addresses.',
        B: 'It separates the IP address into a network portion and a host portion.',
        C: 'It resolves a human-readable domain name into an IP address.',
        D: 'It dynamically assigns IP addresses to newly connected client devices.'
      },
      correctAnswer: 'B',
      explanation: 'A subnet mask is a 32-bit number that masks an IP address, and divides the IP address into network address and host address.'
    }
  ]
};

export default function BookmarkCollection() {
  const {  } = useParams(); // Use this to fetch the correct collection data in production

  return (
    <div className="flex flex-col gap-8 sm:gap-10 w-full max-w-5xl mx-auto pb-24 px-1 sm:px-0 pt-4">
      
      {/* 1. NAVIGATION & HEADER SECTION */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="flex flex-col items-start justify-center"
      >
        <Link to="/bookmarks" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-orbitron text-xs font-bold uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Vault
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl border ${COLLECTION_DATA.bgClass} ${COLLECTION_DATA.borderColorClass} flex items-center justify-center shrink-0`}>
              <FolderOpen className={`w-8 h-8 ${COLLECTION_DATA.colorClass}`} />
            </div>
            <div>
              <Badge className="mb-2 bg-surface-2/60 backdrop-blur-sm text-text-muted border-borderline font-orbitron tracking-widest uppercase text-[10px] leading-none pt-1.5 pb-1">
                Custom Collection
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-main font-display tracking-tight leading-none pt-1">
                {COLLECTION_DATA.title}
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial font-orbitron text-[10px] tracking-widest border-borderline text-text-muted hover:text-text-main leading-none pt-2.5 pb-2">
              <Settings2 className="w-3.5 h-3.5 mr-2 -mt-0.5" /> Manage
            </Button>
            <Button variant="primary" className="flex-1 sm:flex-initial font-orbitron text-[10px] tracking-widest leading-none pt-2.5 pb-2 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
              <Play className="w-3.5 h-3.5 mr-2 -mt-0.5" fill="currentColor" /> Drill Folder
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <motion.div 
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex items-center gap-3 w-full border-b border-borderline/50 pb-4"
      >
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-[10px] font-orbitron uppercase tracking-widest text-text-muted font-bold leading-none pt-0.5">
            {COLLECTION_DATA.count} Saved Items
          </span>
        </div>

        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search this folder..." 
            className="w-full bg-surface-2/40 border border-borderline text-text-main text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </motion.div>

      {/* 3. BOOKMARK LIST (Reusing our modular component) */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-3"
      >
        {COLLECTION_DATA.items.map((item) => (
          <BookmarkRow key={item.id} item={item} fadeUpVariant={fadeUpVariant} />
        ))}
      </motion.div>

    </div>
  );
}