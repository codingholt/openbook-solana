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
  'Anyone interested in working together? hit me up @codingholt' 
]


const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [Issolana, setIssolana] = useState(null);
  const [modal, setModal] = useState('no')
  const [inputValue, setInputValue] = useState('');
  const [textList, setTextList] = useState([]);

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

  const sendText = async () =>{
    if(inputValue.length > 0){
      console.log(`text: ${inputValue}`)
      setTextList([...textList, inputValue])
      setInputValue('')
    }else{
      console.log('Empty input. Try again.');
    }
  }

  const onInputChange = (event) =>{
    const { value } = event.target;
    setInputValue(value)
  }

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
      <form onSubmit={(event) => {
        event.preventDefault();
        sendText()
        }}>
      <input type="text" placeholder='Enter your text!' value={inputValue} onChange={onInputChange}/>
      <button type="submit" className="cta-button submit-text-button">Submit</button>
      </form>
      <div className='text-grid'>
        {textList.map((text) => (
          <div className="text-item" key={text}>
            <p>{text}</p>
          </div>
        ))}
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

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching TEXT list...');
      
      // Call Solana program here.
  
      // Set state
      setTextList(TEST_TEXTS);
    }
  }, [walletAddress]);

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
        <footer>
        <div className="footer-container">
          <img alt="github Logo" className="github-logo" src={githubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${GITHUB_HANDLE}`}</a>
        </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
