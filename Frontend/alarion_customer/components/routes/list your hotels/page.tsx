import React from 'react'
import Navbar from '../landing/layout/Navbar'
import Footer from '../landing/layout/Footer'
import List from './features/List'

export default function page() {
  return (
    <>
    <Navbar/>
    <List/>
    <Footer variant='minimal'/>
    </>
  )
}


