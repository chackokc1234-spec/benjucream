"use client";
import { useState, useEffect } from "react";

interface Flavor {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface CartItem extends Flavor {
  quantity: number;
}

interface FlavorCardProps {
  flavor: Flavor;
  onAddToCart: (flavor: Flavor) => void;
}

const FlavorCard = ({ flavor, onAddToCart }: FlavorCardProps) => {
  const fallbackImage = "https://images.unsplash.com/photo-1563805042-7684c8a9e9bc?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-white group flex flex-col transition shadow-sm hover:shadow-md h-full">
      <div className="h-64 md:h-72 bg-gray-200 relative overflow-hidden flex items-center justify-center">
        <img 
          src={flavor.imageUrl || fallbackImage} 
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = fallbackImage; 
          }}
          alt={flavor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 z-10">
          ₹{flavor.price?.toFixed(2) || "150.00"}
        </div>
      </div>
      
      <div className="p-6 md:p-8 space-y-3 flex-grow flex flex-col border-b border-l border-r border-gray-100">
        <span className="text-[10px] tracking-widest uppercase text-[#c29b62] font-semibold">
          {flavor.category || "Premium Batch"}
        </span>
        <h3 className="text-xl md:text-2xl font-serif text-gray-800">{flavor.name}</h3>
        <div className="flex items-start text-sm text-gray-500 mt-2 flex-grow">
          <span className="mr-2 text-[#c29b62]">✦</span>
          <span>{flavor.description || "Freshly churned with organic local ingredients."}</span>
        </div>
        
        <div className="pt-6 mt-4 flex items-center justify-between border-t border-gray-100">
          <a href="#" className="text-[10px] md:text-[11px] tracking-widest font-bold uppercase text-gray-400 hover:text-[#c29b62] transition flex items-center">
            Details
          </a>
          <button 
            onClick={() => onAddToCart(flavor)}
            className="bg-[#1a1a1a] hover:bg-[#c29b62] text-white px-5 py-3 text-[10px] tracking-widest uppercase font-bold transition flex items-center gap-2 active:scale-95"
          >
            <span>🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = (flavor: Flavor) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return; 
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === flavor.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === flavor.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...flavor, quantity: 1 }];
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoginView && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLoginView ? "login" : "signup";
    const payload = isLoginView 
      ? { email, password } 
      : { fullName, email, password };
    
    try {
      const res = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        if (isLoginView) {
          setIsLoggedIn(true);
          setUserProfile({ fullName: data.fullName });
          setShowAuthModal(false);
        } else {
          alert("Account created successfully! Please log in.");
          setIsLoginView(true);
        }
        
        setPassword("");
        setConfirmPassword("");
      } else {
        const errText = await res.text();
        alert(errText || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const defaultFlavors: Flavor[] = [
    { id: 'd1', name: "Madagascar Vanilla", category: "Classic", price: 120.0, description: "Infused with real vanilla bean.", imageUrl: "/ice-cream.png" },
    { id: 'd2', name: "Dark Cocoa Swirl", category: "Signature", price: 180.0, description: "70% single-origin dark chocolate.", imageUrl: "https://images.unsplash.com/photo-1557142046-c704a3adf364?q=80&w=800&auto=format&fit=crop" },
    { id: 'd3', name: "Roasted Pistachio", category: "Premium", price: 220.0, description: "Creamy base with crushed Italian nuts.", imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=800&auto=format&fit=crop" },
    { id: 'd4', name: "Strawberry Basil", category: "Seasonal", price: 160.0, description: "Fresh berries with a hint of basil.", imageUrl: "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=800&auto=format&fit=crop" },
    { id: 'd5', name: "Salted Caramel", category: "Signature", price: 190.0, description: "Sea salt blended with burnt sugar.", imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800&auto=format&fit=crop" },
    { id: 'd6', name: "Mango Sorbet", category: "Vegan", price: 150.0, description: "Alphonso mangoes, entirely dairy-free.", imageUrl: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <main className="min-h-screen text-gray-800 font-sans overflow-x-hidden relative scroll-smooth">
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
            <h2 className="text-3xl font-serif mb-6 text-center">{isLoginView ? "Welcome Back" : "Create Account"}</h2>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginView && (
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-gray-500 mb-1">Full Name</label>
                  <input 
                    type="text" required
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#c29b62]"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-500 mb-1">Email ID</label>
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#c29b62]"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                  {isLoginView ? "Password" : "New Password"}
                </label>
                <input 
                  type="password" required minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#c29b62]"
                />
              </div>
              {!isLoginView && (
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-gray-500 mb-1">Confirm Password</label>
                  <input 
                    type="password" required minLength={6}
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#c29b62]"
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-[#1a1a1a] hover:bg-[#c29b62] text-white py-4 text-[11px] tracking-widest uppercase font-bold transition mt-4">
                {isLoginView ? "Sign In" : "Sign Up"}
              </button>
            </form>
            
            <p className="mt-6 text-center text-xs text-gray-500">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLoginView(!isLoginView)} className="text-[#c29b62] hover:underline font-bold">
                {isLoginView ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-[90] transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 right-0 w-80 md:w-96 bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a] text-white">
          <h2 className="font-serif text-2xl">Your Batch</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-[#c29b62] transition text-xl">✕</button>
        </div>
        
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <span className="text-4xl">🍦</span>
              <p className="text-sm tracking-widest uppercase">Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-serif text-gray-800 text-lg">{item.name}</h4>
                  <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-xl text-gray-800">Subtotal</span>
              <span className="font-bold text-xl text-gray-800">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#c29b62] text-white py-4 tracking-widest text-[11px] uppercase font-bold hover:bg-[#a68250] transition">
              Proceed to Buy
            </button>
          </div>
        )}
      </div>

      <nav className={`fixed top-0 w-full flex justify-between items-center p-5 md:px-12 lg:px-16 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1a1a1a] shadow-lg py-4' : 'bg-transparent py-6 md:py-8'} text-white`}>
        <div className="flex flex-col items-center md:items-start cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="text-lg md:text-xl font-serif tracking-widest">BENJU'S</div>
          <div className="text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[#c29b62]">Creamery</div>
        </div>
        <div className="space-x-8 lg:space-x-10 text-[10px] lg:text-[11px] tracking-widest hidden md:block uppercase font-semibold">
          <a href="#home" className="hover:text-[#c29b62] transition">Home</a>
          <a href="#about" className="hover:text-[#c29b62] transition">About</a>
          <a href="#menu" className="hover:text-[#c29b62] transition">Menu</a>
          <a href="#contact" className="hover:text-[#c29b62] transition">Contact</a>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn && userProfile && (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#c29b62] flex items-center justify-center font-bold text-sm md:text-base uppercase shadow-lg border border-white cursor-pointer" title={userProfile.fullName}>
              {userProfile.fullName.charAt(0)}
            </div>
          )}
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="border border-white px-4 md:px-6 py-2 md:py-3 text-[9px] md:text-[10px] tracking-widest hover:bg-white hover:text-black transition uppercase font-semibold flex items-center gap-2"
          >
            <span>🛒</span> Cart ({cartItemCount})
          </button>
        </div>
      </nav>

      <section id="home" className="relative h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center z-0"></div>
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="z-10 max-w-3xl mt-16 md:mt-24 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6">Flavors That Shape <br className="hidden md:block" /> Your Palate</h1>
          <p className="text-base md:text-lg lg:text-xl font-light tracking-wide text-gray-200 mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0">Exceptional ingredients. Thoughtful craftsmanship. Artisanal ice cream built around your cravings.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#menu" className="bg-[#c29b62] text-white px-8 py-4 tracking-widest text-[10px] md:text-[11px] hover:bg-[#a68250] transition font-bold uppercase w-full sm:w-auto text-center">Explore Our Menu</a>
            <a href="#contact" className="border border-white px-8 py-4 tracking-widest text-[10px] md:text-[11px] hover:bg-white hover:text-black transition font-bold uppercase backdrop-blur-sm bg-white/5 w-full sm:w-auto text-center">Contact Us</a>
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#ebe7df] py-20 md:py-28 px-6 md:px-12 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Signature Scoops", desc: "Discover single-batch flavors that match your lifestyle and cravings.", icon: "🍦" },
              { title: "Custom Cakes", desc: "Strategic dessert solutions for celebrations, parties, and milestones.", icon: "🎂" },
              { title: "Event Catering", desc: "Professional dessert stations designed to delight your guests effortlessly.", icon: "✨" },
              { title: "Vegan Options", desc: "Plant-based guidance to identify delicious dairy-free opportunities.", icon: "🌱" }
            ].map((category, i) => (
              <div key={i} className="bg-white p-8 md:p-10 flex flex-col shadow-sm hover:-translate-y-1 transition duration-300">
                <div className="text-3xl mb-6 text-gray-400">{category.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-500 text-[13px] mb-6 md:mb-8 leading-relaxed flex-grow">{category.desc}</p>
                <a href="#" className="text-[10px] md:text-[11px] tracking-widest font-bold uppercase text-gray-800 hover:text-[#c29b62] transition flex items-center">Learn More <span className="ml-2">&rarr;</span></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="bg-[#faf9f6] py-20 md:py-28 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-12 md:mb-16 text-gray-900 text-center md:text-left">Featured Flavors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {defaultFlavors.map((flavor, index) => (
              <FlavorCard key={flavor.id || index} flavor={flavor} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#181818] text-white pt-20 md:pt-28 pb-8 md:pb-12 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6 mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#f4ece1]">Find Your Perfect Batch</h2>
          <p className="text-gray-400 font-light max-w-xl text-[14px] md:text-[15px] px-4">Whether you're treating yourself, stocking up, or planning your next catered event, we're here to help.</p>
          <button className="bg-[#c29b62] hover:bg-[#a68250] text-white px-8 py-4 tracking-widest text-[10px] md:text-[11px] transition font-bold uppercase mt-4">Start a Conversation</button>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-[12px] md:text-[13px] text-gray-400 border-t border-gray-800 pt-12 md:pt-16">
          <div className="space-y-4">
            <div className="flex flex-col mb-4 md:mb-6">
              <div className="text-xl md:text-2xl font-serif tracking-widest text-[#c29b62]">BENJU'S</div>
            </div>
            <p className="max-w-[200px]">Flavors That Shape Your Palate.</p>
          </div>
          <div className="space-y-3 flex flex-col">
            <span className="text-[#c29b62] tracking-[0.2em] uppercase mb-1 text-[9px] md:text-[10px] font-bold">Company</span>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#menu" className="hover:text-white transition">Services</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <div className="space-y-3 flex flex-col">
            <span className="text-[#c29b62] tracking-[0.2em] uppercase mb-1 text-[9px] md:text-[10px] font-bold">Services</span>
            <a href="#menu" className="hover:text-white transition">Signature Scoops</a>
            <a href="#menu" className="hover:text-white transition">Custom Cakes</a>
            <a href="#menu" className="hover:text-white transition">Event Catering</a>
            <a href="#menu" className="hover:text-white transition">Vegan Options</a>
          </div>
          <div className="space-y-3 flex flex-col">
            <span className="text-[#c29b62] tracking-[0.2em] uppercase mb-1 text-[9px] md:text-[10px] font-bold">Contact</span>
            <span>Kochi, Kerala</span>
            <span>+91 80 4567 8900</span>
            <span>hello@benjuscream.com</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-gray-600 border-t border-gray-800 pt-8 mt-12 md:mt-16 text-center md:text-left">
          <p className="mb-4 md:mb-0">&copy; 2026 Benju's Creamery. All Rights Reserved.</p>
          <div className="space-x-4 md:space-x-6 flex justify-center">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms of Use</a>
          </div>
        </div>
      </footer>
    </main>
  );
}