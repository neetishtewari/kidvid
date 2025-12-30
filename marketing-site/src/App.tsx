import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';

function App() {
  return (
    <div className="app-container">
      <Hero />
      <ProblemSection />
      <FeaturesGrid />
      <SolutionSection />
      <Footer />
    </div>
  );
}

export default App;
