import Navbar from '../landing/layout/Navbar';
import WhyAlarion from './features/WhyAlarion';
import Standards from './features/Standards';
import Footer from '../landing/layout/Footer';

export default function page() {
  return (
    <>
      <Navbar />
      <WhyAlarion />
      <Standards />
      <Footer variant="minimal" />
    </>
  );
}
