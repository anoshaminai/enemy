import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

// local imports
import styles from '../styles/Home.module.css'
import Header from "../components/Header";


const Home: NextPage = () => {


  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          maybe ur my enemy..
        </h1>

        <p className={styles.description}>
          coming soon
        </p>

      </main>
    </div>
  )


}

export default Home
