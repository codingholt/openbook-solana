const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async() =>{

  console.log('🚀 Starting the test...')

  // Create and set the provider.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  //Create baseAccount for our program to use
  const baseAccount = anchor.web3.Keypair.generate();

  //call start_stuff_off, and pas in the params it needs
  const tx = await program.rpc.startStuffOff({
    accounts:{
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log('📝 Your transaction signature: ', tx)

  //Fetch account data
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('👀 Texts Count ', account.totalTexts.toString())

  await program.rpc.addText('Hi, Farza!👋',{
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account =  await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 second text count: ', account.totalTexts.toString())

  console.log('👀 Text list: ', account.textList)
}

const runMain = async () =>{
  try{
    await main()
    process.exit(0)
  }catch(err){
    console.error(err)
    process.exit(1)
  }
}

runMain()