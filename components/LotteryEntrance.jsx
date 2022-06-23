import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
    })

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numberOfPlayersFromContract = (await getNumberOfPlayers()).toString()
        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromContract)
        setNumberOfPlayers(numberOfPlayersFromContract)
        setRecentWinner(recentWinnerFromContract) 
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function(tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }

    return (
        <div className="p-5">
            Hi from Lottery Entrance
            {raffleAddress ? (
                <div>
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async function() {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}>
                            { isLoading || isFetching ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> : <div>Enter Raffle</div> }
                        </button>
                    </div>
                    <div>
                        Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH 
                    </div>
                    <div>
                        Number of players: {numberOfPlayers}
                    </div>
                    <div>
                        Recent winner: {recentWinner}
                    </div>
                </div>
            ) : (
                <div>Raffle address not detected</div>
            )}
        </div>
    )
}
