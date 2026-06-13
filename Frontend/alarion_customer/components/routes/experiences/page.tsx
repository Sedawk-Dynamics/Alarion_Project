import Navbar from '../landing/layout/Navbar'
import Experiences from './features/Experiences'
import Footer from '../landing/layout/Footer'

export default function page() {
  return (
    <>
    <Navbar/>
    <Experiences/>
    <Footer variant='minimal'/>
    </>
  )
}
