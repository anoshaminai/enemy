import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState } from 'react'
import { useSession , getSession } from 'next-auth/react'

// local imports
import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import { Enemy, processEnemies } from './api/enemies'


type props = {
  enemies: Enemy[],
  initialStatus: boolean[]
}


export const getServerSideProps: getServerSideProps = async ({ req, res}) => {

  const enemies = await processEnemies(req, res);
  let initialStatus = [];

  enemies.forEach((e) => {initialStatus.push(e.isMyEnemy)});

  return {
    props: {
      enemies: enemies,
      initialStatus: initialStatus
    }
  }
}



const EnemyList: NextPage = (props) => {

  const { data: session, status } = useSession();

  const [ checkedState, setCheckedState ] = useState(props.initialStatus);


  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    console.error("I WAS HERE!");
  }

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      let currEnemies : Users[] = [];
      props.enemies.forEach((e, ind) => {
        if (checkedState[ind]) {
          currEnemies.push(e.userData);
        }
      })
      console.error("CURR: ", currEnemies);
      const body = { enemies: currEnemies };
      const res = await fetch('/api/enemies', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status !== 200) {
        console.error("request error: ", res);
      }

      await Router.push('/enemies');
    } catch (error) {
      console.error(error);
    }
  }

  console.log("ANOSHA PROPS: ", props);


  if (!session) {
    return <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <p className={styles.description}>
          you need to be logged in to view this page
          < /p>

        <p className={styles.description}>
          coming soon
        </p>

      </main>
    </div>
  } else {
    return (
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>

          <div>

              <ul className="enemies-list">
                {props.enemies.map((e: Enemy, index) => {
                  return (
                    <li key={index}>
                      <div className="left-section">
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={e.username}
                        value={e.username}
                        defaultChecked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                      />
                      <label htmlFor={`custom-checkbox-${index}`}>{e.username}</label>
                      </div>
                    </li>
                  )
                })}
              </ul>


              <p>
                <button onClick={submitData}>
                  <a>make enemies</a>
                </button>

              </p>

            </div>


        </main>
      </div>
    )

  }


}

export default EnemyList
