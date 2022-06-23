import Head from "next/head"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Raffle</title>
                <meta name="description" content="Smart contract lotter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
