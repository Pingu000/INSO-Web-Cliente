import '../styles/Logo.css'
import logo from '../assets/utad-logo.png'

function Logo() {
  return (
    <div className='logo-container'>
      <img src={logo} alt='Logo U-tad' className='logo-img' />
    </div>
  )
}

export default Logo
