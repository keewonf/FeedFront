import { RiShutDownLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/auth'

import styles from './Header.module.css'

import igniteLogo from '../../assets/ignite-logo.svg'

export function Header() {
  const { signOut } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={igniteLogo} alt="Logotipo do ignite" />
        <strong>Ignite Feed</strong>
      </div>
      <button onClick={signOut} className={styles.logout}>
        <RiShutDownLine/>
      </button>
    </header>
  )
}