import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { servicesCatalog } from '../lib/servicesData';
import { useAuth } from '../context/AuthContext';
import TiltCard from '../components/visuals/TiltCard';

export default function Services() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = (serviceId) => {
    if (user) {
      navigate('/portal');
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <Helmet>
        <title>Services & Pricing — NexVion</title>
        <meta 
          name="description" 
          content="Pick a service. See the price. Book it. Transparent pricing for AI chatbots, Full-Stack SaaS, RAG, Video Generation, and Automation." 
        />
      </Helmet>

      <div className="pt-36 pb-28 max-w-content mx-auto px-6 md:px-12 text-left">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Pick a service. See the price. <br />
            Book it.
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
            All prices are in USD and start from the amount shown. We confirm your final quote after you book.
          </p>
        </div>

        {/* 10 Services Grid (Designer Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {servicesCatalog.map((svc) => (
            <TiltCard
              key={svc.id}
              className="rounded-3xl bg-[#0b0f1d] border border-white/5 p-7 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                  {svc.name}
                </h3>
                <p className="text-xs text-muted leading-relaxed min-h-[36px]">
                  {svc.description}
                </p>

                {/* Price Display */}
                <div className="pt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-sans">
                      ${svc.discountPrice % 1 === 0 ? svc.discountPrice : svc.discountPrice.toFixed(svc.discountPrice % 0.1 === 0 ? 1 : 2)}
                    </span>
                    <span className="text-xs text-muted">
                      {svc.pricingUnit}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="line-through text-muted/60">
                      ${svc.marketPrice}
                    </span>
                    <span className="text-[#fde047] font-semibold text-[11px]">
                      {svc.discountPercent}% off
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="pt-6">
                <button
                  onClick={() => handleBook(svc.id)}
                  className="w-full py-3 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md shadow-yellow-950/20 hover:scale-[1.01]"
                >
                  Book this service
                </button>
              </div>
            </TiltCard>
          ))}
        </div>

      </div>
    </>
  );
}
