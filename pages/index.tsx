import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Header from "../components/Header";
import { useState } from 'react'


const Home: NextPage = () => {
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');


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
