import Navbar from '../landing/layout/Navbar';
import Guide from './features/Guide';
import Footer from '../landing/layout/Footer';

export default function page() {
  return (
    <>
      <Navbar />
      <Guide />
      <Footer variant="minimal" />
    </>
  );
}
