import githubLogo from './assets/github-logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
// Constants
const GITHUB_HANDLE = 'codingholt';
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;

const TEST_TEXTS = [
  'HI👋',
  'Nice weather today👋',
  'just want to thank you guys 👋',
  'Anyone interested in working together hit me up @codingholt' 
]


const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [Issolana, setIssolana] = useState(null);
  const [modal, setModal] = useState('no')

  const checkIfWalletIsConnected = async () =>{
    try{
      const { solana } = window;

      if (solana){
          if(solana.isPhantom){
            setIssolana(true)
            console.log('Phatom is installed!')
            const response =  await solana.connect({onlyIfTrusted: true})
            console.log(`connected with pubkey: ${response.publicKey.toString()}`)
            setWalletAddress(response.publicKey.toString())
          }
      }else{
        setIssolana(null)
        setModal('modal')
      }
    } catch(err){
      console.error(err)
  } 
  }

  const connectWallet = async () => {
    const { solana } = window;
    if (solana){
      const response = await solana.connect();
      console.log(`Connected with Pubkey: ${response.publicKey.toString()}`)
      setWalletAddress(response.publicKey.toString())
    }
  };

  const noWalletInstalled  = () => (
    <div className='NoWallet'>
      <h2>
      👛 You have no solana wallet installed!
      </h2>
      <p>
        Please install one to use this app, we recommend <a href='https://phantom.app/'>Phantom</a> 
      </p>
    </div>
  )

  const renderNotConnectedContainer = () =>(
    <button
    className='cta-button connect-wallet-button'
    onClick={connectWallet}>
      Connect to Wallet
    </button>
  )


  const renderConnectedContainer = () =>(
    <div className='connected-container'>
      <div className='text-grid'>{
        TEST_TEXTS.map(text =>(
            <div className='text-item' key={text}>
              <p>{text}</p>
            </div>
        ))
      }
      </div>

    </div>
  )

//useEffect
  useEffect(()=>{
  const onLoad =  async () =>{
    await checkIfWalletIsConnected();
  }
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
  },[])

  return (
    <div className="App">
     
      <div className="container">
        <div className="header-container">
          <p className="header">📖 Open Book</p>
          <p className="sub-text">
            everyone can write something in the book ✨
          </p>
          <div className={modal} onClick={() => setModal('no')}>
          {!Issolana && noWalletInstalled()}
          </div>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="github Logo" className="github-logo" src={githubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${GITHUB_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
