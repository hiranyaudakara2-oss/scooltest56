import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  LogOut, 
  Save, 
  Upload, 
  ChevronRight, 
  Cpu, 
  Globe, 
  Shield, 
  Mail, 
  Phone,
  LayoutDashboard,
  Eye,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface ContentItem {
  id: string;
  value: string;
}

interface ImageItem {
  id: string;
  url: string;
}

interface SiteData {
  content: ContentItem[];
  images: ImageItem[];
}

// --- Components ---

const Navbar = ({ isAdmin, onLoginClick, onLogout }: { isAdmin: boolean, onLoginClick: () => void, onLogout: () => void }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900">SYLVESTER'S</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {['home', 'about', 'gallery', 'events'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900 capitalize transition-colors"
                >
                  {item === 'about' ? 'About Us' : item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium text-zinc-600">
                  <Shield className="w-3 h-3" />
                  ADMIN MODE
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const EditableText = ({ 
  id, 
  value, 
  isAdmin, 
  onSave, 
  className,
  multiline = false
}: { 
  id: string, 
  value: string, 
  isAdmin: boolean, 
  onSave: (id: string, val: string) => void,
  className?: string,
  multiline?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  if (isAdmin && isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            autoFocus
            className={`w-full bg-white border-2 border-zinc-900 p-2 rounded-md focus:outline-none ${className}`}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onSave(id, tempValue);
            }}
          />
        ) : (
          <input
            autoFocus
            className={`w-full bg-white border-2 border-zinc-900 p-2 rounded-md focus:outline-none ${className}`}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onSave(id, tempValue);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${isAdmin ? 'cursor-edit hover:bg-zinc-50 rounded px-1 -mx-1 transition-colors' : ''}`}
      onClick={() => isAdmin && setIsEditing(true)}
    >
      <span className={className}>{value}</span>
      {isAdmin && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-zinc-400" />
        </div>
      )}
    </div>
  );
};

const EditableImage = ({ 
  id, 
  url, 
  isAdmin, 
  onUpload, 
  className,
  aspectRatio = "aspect-video"
}: { 
  id: string, 
  url: string, 
  isAdmin: boolean, 
  onUpload: (id: string, file: File) => void,
  className?: string,
  aspectRatio?: string
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-zinc-100 ${aspectRatio} ${className}`}>
      {url ? (
        <img 
          src={url} 
          alt={id} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-400">
          <ImageIcon className="w-12 h-12" />
        </div>
      )}
      
      {isAdmin && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-zinc-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Upload className="w-4 h-4" />
            Change Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) onUpload(id, e.target.files[0]);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState<SiteData>({ content: [], images: [] });
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

  useEffect(() => {
    fetchData();
    if (token) setIsAdmin(true);
  }, [token]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const getContent = (id: string) => data.content.find(c => c.id === id)?.value || '';
  const getImage = (id: string) => data.images.find(i => i.id === id)?.url || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const json = await res.json();
      if (json.success) {
        setToken(json.token);
        localStorage.setItem('admin_token', json.token);
        setIsAdmin(true);
        setShowLogin(false);
        setLoginError('');
      } else {
        setLoginError('Invalid password');
      }
    } catch (err) {
      setLoginError('Login failed');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  const saveContent = async (id: string, value: string) => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value, token })
      });
      fetchData();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleUpload = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', id);
    formData.append('token', token || '');

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      fetchData();
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar isAdmin={isAdmin} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold tracking-widest text-zinc-500 uppercase mb-6">
                <Globe className="w-3 h-3" />
                Innovation Hub
              </div>
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
                <EditableText 
                  id="hero_title" 
                  value={getContent('hero_title')} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                />
              </h1>
              <p className="text-xl text-zinc-500 max-w-lg mb-10 leading-relaxed">
                <EditableText 
                  id="hero_subtitle" 
                  value={getContent('hero_subtitle')} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  multiline
                />
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-zinc-900 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-zinc-800 transition-colors group">
                  Explore Programs
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-zinc-200 px-8 py-4 rounded-full font-semibold hover:bg-zinc-50 transition-colors">
                  Contact Us
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <EditableImage 
                id="hero_image" 
                url={getImage('hero_image')} 
                isAdmin={isAdmin} 
                onUpload={handleUpload}
                aspectRatio="aspect-[4/5]"
                className="shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-zinc-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Our Mission</h2>
              <h3 className="text-3xl font-bold tracking-tight">Bridging the Gap Between Theory and Reality</h3>
            </div>
            <div className="lg:col-span-2">
              <p className="text-2xl text-zinc-600 leading-relaxed mb-12">
                <EditableText 
                  id="about_text" 
                  value={getContent('about_text')} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  multiline
                />
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-3xl border border-zinc-200">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Secure Learning</h4>
                  <p className="text-zinc-500">Industry-standard security protocols integrated into every curriculum.</p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-zinc-200">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Modern Hardware</h4>
                  <p className="text-zinc-500">Access to the latest workstations, 3D printers, and robotics kits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-4">Inside the Lab</h2>
              <h3 className="text-4xl font-bold tracking-tight">Student Projects</h3>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <EditableImage id="gallery_1" url={getImage('gallery_1')} isAdmin={isAdmin} onUpload={handleUpload} />
            <EditableImage id="gallery_2" url={getImage('gallery_2')} isAdmin={isAdmin} onUpload={handleUpload} />
            <EditableImage id="gallery_3" url={getImage('gallery_3')} isAdmin={isAdmin} onUpload={handleUpload} />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-zinc-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4">Upcoming</h2>
            <h3 className="text-4xl font-bold tracking-tight">Department Events</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-800 p-8 border border-white/5">
              <div className="flex justify-between items-start mb-8">
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <span className="block text-2xl font-bold">24</span>
                  <span className="text-xs font-bold text-zinc-400 uppercase">March</span>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-zinc-400" />
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4">
                <EditableText 
                  id="event_1_title" 
                  value={getContent('event_1_title') || 'Annual Robotics Showcase'} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  className="text-white"
                />
              </h4>
              <p className="text-zinc-400 leading-relaxed mb-8">
                <EditableText 
                  id="event_1_desc" 
                  value={getContent('event_1_desc') || 'Join us for a day of innovation as students present their latest robotic creations and automated systems.'} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  multiline
                />
              </p>
              <button className="text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-zinc-800 p-8 border border-white/5">
              <div className="flex justify-between items-start mb-8">
                <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <span className="block text-2xl font-bold">12</span>
                  <span className="text-xs font-bold text-zinc-400 uppercase">April</span>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-zinc-400" />
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4">
                <EditableText 
                  id="event_2_title" 
                  value={getContent('event_2_title') || 'Cyber Security Workshop'} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  className="text-white"
                />
              </h4>
              <p className="text-zinc-400 leading-relaxed mb-8">
                <EditableText 
                  id="event_2_desc" 
                  value={getContent('event_2_desc') || 'A hands-on workshop covering the fundamentals of network security and ethical hacking for beginners.'} 
                  isAdmin={isAdmin} 
                  onSave={saveContent} 
                  multiline
                />
              </p>
              <button className="text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">SYLVESTER'S TECHNOLOGY</span>
              </div>
              <p className="text-zinc-500 max-w-sm">
                Preparing students for the future of work through innovation, collaboration, and technical excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-zinc-500">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <EditableText id="contact_email" value={getContent('contact_email')} isAdmin={isAdmin} onSave={saveContent} />
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <EditableText id="contact_phone" value={getContent('contact_phone')} isAdmin={isAdmin} onSave={saveContent} />
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Location</h4>
              <p className="text-zinc-500">
                123 Innovation Way<br />
                Tech City, TC 90210
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-100 text-sm text-zinc-400 flex flex-col sm:flex-row justify-between gap-4">
            <p>© 2024 Sylvester's Technology Department. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Admin Login</h2>
                  <p className="text-sm text-zinc-500">Enter password to manage content</p>
                </div>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    autoFocus
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                    placeholder="Default: 123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {loginError && <p className="text-red-500 text-xs mt-2 font-medium">{loginError}</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                >
                  Access Dashboard
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Floating Indicator */}
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <div className="bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Status</span>
              <span className="text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Editing Enabled
              </span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
