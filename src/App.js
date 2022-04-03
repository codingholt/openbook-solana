import githubLogo from './assets/github-logo.svg';
import './App.css';
import idl from './idl.json';
import kp from './keypair.json'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import React, {useEffect, useState} from 'react';
// Constants
// SystemProgram is a reference to the solana runtime
const { SystemProgram} = web3;

//Create a keypair fo rthe account that will hold the text data
const arr =  Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

//get our program's id form the IDL file.
const programID = new PublicKey(idl.metadata.address)

//Set network to devnet
const network = clusterApiUrl('devnet')

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: 'processed'
}

const GITHUB_HANDLE = 'codingholt';
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;


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
    if(inputValue.length  === 0){
      console.log('🤔 Empty input. type some text man.');
      return 
    }
    setInputValue('');
    try{
      const provider = getProvider();
      const program =  new Program(idl, programID, provider);
      await program.rpc.addText(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("✈️ Text successfully sent to program", inputValue)

    getTextList();
    }catch(err){
      console.log('💩 ahh shit.. an error occured in sendText: ', err)
    }
  }

  const onInputChange = (event) =>{
    const { value } = event.target;
    setInputValue(value)
  }

  const getProvider = () =>{
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

const createTextAccount = async () => {
  try{
    const provider = getProvider();
    const program = new Program(idl, programID, provider)
    console.log('🔔 ping!')
    await program.rpc.startStuffOff({
      accounts:{
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    })
    console.log('Created a new baseAccount with address: ', baseAccount.publicKey.toString())
    await getTextList()
  }catch(err){
    console.log('😟 Dang it! an error occurred in createTextAccount: ', (err))
  }
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


  const renderConnectedContainer = () =>{
      if (textList === null){
        return(
          <div className='connected-container'>
            <button className='cta-button submit-text-button' onClick={createTextAccount}>
              Do One-Time Initialization For Open Book Program Account            
              </button>
          </div>
        )
        }else{
       return(
          <div className='connected-container'>
           <form onSubmit={(event) => {
             event.preventDefault();
             sendText()
             }}>
           <input type="text" placeholder='Enter your text!' value={inputValue} onChange={onInputChange}/>
           <button type="submit" className="cta-button submit-text-button">Submit</button>
           </form>
           <div className='text-grid'>
           {textList.map((item, index) => (
            <div className="text-item" key={index}>
      
              <span>{item.submittedText}</span>
              {<div className='user'>from: {item.userAddress.toString()}</div>}
            </div>
          ))}
          
           </div>


          </div>
  )}}

//useEffect
  useEffect(()=>{
  const onLoad =  async () =>{
    await checkIfWalletIsConnected();
  }
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
  },[])



  const getTextList = async () =>{
    try{
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

     
      const account  = await program.account.baseAccount.fetch(baseAccount.publicKey);
      setTextList(account.textList)
    }catch(err){
      console.log('😒 ugh.. we got an error in getTextList: ', err)
      setTextList(null)
    }
  }


  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Text list...');
      getTextList()
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
